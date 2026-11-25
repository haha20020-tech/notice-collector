"""LH 공고 수집 (공공데이터포털 API). 키는 환경변수 DATA_GO_KR_KEY.

CONNECTOR.md(2026-11-22 확인) 기준:
- 날짜 검색 조건은 검증되지 않았으므로 보내지 않는다. 서버가 기본으로 최근 두 달 공고를 돌려준다(ALL_CNT 541건 확인).
- 공고 필드: PAN_ID, PAN_NM, UPP_AIS_TP_NM, AIS_TP_CD_NM, CNP_CD_NM, PAN_SS, PAN_NT_ST_DT, CLSG_DT, DTL_URL
"""
import time

import lh
from common import find_dict_list, is_correction_title, norm_date

SOURCE = "LH"
DROP_TYPES = ("토지", "상가")


def g(d, *names):
    for n in names:
        if n in d and d[n] not in (None, ""):
            return str(d[n]).strip()
    return ""


def collect(log, page_size=100, max_pages=20):
    rows = []
    st = log.src(SOURCE)
    for page in range(1, max_pages + 1):
        params = {"resultType": "json", "PG_SZ": str(page_size), "PAGE": str(page)}
        try:
            data = lh.call(lh.ENDPOINTS["notices"], params)
        except SystemExit:
            log.fail(SOURCE, "목록", f"{page}쪽: API가 JSON이 아닌 응답(키·활용신청·한도 확인)")
            break
        except Exception as e:
            log.fail(SOURCE, "목록", f"{page}쪽: {type(e).__name__} {e}")
            break
        items = [x for x in find_dict_list(data, ("PAN_ID",)) if x.get("PAN_ID")]   # dsSch(검색조건 메아리)는 제외
        if not items:
            break
        for it in items:
            typ = g(it, "AIS_TP_CD_NM", "UPP_AIS_TP_NM")
            title = g(it, "PAN_NM")
            if any(w in g(it, "UPP_AIS_TP_NM") + typ for w in DROP_TYPES):
                st["제외"] += 1
                continue
            pid = g(it, "PAN_ID")
            rows.append({
                "key": f"LH-{pid}",
                "org": "LH", "source": SOURCE,
                "title": title,
                "posted_date": norm_date(g(it, "PAN_NT_ST_DT", "PAN_DT")),
                "apply_start": "",
                "apply_end": norm_date(g(it, "CLSG_DT")),
                "status": g(it, "PAN_SS"),
                "type": typ,
                "region": g(it, "CNP_CD_NM"),
                "correction_of": "",
                "is_correction": is_correction_title(title) or "정정" in g(it, "PAN_SS"),
                "attachments": "",
                "detail_url": g(it, "DTL_URL"),
                # 상세 API 호출에 필요한 값(목록 파일에는 안 쓰이고 list.json 에만 남는다)
                "_spl_inf_tp_cd": g(it, "SPL_INF_TP_CD"),
                "_ccr_cnnt_sys_ds_cd": g(it, "CCR_CNNT_SYS_DS_CD"),
                "_upp_ais_tp_cd": g(it, "UPP_AIS_TP_CD"),
            })
            st["수집"] += 1
        if len(items) < page_size:
            break
        time.sleep(0.5)
    return rows


def fetch_files(rows, out_dir, log, call=None, save=None, pause=0.5):
    """LH 공고마다 상세 API(dsAhflInfo)의 AHFL_URL 로 첨부 PDF를 받아 out/attachments/<key>/ 에 저장하고
    row['attachments'] 에 파일 경로를 채운다. 실패는 이유별로 log 에 남긴다. (call/save 는 시험용 대체 함수)"""
    import common
    call = call or lh.call
    save = save or common.save_attachment
    st = log.src(SOURCE)
    for r in rows:
        pid = r["key"].replace("LH-", "", 1)
        need = [r.get("_spl_inf_tp_cd"), r.get("_ccr_cnnt_sys_ds_cd"), r.get("_upp_ais_tp_cd")]
        if not all(need):
            log.fail(SOURCE, "첨부", f"{r['key']}: 상세 API 호출값(SPL_INF_TP_CD 등)이 목록에 없음")
            continue
        try:
            data = call(lh.ENDPOINTS["detail"], {"resultType": "json", "PG_SZ": "50", "PAGE": "1",
                        "SPL_INF_TP_CD": need[0], "CCR_CNNT_SYS_DS_CD": need[1], "PAN_ID": pid,
                        "UPP_AIS_TP_CD": need[2]})
        except SystemExit:
            log.fail(SOURCE, "첨부", f"{r['key']}: 상세 API가 JSON이 아닌 응답")
            continue
        except Exception as e:
            log.fail(SOURCE, "첨부", f"{r['key']}: 상세 API {type(e).__name__} {e}")
            continue
        files = [x for x in find_dict_list(data, ("AHFL_URL",)) if x.get("AHFL_URL")]
        if not files:
            log.fail(SOURCE, "첨부", f"{r['key']}: 상세 응답에 첨부(dsAhflInfo)가 없음")
            continue
        got = []
        for x in files:
            name = g(x, "CMN_AHFL_NM") or "attachment.pdf"
            try:
                got.append(save(out_dir, r["key"], name, g(x, "AHFL_URL"), None))
            except Exception as e:
                log.fail(SOURCE, "첨부", f"{r['key']}: {name} 받기 실패 — {type(e).__name__} {e}")
            time.sleep(pause)
        if got:
            r["attachments"] = " | ".join(got)
            st["수집"] += 0
