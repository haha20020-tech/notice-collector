"""GH(경기주택도시공사) 공고 수집 — apply.gh.or.kr 공고 목록 (2026-11-24 실제 화면으로 확인, robots.txt 허용).

목록  GET  /sb/sr/sr7150/selectPbancRentHouseList.do?pageIndex=N   임대주택(국민·행복·통합공공 등)
      GET  /sb/sr/sr7155/selectPbancRentHouseList.do?pageIndex=N   매입임대
      (상가임대 sr7170 은 수집하지 않음)
      표 머리글: 번호|유형|공고명|지역|첨부|게시일|마감일|상태|경쟁률|조회수
      공고명 링크: <a data-pbancno="843" data-pbanckndcd="01" data-biztynm="국민임대">
상세  GET  /sb/sr/<메뉴>/selectPbancDetailView.do?pbancNo=..&pbancKndCd=..&previewYn=N&bizTyNm=..
      첨부: https://apply-cdn.gh.or.kr/sr/<메뉴>/selectFileDown.do?... 링크 (PDF만 저장)
      접수기간: 본문 '접수기간 : 2026.11.24 10:00 ~ 2026.11.26 18:00'
"""
import re
import urllib.parse
from html.parser import HTMLParser

from common import (clean, date_range, dump_html, http_get, is_closed_status, is_correction_title,
                    is_target_title, norm_date, save_attachment, skip_attachment)

SOURCE = "GH"
HOST = "https://apply.gh.or.kr"
MENUS = {"sr7150": "임대주택", "sr7155": "매입임대"}
LIST_URL = HOST + "/sb/sr/{menu}/selectPbancRentHouseList.do?pageIndex={p}"
VIEW_URL = HOST + "/sb/sr/{menu}/selectPbancDetailView.do?{q}"


