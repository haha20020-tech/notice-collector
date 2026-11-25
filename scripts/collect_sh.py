"""SH(서울주택도시공사) 공고 게시판 수집 — i-sh.co.kr '공고 및 공지' (2026-11-24 실제 화면으로 확인).

목록  GET  .../brd/m_247/list.do?multi_itm_seq=2&page=N        (10건/쪽, 2=주택임대 1=주택분양)
       행: <a onclick="getDetailView('313481')">제목</a>      -> 글번호(seq)=313481 (화면의 '번호' 열과 다름)
상세  GET  .../brd/m_247/view.do?seq=313481&multi_itm_seq=2
       첨부 목록: 스크립트 안 initParam.downList = [{brdId, seq, fileSeq, oriFileNm, fileTp}, ...]
첨부  GET  /app/com/file/innoFD.do?brdId=..&seq=..&fileTp=..&fileSeq=..

화면의 상세 이동은 대기열(NetFunnel) 위젯을 거치지만, 이 위젯은 오류 시에도 그대로 이동시키는 부하 분산용이다.
그래도 부담을 줄이려고 상세·첨부는 '새 글'에만, 요청 사이 2초씩 쉬며 읽는다. --sh-no-detail 로 끌 수 있다.
"""
import json
import re
import urllib.parse

from common import (dump_html, digits_from, http_get, is_correction_title, is_target_title,
                    norm_date, parse_tables, save_attachment, skip_attachment)

SOURCE = "SH"
HOST = "https://www.i-sh.co.kr"
BASE = HOST + "/app/lay2/program/S1T294C297/www/brd/m_247"
LIST_URL = BASE + "/list.do?multi_itm_seq={m}&page={p}"
VIEW_URL = BASE + "/view.do?seq={seq}&multi_itm_seq={m}"
FILE_URL = HOST + "/app/com/file/innoFD.do?brdId={brdId}&seq={seq}&fileTp={fileTp}&fileSeq={fileSeq}"
BOARD_NAME = {1: "주택분양", 2: "주택임대"}


def find_columns(table):
    for r in table["rows"]:
        if r["header"]:
            col = {}
            for i, h in enumerate(r["cells"]):
                if "제목" in h:
                    col["title"] = i
                elif "등록" in h or "작성" in h:
                    col["date"] = i
                elif h == "번호":
                    col["no"] = i
            if "title" in col:
                return col
    return None


def parse_list(html):
    """-> (rows, error). rows: dict(seq, title, date, no)"""
    for t in parse_tables(html):
        col = find_columns(t)
        if not col:
            continue
        out = []
        for r in t["rows"]:
            if r["header"] or len(r["cells"]) <= col["title"]:
                continue
            link = r["links"][0] if r["links"] else ("", "", "")
            m = re.search(r"getDetailView\(\s*'(\d+)'", link[2] or "")
            seq = m.group(1) if m else digits_from(link[1], link[2])
            out.append({"seq": seq, "title": r["cells"][col["title"]],
                        "date": norm_date(r["cells"][col["date"]]) if "date" in col else "",
                        "no": r["cells"][col["no"]] if "no" in col else ""})
        return out, ""
    return [], "표 머리글(제목)을 찾지 못함 — 화면 구조가 바뀌었거나 차단됨"


def parse_downlist(html):
    """상세 화면 스크립트의 initParam.downList 를 읽는다. 없으면 []."""
    m = re.search(r"initParam\.downList\s*=\s*(\[.*?\])\s*;", html, re.S)
    if not m:
        return []
    try:
        return json.loads(m.group(1))
    except Exception:
        return []


def collect(log, out_dir, known_keys=(), max_pages=5, boards=(2,), download=True, detail=True, dump=False):
    rows = []
    st = log.src(SOURCE)
    for m in boards:
        stop = False
        for p in range(1, max_pages + 1):
            try:
                html = http_get(LIST_URL.format(m=m, p=p))
            except Exception as e:
                log.fail(SOURCE, "목록", f"{BOARD_NAME.get(m, m)} {p}쪽: {type(e).__name__} {e}")
                break
            items, err = parse_list(html)
            if not items and not err and p > 1:
                break                    # 마지막 쪽을 지남
            if err or not items:
                log.fail(SOURCE, "목록", f"{BOARD_NAME.get(m, m)} {p}쪽: {err or '행 0건'}")
                if dump:
                    dump_html(out_dir, f"sh_list_{m}_{p}.html", html)
                break
            for it in items:
                if not it["seq"]:
                    log.fail(SOURCE, "목록", f"글번호를 못 찾음: {it['title'][:30]}")
                    continue
                key = f"SH-{it['seq']}"
                if key in known_keys:
                    stop = True          # 이미 본 글 — 그 아래는 지난 글
                    break
                ok, _ = is_target_title(it["title"])
                # SH 게시판에는 시스템 공지도 섞여 있다: '모집'·'공고'가 없는 글은 뺀다
                if not ok or not re.search(r"모집|공고", it["title"]):
                    st["제외"] += 1
                    continue
                row = {"key": key, "org": "SH", "source": SOURCE, "title": it["title"],
                       "posted_date": it["date"], "apply_start": "", "apply_end": "", "status": "",
                       "type": BOARD_NAME.get(m, ""), "region": "서울", "correction_of": "",
                       "is_correction": is_correction_title(it["title"]),
                       "attachments": "", "detail_url": VIEW_URL.format(seq=it["seq"], m=m)}
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
    files = parse_downlist(html)
    if not files:
        if "downList" not in html and dump:
            dump_html(out_dir, f"sh_detail_{row['key']}.html", html)
        return
    saved = []
    for f in files:
        name = f.get("oriFileNm") or f"{row['key']}_{f.get('fileSeq', '')}"
        if skip_attachment(name):
            saved.append(name + " (담당자 정보라 받지 않음)")
            continue
        if not download or not name.lower().endswith(".pdf"):
            saved.append(name + (" (미저장)" if download else ""))
            continue
        url = FILE_URL.format(**{k: urllib.parse.quote(str(f.get(k, ""))) for k in ("brdId", "seq", "fileTp", "fileSeq")})
        try:
            saved.append(save_attachment(out_dir, row["key"], name, url, referer=row["detail_url"]))
        except Exception as e:
            log.fail(SOURCE, "첨부", f"{row['key']} {name}: {type(e).__name__} {e}")
            saved.append(name + " (받기 실패)")
    row["attachments"] = " | ".join(saved)
