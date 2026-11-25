"""모든 출처를 모아 통합 목록(list.csv / list.json)과 실행 기록(run_log.md / .json)을 만든다.
사용:  python scripts/run_all.py            (모두)   |   --only sh,gh   (일부만)"""
import argparse
import csv
import json
import os
import re
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import RunLog, is_closed_status, write_json  # noqa: E402

COLS = ["key", "org", "source", "title", "posted_date", "apply_start", "apply_end", "status",
        "type", "region", "correction_of", "is_correction", "attachments", "detail_url", "collected_at"]
from extract_terms import NEW_COLS  # noqa: E402  (자격 조건 열: 웹앱 매칭용)
COLS = COLS + NEW_COLS
WATCH = ("title", "apply_start", "apply_end", "status")


def base_title(t):
    t = re.sub(r"\(.*?\)|\[.*?\]", "", t or "")
    t = re.sub(r"정정공고|정정|변경공고|재공고|공고문", "", t)
    return re.sub(r"[\s\-_·,.]", "", t)


def link_corrections(rows):
    """정정공고(제목에 '정정' 등)를 같은 기관·같은 기본 제목의 원공고에 연결한다.
    원공고 후보에는 상태가 '정정공고중'인 행도 넣는다(LH는 정정이 나오면 원공고 상태가 바뀐다).
    정정공고 자신(제목에 정정 말이 있는 행)만 후보에서 뺀다."""
    from common import is_correction_title
    originals = {}
    for r in rows:
        if not is_correction_title(r["title"]):
            originals.setdefault((r["org"], base_title(r["title"])), r["key"])
    for r in rows:
        if r["is_correction"] and not r["correction_of"]:
            hit = originals.get((r["org"], base_title(r["title"])), "")
            if hit != r["key"]:
                r["correction_of"] = hit


def drop_closed(rows, log=None):
    """상태가 '접수마감'인 행을 뺀다. 반환: (남은 행, 뺀 건수). log 를 주면 그 출처의 수집 → 제외로 옮겨 센다."""
    keep, dropped = [], 0
    for r in rows:
        if is_closed_status(r.get("status")):
            dropped += 1
            if log is not None and r.get("source"):
                s = log.src(r["source"])
                s["수집"] = max(0, s["수집"] - 1)
                s["제외"] += 1
        else:
            keep.append(r)
    return keep, dropped


