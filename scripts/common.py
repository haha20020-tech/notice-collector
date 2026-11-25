"""공통 도구: HTTP, HTML 표 파서, 제목 필터, 실행 기록, 개인정보 제거.
표준 라이브러리만 사용한다 (pip 설치 불필요).
"""
import http.cookiejar
import json
import re
import time
import urllib.parse
import urllib.request
import urllib.robotparser
from html.parser import HTMLParser

UA = "notice-collector/0.1 (public housing notice research; contact: repo issues)"

# 제외할 제목 키워드 (결과/안내성 글) — 단, "예비입주자 모집공고"는 살린다
EXCLUDE_TITLE = ["당첨자", "발표", "결과", "연기", "전산작업", "이용 안내", "이용안내", "점검", "계약 안내"]
# 토지·상가 등 주택이 아닌 것
EXCLUDE_KIND = ["토지", "상가", "근린생활", "주차장", "점포", "산업단지", "공장", "용지"]

CORRECTION_WORDS = ["정정", "변경공고", "재공고", "취소"]


def is_target_title(title):
    """주택 모집공고인지 제목으로 판단. (True, '') 또는 (False, 사유)"""
    t = (title or "").replace("토지임대부", "")   # 토지임대부 주택은 주택이다
    for w in EXCLUDE_KIND:
        if w in t:
            return False, f"토지·상가 등 제외({w})"
    for w in EXCLUDE_TITLE:
        if w in t:
            return False, f"결과·안내성 글 제외({w})"
    return True, ""


def is_correction_title(title):
    return any(w in (title or "") for w in CORRECTION_WORDS)


CLOSED_STATUS = ("접수마감",)


def is_closed_status(status):
    """목록에 적힌 상태가 '접수마감'인지. SH 게시판은 상태 칸이 없어(빈칸) 걸러지지 않는다."""
    return (status or "").strip() in CLOSED_STATUS


_OPENER = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
_ROBOTS = {}


def robots_ok(url):
    """사이트 robots.txt 가 이 프로그램의 접근을 막으면 False."""
    host = "{0.scheme}://{0.netloc}".format(urllib.parse.urlsplit(url))
    if host not in _ROBOTS:
        rp = urllib.robotparser.RobotFileParser()
        try:
            req = urllib.request.Request(host + "/robots.txt", headers={"User-Agent": UA})
            with _OPENER.open(req, timeout=15) as r:
                rp.parse(r.read().decode("utf-8", "replace").splitlines())
        except Exception:
            rp.parse([])  # robots.txt 를 못 읽으면 제한 없음으로 본다
        _ROBOTS[host] = rp
    return _ROBOTS[host].can_fetch("notice-collector", url)


def http_get(url, headers=None, timeout=30, sleep=1.0, binary=False):
    """GET. 쿠키는 유지하되 로그인·캡차는 우회하지 않는다. robots.txt 금지 경로는 요청하지 않는다."""
    if not robots_ok(url):
        raise PermissionError("robots.txt 가 금지한 경로")
    req = urllib.request.Request(url, headers={"User-Agent": UA, **(headers or {})})
    with _OPENER.open(req, timeout=timeout) as resp:
        raw = resp.read()
        ctype = resp.headers.get("Content-Type", "")
        cdisp = resp.headers.get("Content-Disposition", "")
    time.sleep(sleep)
    if binary:
        return raw, ctype, cdisp
    return decode_html(raw, ctype)


def decode_html(raw, ctype=""):
    m = re.search(r"charset=([\w-]+)", ctype or "", re.I)
    cands = [m.group(1)] if m else []
    head = raw[:2000].decode("ascii", errors="ignore")
    m2 = re.search(r"charset=[\"']?([\w-]+)", head, re.I)
    if m2:
        cands.append(m2.group(1))
    cands += ["utf-8", "euc-kr", "cp949"]
    for c in cands:
        try:
            return raw.decode(c)
        except Exception:
            continue
    return raw.decode("utf-8", errors="replace")