class _ListParser(HTMLParser):
    """첫 번째 표의 행마다 칸 텍스트와 공고명 링크의 data-* 속성을 모은다."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.headers, self.rows = [], []
        self._in_table = 0
        self._row = self._cell = None
        self._is_th = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "table":
            self._in_table += 1
        if tag == "tr" and self._in_table:
            self._flush_row()
            self._row = {"cells": [], "data": {}}
        elif tag in ("td", "th") and self._row is not None:
            self._flush_cell()           # GH 화면은 </td> 를 빠뜨린 칸이 있다
            self._cell, self._is_th = [], tag == "th"
        elif tag == "a" and self._row is not None and a.get("data-pbancno"):
            self._row["data"] = {k[5:]: v for k, v in a.items() if k.startswith("data-")}

    def _flush_cell(self):
        if self._cell is not None and self._row is not None:
            self._row["cells"].append((clean("".join(self._cell)), self._is_th))
        self._cell = None

    def _flush_row(self):
        self._flush_cell()
        if self._row is None:
            return
        cells = self._row["cells"]
        if cells and all(th for _, th in cells) and not self.headers:
            self.headers = [c for c, _ in cells]
        elif cells and self._row["data"]:
            self.rows.append({"cells": [c for c, _ in cells], "data": self._row["data"]})
        self._row = None

    def handle_endtag(self, tag):
        if tag in ("td", "th"):
            self._flush_cell()
        elif tag in ("tr", "tbody", "thead"):
            self._flush_row()
        elif tag == "table":
            self._flush_row()
            self._in_table -= 1

    def handle_data(self, data):
        if self._cell is not None:
            self._cell.append(data)


def parse_list(html):
    """-> (rows, error)"""
    p = _ListParser()
    p.feed(html)
    h = p.headers
    if "공고명" not in h:
        return [], "표 머리글(공고명)을 찾지 못함 — 화면 구조가 바뀌었거나 차단됨"
    idx = {name: h.index(name) for name in ("유형", "공고명", "지역", "게시일", "마감일", "상태") if name in h}
    out = []
    for r in p.rows:
        c = r["cells"]
        get = lambda n: c[idx[n]] if n in idx and idx[n] < len(c) else ""
        out.append({"pbancNo": r["data"].get("pbancno", ""), "kind_cd": r["data"].get("pbanckndcd", ""),
                    "biz": r["data"].get("biztynm", "") or get("유형"), "preview": r["data"].get("previewyn", "N"),
                    "title": get("공고명"), "region": get("지역"), "posted": norm_date(get("게시일")),
                    "end": norm_date(get("마감일")), "status": get("상태").replace("-", "")})
    return out, ""


def parse_detail(html):
    """-> (files[(name,url)], apply_start, apply_end)"""
    files = []
    for m in re.finditer(r'<a\b[^>]*href="([^"]*selectFileDown\.do[^"]*)"[^>]*>(.*?)</a>', html, re.S | re.I):
        url = m.group(1).replace("&amp;", "&")
        name = clean(re.sub(r"<[^>]+>", "", m.group(2)))
        name = re.sub(r"\s*\(\d+\s*Byte\)\s*$", "", name, flags=re.I)
        files.append((name, url))
    text = clean(re.sub(r"<[^>]+>", " ", html))
    m = re.search(r"접수\s*기간\s*[:：]?\s*(.{0,60})", text)
    s, e = date_range(m.group(1)) if m else ("", "")
    return files, s, e


def collect(log, out_dir, known_keys=(), max_pages=3, download=True, detail=True, dump=False, skip_closed=False):
    rows = []
    st = log.src(SOURCE)
    for menu, menu_name in MENUS.items():
        stop = False
        for p in range(1, max_pages + 1):
            url = LIST_URL.format(menu=menu, p=p)
            try:
                html = http_get(url)
            except Exception as e:
                log.fail(SOURCE, "목록", f"{menu_name} {p}쪽: {type(e).__name__} {e}")
                break
            items, err = parse_list(html)
            if err or not items:
                if err or p == 1:
                    log.fail(SOURCE, "목록", f"{menu_name} {p}쪽: {err or '행 0건'}")
                    if dump:
                        dump_html(out_dir, f"gh_list_{menu}_{p}.html", html)
                break
            for it in items:
                if not it["pbancNo"]:
                    log.fail(SOURCE, "목록", f"공고번호를 못 찾음: {it['title'][:30]}")
                    continue
                key = f"GH-{it['pbancNo']}"
                if key in known_keys:
                    stop = True
                    break
                ok, _ = is_target_title(it["title"])
                if not ok or "상가" in it["biz"]:
                    st["제외"] += 1
                    continue
                if skip_closed and is_closed_status(it["status"]):   # 상세·첨부를 읽기 전에 뺀다
                    st["제외"] += 1
                    continue
                q = urllib.parse.urlencode({"pbancNo": it["pbancNo"], "pbancKndCd": it["kind_cd"],
                                            "previewYn": it["preview"], "bizTyNm": it["biz"]})
                row = {"key": key, "org": "GH", "source": SOURCE, "title": it["title"],
                       "posted_date": it["posted"], "apply_start": "", "apply_end": it["end"],
                       "status": it["status"], "type": it["biz"], "region": it["region"] or "경기",
                       "correction_of": "", "is_correction": is_correction_title(it["title"]),
                       "attachments": "", "detail_url": VIEW_URL.format(menu=menu, q=q)}
                if detail:
                    _detail(row, log, out_dir, download, dump)
                rows.append(row)
                st["수집"] += 1
            if stop:
                break
    return rows


def _detail(row, log, out_dir, download, dump):
    try:
        html = http_get(row["detail_url"], sleep=2.0)
    except Exception as e:
        log.fail(SOURCE, "상세", f"{row['key']}: {type(e).__name__} {e}")
        return
    files, s, e = parse_detail(html)
    if s:
        row["apply_start"] = s
    if e:
        row["apply_end"] = e
    if not files and dump:
        dump_html(out_dir, f"gh_detail_{row['key']}.html", html)
    saved = []
    for name, url in files:
        if skip_attachment(name):
            saved.append(name + " (담당자 정보라 받지 않음)")
            continue
        if not download or not name.lower().endswith(".pdf"):
            saved.append(name + (" (미저장)" if download else ""))
            continue
        try:
            saved.append(save_attachment(out_dir, row["key"], name, url, referer=row["detail_url"]))
        except Exception as ex:
            log.fail(SOURCE, "첨부", f"{row['key']} {name}: {type(ex).__name__} {ex}")
            saved.append(name + " (받기 실패)")
    row["attachments"] = " | ".join(saved)