def load_prev(out):
    p = os.path.join(out, "list.json")
    if os.path.exists(p):
        try:
            with open(p, encoding="utf-8") as f:
                return {r["key"]: r for r in json.load(f)}
        except Exception:
            return {}
    return {}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="out")
    ap.add_argument("--only", default="lh,myhome,sh,gh")
    ap.add_argument("--sh-boards", default="2")
    ap.add_argument("--max-pages", type=int, default=5)
    ap.add_argument("--no-download", action="store_true", help="첨부 PDF를 받지 않음")
    ap.add_argument("--dump-html", action="store_true", help="실패 시 원본 HTML을 out/debug 에 저장")
    ap.add_argument("--no-detail", action="store_true", help="SH·GH 상세 화면(접수기간·첨부)을 읽지 않음")
    ap.add_argument("--skip-closed", action="store_true",
                    help="상태가 '접수마감'인 공고는 모으지 않고, 이전 목록에 남은 마감 공고도 뺌 "
                         "(GH는 상세·첨부를 읽기 전에 거름. SH는 상태 칸이 없어 거르지 못함)")
    ap.add_argument("--lh-files", action="store_true", help="LH 공고 첨부 PDF를 상세 API로 받음(이미 받은 공고는 건너뜀)")
    ap.add_argument("--extract", action="store_true",
                    help="저장된 공고문 PDF에서 자격 조건(소득·자산·계층 등)을 뽑아 열로 붙임 (pdftotext 필요)")
    ap.add_argument("--build-webapp", action="store_true",
                    help="수집이 끝나면 자격진단 웹앱 데이터(data/notices.json·notices_bundle.js)를 새로 만든다 "
                         "(웹앱 폴더가 옆에 있을 때만, --out 기본값 out 일 때만)")
    ap.add_argument("--wp-posts", default=os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "wp_posts.csv"),
                    help="게시한 글 주소 표(key,wp_post_url). 웹앱 화면 C가 쓴다")
    a = ap.parse_args()

    os.makedirs(a.out, exist_ok=True)
    log = RunLog()
    prev = load_prev(a.out)
    known = set(prev)
    only = {s.strip() for s in a.only.split(",")}
    rows = []

    def guarded(name, fn):
        try:
            rows.extend(fn())
        except Exception as e:  # 한 출처가 죽어도 나머지는 계속
            log.fail(name, "실행", f"{type(e).__name__} {e}")

    if "lh" in only:
        import collect_lh
        guarded("LH", lambda: collect_lh.collect(log))
        if a.lh_files:
            lh_rows = [r for r in rows if r.get("org") == "LH"]
            todo = []
            for r in lh_rows:
                had = (prev.get(r["key"]) or {}).get("attachments")
                if had:
                    r["attachments"] = had
                else:
                    todo.append(r)
            guarded("LH", lambda: collect_lh.fetch_files(todo, a.out, log) or [])
    if "myhome" in only:
        import collect_myhome
        guarded("마이홈", lambda: collect_myhome.collect(log))
    if "sh" in only:
        import collect_sh
        boards = [int(x) for x in a.sh_boards.split(",")]
        guarded("SH", lambda: collect_sh.collect(log, a.out, known_keys=known, max_pages=a.max_pages,
                                                 boards=boards, download=not a.no_download,
                                                 detail=not a.no_detail, dump=a.dump_html))
    if "gh" in only:
        import collect_gh
        guarded("GH", lambda: collect_gh.collect(log, a.out, known_keys=known, max_pages=a.max_pages,
                                                 download=not a.no_download, detail=not a.no_detail,
                                                 dump=a.dump_html, skip_closed=a.skip_closed))

    if a.skip_closed:
        rows, n_rows = drop_closed(rows, log)

    now = time.strftime("%Y-%m-%d %H:%M")
    merged = dict(prev)           # 이전 목록 위에 이번 결과를 덮어 쓴다
    new = corr = changed = 0
    for r in rows:
        r["collected_at"] = now
        old = prev.get(r["key"])
        if old is None:
            new += 1
            if r["is_correction"]:
                corr += 1
        elif any(old.get(k) != r.get(k) for k in WATCH):
            changed += 1
        if old and not r.get("attachments"):
            r["attachments"] = old.get("attachments", "")
        merged[r["key"]] = r
    final = list(merged.values())
    if a.skip_closed:             # 이전 목록에 남아 있던 마감 공고도 뺀다(새로 마감된 것 포함)
        final, n_prev = drop_closed(final)
        if n_rows or n_prev:
            log.note(f"마감 공고 제외(--skip-closed): 이번에 받은 목록에서 {n_rows}건, 이전 목록에서 {n_prev}건")
    link_corrections(final)
    import extract_terms
    if a.extract:
        extract_terms.run(final, a.out, log, wp_posts_path=a.wp_posts)
    else:
        posts = extract_terms.load_wp_posts(a.wp_posts)
        for r in final:
            r["wp_post_url"] = posts.get(r["key"], r.get("wp_post_url", ""))
    final.sort(key=lambda r: (r.get("posted_date") or ""), reverse=True)

    with open(os.path.join(a.out, "list.csv"), "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=COLS, extrasaction="ignore")
        w.writeheader()
        w.writerows(final)
    write_json(os.path.join(a.out, "list.json"), final)

    extra = {"신규": new, "정정": corr, "변동": changed, "실패": sum(x["건수"] for x in log.failures),
             "전체": len(final)}
    write_json(os.path.join(a.out, "run_log.json"), log.to_dict(extra))
    with open(os.path.join(a.out, "run_log.md"), "w", encoding="utf-8") as f:
        f.write(log.to_markdown(extra))
    print(log.to_markdown(extra))
    if a.build_webapp:
        build_webapp(a.out)


def build_webapp(out_dir):
    """웹앱의 build_data.py 는 out/list.csv 를 읽어 notices.json·notices_bundle.js 를 만든다."""
    import subprocess
    here = os.path.dirname(os.path.abspath(__file__))
    script = os.path.normpath(os.path.join(here, "..", "..", "자격진단웹앱", "scripts", "build_data.py"))
    default_out = os.path.normpath(os.path.join(here, "..", "out"))
    if os.path.normpath(os.path.abspath(out_dir)) != default_out:
        print("웹앱 데이터 갱신 건너뜀: --out 이 기본 out 폴더가 아님")
        return
    if not os.path.exists(script):
        print("웹앱 데이터 갱신 건너뜀: 자격진단웹앱/scripts/build_data.py 없음")
        return
    r = subprocess.run([sys.executable, script], capture_output=True, text=True)
    print("웹앱 데이터 갱신" + (" 완료" if r.returncode == 0 else " 실패"))
    print((r.stdout if r.returncode == 0 else r.stderr).strip()[:600])


if __name__ == "__main__":
    main()