def clean(s):
    return re.sub(r"\s+", " ", (s or "").replace("\xa0", " ")).strip()


class TableParser(HTMLParser):
    """모든 <table>의 행을 읽는다. 각 행: cells(텍스트), links([(텍스트, href, onclick)]), header 여부."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.tables = []
        self._t = None
        self._row = None
        self._cell = None
        self._a = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "table":
            self._t = {"rows": []}
            self.tables.append(self._t)
        elif tag == "tr" and self._t is not None:
            self._end_row()
            self._row = {"cells": [], "links": [], "header": False}
        elif tag in ("td", "th") and self._row is not None:
            self._end_cell()             # </td> 가 빠진 화면 대비
            self._cell = []
            if tag == "th":
                self._row["header"] = True
        elif tag == "a" and self._row is not None:
            self._a = {"text": [], "href": a.get("href", ""), "onclick": a.get("onclick", "")}

    def _end_cell(self):
        if self._cell is not None and self._row is not None:
            self._row["cells"].append(clean("".join(self._cell)))
        self._cell = None

    def _end_row(self):
        self._end_cell()
        if self._row is not None and self._t is not None and self._row["cells"]:
            self._t["rows"].append(self._row)
        self._row = None

    def handle_endtag(self, tag):
        if tag == "a" and self._a is not None and self._row is not None:
            self._row["links"].append((clean("".join(self._a["text"])), self._a["href"], self._a["onclick"]))
            self._a = None
        elif tag in ("td", "th"):
            self._end_cell()
        elif tag in ("tr", "tbody", "thead"):
            self._end_row()
        elif tag == "table":
            self._end_row()
            self._t = None

    def handle_data(self, data):
        if self._cell is not None:
            self._cell.append(data)
        if self._a is not None:
            self._a["text"].append(data)


def parse_tables(html):
    p = TableParser()
    p.feed(html)
    return p.tables


class LinkTextParser(HTMLParser):
    """페이지를 (텍스트 / 링크) 토큰 순서로 펼친다. 표가 아닌 목록형 화면용."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.tokens = []
        self._a = None
        self._skip = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ("script", "style"):
            self._skip += 1
        elif tag == "a":
            self._a = {"text": [], "href": a.get("href", ""), "onclick": a.get("onclick", "")}

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self._skip = max(0, self._skip - 1)
        elif tag == "a" and self._a is not None:
            txt = clean("".join(self._a["text"]))
            if txt:
                self.tokens.append(("a", txt, self._a["href"], self._a["onclick"]))
            self._a = None

    def handle_data(self, data):
        if self._skip:
            return
        if self._a is not None:
            self._a["text"].append(data)
        else:
            t = clean(data)
            if t:
                self.tokens.append(("t", t))


def parse_tokens(html):
    p = LinkTextParser()
    p.feed(html)
    return p.tokens


def digits_from(*texts):
    """href/onclick 에서 글 번호로 보이는 숫자(가장 긴 것)를 뽑는다."""
    best = ""
    for t in texts:
        for m in re.findall(r"\d{3,}", t or ""):
            if len(m) > len(best):
                best = m
    return best


DATE_RE = re.compile(r"(\d{4})[.\-/ ]\s?(\d{1,2})[.\-/ ]\s?(\d{1,2})")


def norm_date(s):
    m = DATE_RE.search(s or "")
    if not m:
        return ""
    return f"{int(m.group(1)):04d}-{int(m.group(2)):02d}-{int(m.group(3)):02d}"


def date_range(s):
    ds = [f"{int(a):04d}-{int(b):02d}-{int(c):02d}" for a, b, c in DATE_RE.findall(s or "")]
    if len(ds) >= 2:
        return ds[0], ds[1]
    if len(ds) == 1:
        return ds[0], ""
    return "", ""


def scrub_personal(text):
    """전화번호·이메일 제거 (담당자 정보 보호)."""
    text = re.sub(r"0\d{1,2}[-\s)]?\d{3,4}[-\s]?\d{4}", "[전화번호 삭제]", text or "")
    text = re.sub(r"[\w.+-]+@[\w-]+\.[\w.-]+", "[이메일 삭제]", text)
    return text


