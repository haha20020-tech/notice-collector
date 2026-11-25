"""마이홈 API: SH·GH 행이 있는지 '세기만' 하고, LH 중복은 버린다. 그 밖의 기관 행은 목록에 넣는다.
(2026-11-23 확인: SH·GH는 0건이었다 — 그래도 매 실행마다 세어서 기록한다.)"""
import json
import os
import time
import urllib.parse
import urllib.request

from common import find_dict_list, is_correction_title, norm_date

SOURCE = "마이홈"
ENDPOINT = "https://apis.data.go.kr/1613000/HWSPR02/rsdtRcritNtcList"


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a):
        raise RuntimeError("redirect refused")


def fetch(page, rows):
    key = os.environ.get("DATA_GO_KR_KEY", "")
    if not key:
        raise RuntimeError("DATA_GO_KR_KEY 환경변수가 없음")
    q = urllib.parse.urlencode({"serviceKey": key, "resultType": "json",
                                "numOfRows": rows, "pageNo": page})
    req = urllib.request.Request(ENDPOINT + "?" + q, headers={"Accept": "application/json"})
    with urllib.request.build_opener(NoRedirect()).open(req, timeout=30) as r:
        raw = r.read()
    try:
        return json.loads(raw.decode("utf-8"))
    except Exception:
        raise RuntimeError("JSON 아님(XML 오류 응답): " + raw.decode("utf-8", "replace")[:200])


def org_kind(name):
    n = name or ""
    if "한국토지주택공사" in n or n.strip() == "LH":
        return "LH"
    if "서울주택도시" in n or n.strip() == "SH":
        return "SH"
    if "경기주택도시" in n or n.strip() == "GH":
        return "GH"
    return "기타"


def collect(log, page_size=100, max_pages=10):
    rows, seen = [], set()
    cnt = {"LH": 0, "SH": 0, "GH": 0, "기타": 0}
    st = log.src(SOURCE)
    for page in range(1, max_pages + 1):
        try:
            data = fetch(page, page_size)
        except Exception as e:
            log.fail(SOURCE, "목록", f"{page}쪽: {e}")
            break
        items = find_dict_list(data, ("pblancId", "pblancNm"))
        if not items:
            break
        for it in items:
            pid = str(it.get("pblancId", ""))
            if pid in seen:
                continue            # 같은 공고의 다른 호(houseSn) 행
            seen.add(pid)
            kind = org_kind(str(it.get("suplyInsttNm", "")))
            cnt[kind] += 1
            if kind in ("LH", "SH", "GH"):
                continue            # LH는 LH API가 정본, SH·GH는 게시판에서 수집
            title = str(it.get("pblancNm", ""))
            rows.append({
                "key": f"MH-{pid}", "org": str(it.get("suplyInsttNm", "")), "source": SOURCE,
                "title": title,
                "posted_date": norm_date(str(it.get("rcritPblancDe", ""))),
                "apply_start": norm_date(str(it.get("beginDe", ""))),
                "apply_end": norm_date(str(it.get("endDe", ""))),
                "status": str(it.get("sttusNm", "")),
                "type": " ".join(x for x in (str(it.get("suplyTyNm", "") or ""), str(it.get("houseTyNm", "") or "")) if x),
                "region": str(it.get("brtcNm", "") or ""),
                "correction_of": f"MH-{it['beforePblancId']}" if it.get("beforePblancId") else "",
                "is_correction": is_correction_title(title) or "정정" in str(it.get("sttusNm", "")) or bool(it.get("beforePblancId")),
                "attachments": "", "detail_url": str(it.get("url") or it.get("pcUrl") or ""),
            })
            st["수집"] += 1
        if len(items) < page_size:
            break
        time.sleep(0.5)
    log.note(f"마이홈 기관별 공고 수(공고번호 기준): LH {cnt['LH']} / SH {cnt['SH']} / GH {cnt['GH']} / 기타 {cnt['기타']}")
    if cnt["SH"] or cnt["GH"]:
        log.note("마이홈에 SH·GH 행이 생겼음 — 게시판 수집 결과와 비교해 볼 것")
    return rows