class RunLog:
    """실행 기록. 실패는 '출처·단계·건수·이유'로 남기고 다른 출처는 계속 진행한다."""

    def __init__(self):
        self.started = time.strftime("%Y-%m-%d %H:%M:%S")
        self.sources = {}
        self.failures = []
        self.notes = []

    def src(self, name):
        return self.sources.setdefault(name, {"수집": 0, "제외": 0, "실패": 0})

    def fail(self, source, stage, reason, count=1):
        self.src(source)["실패"] += count
        self.failures.append({"출처": source, "단계": stage, "건수": count, "이유": str(reason)[:300]})

    def note(self, msg):
        self.notes.append(msg)

    def to_dict(self, extra=None):
        d = {"started": self.started, "finished": time.strftime("%Y-%m-%d %H:%M:%S"),
             "sources": self.sources, "failures": self.failures, "notes": self.notes}
        d.update(extra or {})
        return d

    def to_markdown(self, extra=None):
        d = self.to_dict(extra)
        L = [f"# 실행 기록 {d['started']}", ""]
        for k in ("신규", "정정", "변동", "실패", "전체"):
            if k in d:
                L.append(f"- {k}: {d[k]}건")
        L += ["", "## 출처별", "", "| 출처 | 수집 | 제외 | 실패 |", "|---|---|---|---|"]
        for s, v in d["sources"].items():
            L.append(f"| {s} | {v['수집']} | {v['제외']} | {v['실패']} |")
        L += ["", "## 실패 (실패 + 이유)", ""]
        if d["failures"]:
            L += ["| 출처 | 단계 | 건수 | 이유 |", "|---|---|---|---|"]
            for f in d["failures"]:
                L.append(f"| {f['출처']} | {f['단계']} | {f['건수']} | {f['이유']} |")
        else:
            L.append("없음")
        if d["notes"]:
            L += ["", "## 메모", ""] + [f"- {n}" for n in d["notes"]]
        return "\n".join(L) + "\n"


def find_dict_list(obj, want_keys=()):
    """JSON 안에서 dict 목록(공고 행들)을 찾는다. API 응답 모양이 달라도 견디도록."""
    best = []

    def walk(o):
        nonlocal best
        if isinstance(o, list):
            if o and all(isinstance(x, dict) for x in o):
                score = sum(1 for x in o[:3] for k in want_keys if k in x)
                if score > 0 or not best:
                    if len(o) > len(best) or score > 0:
                        best = o
            for x in o:
                walk(x)
        elif isinstance(o, dict):
            for v in o.values():
                walk(v)

    walk(obj)
    return best


def write_json(path, obj):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)


SKIP_ATTACH = ("연락처", "담당자")   # 담당자 개인정보가 든 첨부는 받지 않는다


def skip_attachment(name):
    return any(w in (name or "") for w in SKIP_ATTACH)


def safe_name(name):
    return re.sub(r'[\\/:*?"<>|]', "_", name).strip() or "file"


def save_attachment(out_dir, key, name, url, referer=None):
    """첨부 파일을 out/attachments/<key>/ 에 저장하고 상대 경로를 돌려준다. PDF 여부도 확인."""
    import os
    raw, _, _ = http_get(url, headers={"Referer": referer} if referer else None, binary=True)
    if name.lower().endswith(".pdf") and not raw.startswith(b"%PDF"):
        raise ValueError("PDF가 아닌 응답(오류 화면일 수 있음)")
    d = os.path.join(out_dir, "attachments", key)
    os.makedirs(d, exist_ok=True)
    fn = safe_name(name)
    with open(os.path.join(d, fn), "wb") as f:
        f.write(raw)
    return os.path.join("attachments", key, fn).replace("\\", "/")


def dump_html(out_dir, name, html):
    import os
    d = os.path.join(out_dir, "debug")
    os.makedirs(d, exist_ok=True)
    with open(os.path.join(d, name), "w", encoding="utf-8") as f:
        f.write(html)
