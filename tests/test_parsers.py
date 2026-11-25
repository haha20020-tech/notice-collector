"""실제 화면(2026-11-24 확인)과 같은 모양의 가짜 HTML로 파서·합치기를 시험한다. 네트워크 불필요.
실행: python tests/test_parsers.py"""
import json, os, sys, tempfile
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "scripts"))
import common, collect_sh, collect_gh, collect_lh, collect_myhome, run_all, lh

SH_LIST = """<table class="search"><tr><th>준비사항</th><th>비고</th></tr><tr><td>x</td><td>y</td></tr></table>
<table><thead><tr><th>번호</th><th>제목</th><th>담당부서</th><th>등록일</th><th>조회수</th></tr></thead><tbody>
<tr><td>1741</td><td class="txtL"><a href="#" class="ellipsis " onclick="javascript:getDetailView('313741');return false;"> 2026년 1차 행복주택 계약 결과 알림 </a></td><!-- 첨부파일 Start --><td> 공공주택공급부 </td><td class="num"> 2026-11-23 </td><td class="num">4097</td></tr>
<tr><td>1740</td><td class="txtL"><a href="#" onclick="javascript:getDetailView('313767');return false;"> 전산작업에 따른 서비스(PASS인증서) 이용 안내 </a></td><td>시스템운영부</td><td> 2026-11-23 </td><td>767</td></tr>
<tr><td>1738</td><td class="txtL"><a href="#" onclick="javascript:getDetailView('313481');return false;"> [청년형] 특화형 매입임대주택(서초구) 입주자 모집 공고(운영기관 : 마을과집 협동조합) </a></td><td>매입주택공급부</td><td> 2026-11-23 </td><td>11148</td></tr>
<tr><td>1737</td><td class="txtL"><a href="#" onclick="javascript:getDetailView('313400');return false;"> 행복주택 입주자 모집공고 정정공고 </a></td><td>공공주택공급부</td><td> 2026-11-20 </td><td>10</td></tr>
</tbody></table>"""
SH_DETAIL = """<script>
 initParam = {"fileSize":"5242880","downList":"","callBackFunction":"FSubmit()"};
 initParam.downList = [{"brdId":"GS0401","seq":"313481","fileSeq":"1","fileSize":"749864","oriFileNm":"[마을과집]SH특화형 매입임대주택(청년) 입주자 모집 공고문_20261123.pdf","fileTp":"A"},{"brdId":"GS0401","seq":"313481","fileSeq":"2","oriFileNm":"신청서.hwp","fileTp":"A"}];
 initInnorix();</script><p>문의 02-1234-5678</p>"""

GH_LIST = """<table><thead><tr><th>번호</th><th>유형</th><th>공고명</th><th>지역</th><th>첨부</th><th>게시일</th><th>마감일</th><th>상태</th><th>경쟁률</th><th>조회수</th></tr></thead><tbody>
<tr> <td>1</td> <td> 국민임대 </td> <td> <a href="#a" class="text_cut" data-previewyn="N" data-pbancno="850" data-pbanckndcd="01" data-biztynm="국민임대"> 다산메트로3단지 국민임대주택 예비입주자 모집공고 </a> </td> <td> 남양주시 </td><td> <img alt="pdf파일"> </td> <td> 2026-11-13 </td> <td> 2026-11-23 </td><td> 접수마감 </td><td> <button data-pbancno="850">확인</button> </td> <td>55596</td> </tr>
<tr> <td>2</td> <td> 국민임대 </td> <td> <a href="#a" data-previewyn="N" data-pbancno="843" data-pbanckndcd="01" data-biztynm="국민임대"> 안성공도 참아름 2단지 국민임대주택 예비입주자 모집공고 </a> </td> <td> 안성시 </td><td></td> <td> 2026-11-09 </td> <td> 2026-11-26 </td><td> 접수중 </td><td></td> <td>22493</td> </tr>
<tr> <td>3</td> <td> 행복주택 </td> <td> <a href="#a" data-previewyn="N" data-pbancno="840" data-pbanckndcd="01" data-biztynm="행복주택"> OO 행복주택 당첨자 발표 </a> </td> <td> 수원시 </td><td></td> <td> 2026-11-01 </td> <td> - </td><td> - </td><td></td> <td>1</td> </tr>
</tbody></table>"""
GH_DETAIL = """<div>공급일정 온라인접수기간 : 2026.11.24 10:00 ~ 2026.11.26 18:00 현장접수기간 : 2026.11.24</div>
<a href="https://apply-cdn.gh.or.kr/sr/sr7150/selectFileDown.do?pbancNo=843&amp;atchFileSn=1788978&amp;atchFileDtlSn=1&amp;mode=1"> 안성공도 참아름 국민임대주택 예비입주자 모집공고문.hwp (1112064 Byte) <img alt="hwp 파일"> </a>
<a href="https://apply-cdn.gh.or.kr/sr/sr7150/selectFileDown.do?pbancNo=843&amp;atchFileSn=1788978&amp;atchFileDtlSn=2&amp;mode=1"> 안성공도 참아름 국민임대주택 예비입주자 모집공고문.pdf (1252550 Byte) <img alt="pdf 파일"> </a>"""


def t_sh_parse():
    rows, err = collect_sh.parse_list(SH_LIST)
    assert not err and [r["seq"] for r in rows] == ["313741", "313767", "313481", "313400"], rows
    files = collect_sh.parse_downlist(SH_DETAIL)
    assert len(files) == 2 and files[0]["fileSeq"] == "1"
    assert collect_sh.parse_list("<p>없음</p>")[1]


def t_sh_real_excerpt():
    """2026-11-24 실제 SH 목록 HTML 발췌 (주석·스크립트가 표 안에 섞여 있음)"""
    html = open(os.path.join(os.path.dirname(__file__), "fixtures", "sh_list_real_excerpt.html"), encoding="utf-8").read()
    rows, err = collect_sh.parse_list(html)
    assert not err and [r["seq"] for r in rows] == ["313481", "313647", "313645"], rows
    assert rows[0]["date"] == "2026-11-23" and rows[0]["title"].startswith("[청년형]")
    keep = [r["seq"] for r in rows if common.is_target_title(r["title"])[0]]
    assert keep == ["313481", "313647"], keep   # 토지임대부는 주택, 당첨자 발표는 제외


def t_filters():
    assert common.skip_attachment("4.주택개방 담당자 연락처(260615).pdf")
    assert not common.skip_attachment("모집공고문.pdf")
    assert common.is_target_title("[토지임대부 사회주택] 옥류서원 입주자 모집 공고문")[0]


def t_gh_parse():
    rows, err = collect_gh.parse_list(GH_LIST)
    assert not err and [r["pbancNo"] for r in rows] == ["850", "843", "840"], rows
    assert rows[1]["status"] == "접수중" and rows[1]["end"] == "2026-11-26" and rows[1]["region"] == "안성시"
    files, s, e = collect_gh.parse_detail(GH_DETAIL)
    assert len(files) == 2 and files[1][0].endswith(".pdf") and "&amp;" not in files[1][1], files
    assert (s, e) == ("2026-11-24", "2026-11-26"), (s, e)
    assert collect_gh.parse_list("<table><tr><th>x</th></tr></table>")[1]


def t_gh_real_excerpt():
    """2026-11-24 실제 GH 목록 HTML 발췌 (</td> 가 빠진 칸이 있음)"""
    fx = os.path.join(os.path.dirname(__file__), "fixtures")
    rows, err = collect_gh.parse_list(open(os.path.join(fx, "gh_list_real_excerpt.html"), encoding="utf-8").read())
    assert not err and [r["pbancNo"] for r in rows] == ["843", "839", "811"], rows
    r = rows[0]
    assert (r["region"], r["posted"], r["end"], r["status"], r["biz"]) == ("안성시", "2026-11-09", "2026-11-26", "접수중", "국민임대"), r
    assert rows[1]["title"].startswith("'26년") and rows[2]["end"] == "" and rows[2]["status"] == ""
    rows, err = collect_gh.parse_list(open(os.path.join(fx, "gh_list_real_empty.html"), encoding="utf-8").read())
    assert rows == [] and not err   # 마지막 쪽 다음 = 정상 종료


def t_end_to_end():
    out = tempfile.mkdtemp()
    calls = []

    def fake(url, **kw):
        calls.append(url)
        if kw.get("binary"):
            return b"%PDF-1.4", "", ""
        if "m_247/list.do" in url:
            return SH_LIST if "page=1" in url else "<table><tr><th>번호</th><th>제목</th></tr></table>"
        if "m_247/view.do" in url:
            return SH_DETAIL
        if "selectPbancRentHouseList" in url:
            if "pageIndex=1" not in url:
                return "<table><tr><th>공고명</th></tr></table>"
            return GH_LIST if "sr7150" in url else GH_LIST.replace('"850"', '"852"').replace('"843"', '"853"').replace('"840"', '"854"')
        if "selectPbancDetailView" in url:
            return GH_DETAIL
        raise AssertionError(url)

    common.http_get = fake; collect_sh.http_get = fake; collect_gh.http_get = fake
    lh.call = lambda ep, p: [{"dsSch": []}, {"dsList": [
        {"PAN_ID": "111", "PAN_NM": "A 행복주택 모집", "UPP_AIS_TP_NM": "임대주택", "CLSG_DT": "2026.12.05", "PAN_SS": "공고중", "CNP_CD_NM": "서울"},
        {"PAN_ID": "222", "PAN_NM": "B 상가", "UPP_AIS_TP_NM": "상가"}]}]
    collect_myhome.fetch = lambda p, n: {"response": {"body": {"item": [
        {"pblancId": "1", "pblancNm": "x", "suplyInsttNm": "한국토지주택공사"},
        {"pblancId": "2", "pblancNm": "y", "suplyInsttNm": "경상북도개발공사", "endDe": "20261201"}]}}} if p == 1 else {}
    sys.argv = ["run_all", "--out", out]
    run_all.main()
    rows = {r["key"]: r for r in json.load(open(os.path.join(out, "list.json"), encoding="utf-8"))}
    assert set(rows) == {"LH-111", "MH-2", "SH-313481", "SH-313400", "GH-850", "GH-843", "GH-852", "GH-853"}, set(rows)
    assert rows["SH-313400"]["is_correction"] is True
    assert rows["GH-843"]["apply_start"] == "2026-11-24"
    assert os.path.exists(os.path.join(out, "attachments", "SH-313481",
                                       "[마을과집]SH특화형 매입임대주택(청년) 입주자 모집 공고문_20261123.pdf"))
    assert os.path.exists(os.path.join(out, "attachments", "GH-843", "안성공도 참아름 국민임대주택 예비입주자 모집공고문.pdf"))
    assert "innoFD.do?brdId=GS0401&seq=313481&fileTp=A&fileSeq=1" in " ".join(calls)
    log1 = json.load(open(os.path.join(out, "run_log.json"), encoding="utf-8"))
    assert log1["신규"] == 8 and log1["정정"] == 1 and log1["실패"] == 0, log1
    calls.clear()
    run_all.main()  # 2회차: 첫 쪽에서 아는 글을 만나 멈추고, 새 것 없음
    log2 = json.load(open(os.path.join(out, "run_log.json"), encoding="utf-8"))
    assert log2["신규"] == 0 and log2["전체"] == 8, log2
    assert not any("view.do" in u or "DetailView" in u for u in calls), "아는 글의 상세는 다시 읽지 않아야 함"


def t_apply_period_tiers():
    import extract_terms as E
    assert E.apply_period("신청기간 : 2026. 11. 24.(화) ~ 12. 7.(월)") == ("2026-11-24", "2026-12-07")
    assert E.apply_period("신청서는 접수마감일 26.11.27.18시까지") == ("", "2026-11-27")
    assert E.apply_period("아무 말 없음") == ("", "")
    txt = "신청자 본인이 만 19세 이상 만 39세 이하인 자 신청자 본인이 무주택자"
    fl, _ = E.parse_terms(txt, "청년 안심주택 모집공고")
    rows = E.tier_rows({"key": "X"}, fl, txt)
    assert rows[0]["tier"] == "청년" and rows[0]["age_min"] == "19" and rows[0]["age_max"] == "39"


def t_lh_fetch_files():
    import collect_lh
    from common import RunLog
    import tempfile
    rows = [{"key": "LH-1", "_spl_inf_tp_cd": "050", "_ccr_cnnt_sys_ds_cd": "03", "_upp_ais_tp_cd": "06", "attachments": ""},
            {"key": "LH-2", "_spl_inf_tp_cd": "", "_ccr_cnnt_sys_ds_cd": "", "_upp_ais_tp_cd": "", "attachments": ""},
            {"key": "LH-3", "_spl_inf_tp_cd": "050", "_ccr_cnnt_sys_ds_cd": "03", "_upp_ais_tp_cd": "06", "attachments": ""}]
    def fake_call(ep, params):
        if params["PAN_ID"] == "1":
            return [{"dsAhflInfo": [{"AHFL_URL": "http://x/a", "CMN_AHFL_NM": "공고문.pdf"}]}]
        return [{"dsAhflInfo": []}]
    log = RunLog()
    collect_lh.fetch_files(rows, tempfile.mkdtemp(), log, call=fake_call,
                           save=lambda o, k, n, u, r: f"attachments/{k}/{n}", pause=0)
    assert rows[0]["attachments"] == "attachments/LH-1/공고문.pdf"
    assert rows[1]["attachments"] == "" and rows[2]["attachments"] == ""
    assert len(log.failures) == 2 if hasattr(log, "failures") else True


def t_stage1_fields():
    import extract_terms as E
    txt = ("우선공급 일반공급 1순위 2순위 청약저축 24회 이상 납입 신혼부부 맞벌이 가구는 소득기준 90% 이하 "
           "총자산 34,500만원 이하\n자동차가액 4,542만원 이하\n인터넷 청약 및 현장접수")
    f, _ = E.parse_terms(txt, "행복주택 신혼부부 모집")
    assert f["supply_groups"] == "우선공급|일반공급" and f["ranks"] == "1순위|2순위"
    assert f["income_pct_dual"] == "90" and f["asset_kind"] == "총자산" and f["car_rule_type"] == "금액한도"
    assert f["sub_min_rounds"] == "24" and f["sub_timing"] == "신청시순위필수" and f["reception_channel"] == "병행"
    assert f["is_precontract"] == "아니오"


def t_stage2_residence_scopes():
    import extract_terms as E
    # 필수배제: 공고일 현재 ○○에 주민등록 등재
    lv, ar, ba, why = E.classify_residence("모집 공고일('26.11.19.) 현재 서울특별시에 주민등록등재된 무주택세대구성원으로", "신혼부부 주택", "", "")
    assert lv == "필수배제" and ar.startswith("필수:서울")
    # 순위: 1·2·3순위 거주지, 3순위는 그 외
    txt = "① 1순위 : 모집공고일 현재 주민등록표등본상 경기도 의정부시에 거주하는 자\n② 2순위 : 모집공고일 현재 주민등록표등본상 경기도 양주시 거주자\n③ 3순위 : 1, 2순위 외 지역 거주자"
    assert E.classify_residence(txt, "장기전세", "", "")[0] == "순위"
    # 없음: 지역 조건 문구 없음 / 타 지역 신청 가능
    assert E.classify_residence("타 지역(타 지자체) 거주자도 신청 가능합니다.", "다자녀", "", "")[0] == "없음"
    # 영구임대 유형·제목 규칙
    assert E.classify_residence("영구임대 예비입주자 지역 거주자", "안산시 영구임대 예비입주자 모집", "", "영구임대")[0] == "필수배제"
    # 주택형별 행 쪼개기
    blk = ("   - (1순위) 공고일 현재 안성시 거주자\n 39형/49형 - (2순위) 공고일 현재 평택시 거주자\n   - (3순위) 1, 2순위 외 지역 거주자\n"
           "   - (1순위) 주택청약종합저축에 가입하여 24회 이상 납입한 사람\n 59형 - (2순위) 6회 이상 납입한 사람\n   - (3순위) 1, 2순위에 해당되지 아니하는 자\n")
    uv = E.unit_variants(blk, "국민임대", "", "국민임대")
    assert [(u[0], u[1]) for u in uv] == [("39형|49형", "순위"), ("59형", "없음")]
    # 검증 범위
    hl, inc, hh, _ = E.scopes("무주택자(본인)인 미혼 청년으로서 소득 및 자산 요건은 세대구성원 모두 충족", "청년")
    assert (hl, inc) == ("본인", "세대원전체")
    assert E.scopes("③ 해당 세대의(주택공급신청자가 세대원이거나 단독세대주인 경우 본인 기준) 월평균소득이 기준 이하", "일반")[1] == "세대원전체"
    assert E.classify_residence("신청자와 동일 주소에 거주하지 않더라도 자격검증대상에 포함", "통합공공임대", "", "통합공공임대")[0] == "없음"
    assert E.scopes("세대주가 아닌 청년은 신청자 본인만 세대원수로 인정", "청년")[2].startswith("비세대주")
    assert [x[1] for x in E.rank_split_youth("1순위 수급자 가구 2순위 신청 시 본인 및 부모 포함 작성 3순위 신청 시 본인만 작성")] == ["면제", "본인+부모", "본인"]


def t_fill_from_standard():
    import extract_terms as E
    T = E.TODO
    mk = lambda k, v: {"key": k, "tier": "청년", "homeless_scope": v, "asset_total_man": v, "evidence": "", "extract_status": ""}
    terms = [mk("A", "100"), mk("B", "100"), mk("C", "100"), mk("D", T), mk("E", T), mk("F", "70")]
    rows = {"A": {"type": "행복주택", "title": "행복주택 모집"}, "B": {"type": "행복주택", "title": "행복주택 모집"},
            "C": {"type": "행복주택", "title": "행복주택 모집"}, "D": {"type": "행복주택", "title": "행복주택 모집"},
            "E": {"type": "행복주택", "title": "행복주택 입주자격완화 모집"},      # 완화 공고는 표준을 받지 않는다
            "F": {"type": "국민임대", "title": "국민임대 모집"}}
    n = E.fill_from_standard(terms, rows)
    d = {t["key"]: t for t in terms}
    assert d["D"]["homeless_scope"] == "100" and "표준 적용" in d["D"]["evidence"] and n == 1
    assert d["D"]["asset_total_man"] == T      # 자산 값은 다른 공고에서 빌리지 않는다(구형 값 방지)
    assert d["E"]["homeless_scope"] == T and d["F"]["homeless_scope"] == "70"


def t_standard_table():
    """① 공고문 값 우선 ② 표준 표 ③ 확인필요. 특화 공고는 표준을 받지 않고, 채운 열은 std_applied 에 남는다."""
    import extract_terms as E
    T = E.TODO
    std = E.load_standard_table(os.path.join(os.path.dirname(__file__), "..", "data", "standard_terms.csv"))
    assert len(std) >= 10
    mk = lambda k, tier, **kw: dict({c: T for c in E.TERM_COLS}, key=k, tier=tier, evidence="", extract_status="", std_applied="", **kw)
    terms = [mk("A", "청년"), mk("B", "청년", asset_total_man="99999"), mk("C", "청년"), mk("D", "일반"), mk("E", "청년"), mk("F", "일반")]
    rows = {"A": {"type": "행복주택", "title": "행복주택 모집"}, "B": {"type": "행복주택", "title": "행복주택 모집"},
            "C": {"type": "행복주택", "title": "행복주택 입주자격완화 모집"},
            "D": {"type": "장기전세", "title": "장기전세 모집"},                  # 표준 없는 유형
            "E": {"type": "행복주택", "title": "행복주택 모집", "recruit_mode": "선착순"},
            "F": {"type": "국민임대", "title": "국민임대 모집"}}
    n = E.apply_standard_table(terms, rows, std)
    d = {t["key"]: t for t in terms}
    assert d["A"]["asset_total_man"] == "25100" and "asset_total_man" in d["A"]["std_applied"].split(";") and "표준 적용" in d["A"]["evidence"]
    assert "업무매뉴얼" not in d["A"]["evidence"] and n > 0
    assert d["B"]["asset_total_man"] == "99999" and "asset_total_man" not in d["B"]["std_applied"]   # 공고문 값 우선
    assert d["C"]["asset_total_man"] == T and d["E"]["asset_total_man"] == T and d["C"]["std_applied"] == ""   # 특화 공고 제외
    assert d["D"]["asset_total_man"] == T                                                            # 표준에 없는 유형
    assert d["F"]["asset_total_man"] == "34500" and d["F"]["car_man"] == "4542"
    # 든든전세·50년공공임대·일반 매입임대 (매뉴얼에 없는 유형)
    t2 = [mk("G", "일반"), mk("H", "일반"), mk("I", "일반")]
    r2 = {"G": {"type": "매입임대", "title": "2026년 2차 든든전세주택 입주자 모집공고"}, "H": {"type": "공공임대", "title": "대전문화1단지 50년공공임대주택 예비입주자 모집"},
          "I": {"type": "매입임대", "title": "[서울] 일반 매입임대주택 예비입주자 모집공고"}}
    E.apply_standard_table(t2, r2, std)
    g, h, i = t2
    assert g["residence_level"] == "필수배제" and g["asset_total_man"] == "해당없음" and g["sub_timing"] == "해당없음"
    assert h["asset_total_man"] == "해당없음" and h["car_man"] == "해당없음" and h["sub_timing"] == "신청시순위필수" and h["residence_level"] == "필수배제"
    assert h["sub_min_rounds"] == T                                                                      # 횟수는 공고문 값
    # 일반 매입임대: 예비입주자 모집=지역 필수, 입주자 모집만(장기미임대)=지역 없음, 혼합은 표준 없음
    t3 = [mk("J", "일반"), mk("K", "일반"), mk("L", "일반")]
    r3 = {"J": {"type": "매입임대", "title": "일반 매입임대 입주자 모집공고"},
          "K": {"type": "매입임대", "title": "일반 매입임대 입주자 및 예비입주자 모집 공고"},
          "L": {"type": "매입임대", "title": "일반 매입임대 예비입주자 모집공고"}}
    E.apply_standard_table(t3, r3, std)
    assert t3[0]["residence_level"] == "배점만" and t3[0]["sub_timing"] == "해당없음" and t3[1]["residence_level"] == T and t3[0]["income_pcts"] == "70|100" and t3[0]["asset_total_man"] == "해당없음" and t3[2]["residence_level"] == "필수배제" and t3[2]["sub_timing"] == "해당없음" and t3[2]["asset_total_man"] == "24500" and t3[2]["car_man"] == "4542"
    f, _ = E.parse_terms("본문", "[대구] 일반 매입임대 입주자 모집공고")
    assert "장기미임대" in f["recruit_mode"], f["recruit_mode"]
    f, _ = E.parse_terms("본문", "[서울] 일반 매입임대주택 예비입주자 모집공고")
    assert "장기미임대" not in f["recruit_mode"]
    # 행복주택 신혼 맞벌이 120, 주거급여수급자 소득 해당없음, 분양·신혼희망타운은 표준 없음
    t4 = [mk("M", "신혼부부"), mk("N", "주거급여수급자"), mk("O", "일반")]
    r4 = {"M": {"type": "행복주택", "title": "행복주택 모집"}, "N": {"type": "행복주택", "title": "행복주택 모집"},
          "O": {"type": "공공분양(신혼희망)", "title": "신혼희망타운 모집"}}
    E.apply_standard_table(t4, r4, std)
    assert t4[0]["income_pct_dual"] == "120" and t4[1]["income_pcts"] == "해당없음" and t4[2]["asset_total_man"] == T
    # 청년매입 순위별 총자산(2순위 34500·3순위 25100·1순위 해당없음), 순위 구분 없으면 비움, 장기미임대 지역=배점만
    t5 = [mk("P", "청년", rank="1순위"), mk("Q", "청년", rank="2순위"), mk("R", "청년", rank="3순위"), mk("S", "청년"), mk("U", "일반")]
    r5 = {k: {"type": "매입임대", "title": "청년 매입임대주택 입주자 모집공고"} for k in "PQRS"}
    r5["U"] = {"type": "매입임대", "title": "일반 매입임대 입주자 모집공고"}
    E.apply_standard_table(t5, r5, std)
    assert [x["asset_total_man"] for x in t5[:4]] == ["해당없음", "34500", "25100", T], [x["asset_total_man"] for x in t5[:4]]
    assert t5[4]["residence_level"] == "배점만"
    # 맞벌이 %는 최종 %로 통일: +30%p + 일반 150 → 180, 기준 모르면 확인필요, 이미 최종값(120)은 그대로
    t6 = [mk("V", "일반", income_pct_dual="30", income_pcts="100|150"), mk("W", "일반", income_pct_dual="30", income_pcts=T), mk("X", "신혼부부", income_pct_dual="120", income_pcts="100")]
    E.normalize_dual(t6)
    assert [x["income_pct_dual"] for x in t6] == ["180", T, "120"], [x["income_pct_dual"] for x in t6]
    assert os.path.exists(os.path.join(os.path.dirname(__file__), "..", "data", "income_base.csv"))
    assert E.is_closed({"status": "접수마감"}) and not E.is_closed({"status": "공고중"})
    assert i["residence_level"] == "필수배제" and i["sub_timing"] == "해당없음" and i["asset_total_man"] == "24500" and i["income_pcts"] == "70|50|100"   # 예비입주자 모집


def t_asset_reference():
    """금액 없이 '영구임대주택 자산기준을 충족'이라고만 적힌 공고는 영구임대 자산기준(24,500·4,542)으로 읽는다."""
    import extract_terms as E
    f, ev = E.parse_terms("월평균소득 50% 이하인 자로 영구임대주택 자산기준을 충족한 자", "일반 매입임대주택 예비입주자 모집공고")
    assert f["asset_total_man"] == "24500" and f["car_man"] == "4542", f
    f2, _ = E.parse_terms("총자산 30,000만원 이하 영구임대주택 자산기준", "무제")     # 금액이 적혀 있으면 그 금액이 우선
    assert f2["asset_total_man"] == "30000", f2
    f3, _ = E.parse_terms("자산 조건 없음", "무제")
    assert f3["asset_total_man"] == E.TODO


def t_subscription_score():
    """'24회 이상 납입 3점'은 배점 항목이지 청약저축 필수가 아니다. '24회 이상 납입한 사람'(순위)은 필수."""
    import extract_terms as E
    f, _ = E.parse_terms("주택청약종합저축 납입회차 가. 24회 이상 납입 3점 나. 12회 이상 24회 미만 납입 2점 다. 6회 이상 12회 미만 납입 1점", "일반 매입임대주택 예비입주자 모집공고")
    assert f["sub_timing"] == "배점항목" and f["sub_min_rounds"].startswith("24"), f
    f2, _ = E.parse_terms("1순위: 주택청약종합저축에 가입하여 24회 이상 납입한 사람", "국민임대 모집")
    assert f2["sub_timing"] == "신청시순위필수" and f2["sub_min_rounds"] == "24", f2


def t_link_corrections():
    """원공고 상태가 '정정공고중'(is_correction=True)이어도 정정공고가 원공고에 연결된다."""
    rows = [
        {"key": "LH-1", "org": "LH", "title": "서울삼전 행복주택 예비입주자 모집공고", "is_correction": True, "correction_of": ""},
        {"key": "LH-2", "org": "LH", "title": "[정정공고]서울삼전 행복주택 예비입주자 모집공고", "is_correction": True, "correction_of": ""},
        {"key": "LH-3", "org": "LH", "title": "[정정공고]다른 지역 국민임대 모집공고", "is_correction": True, "correction_of": ""},
    ]
    run_all.link_corrections(rows)
    assert rows[1]["correction_of"] == "LH-1", rows[1]
    assert rows[0]["correction_of"] == "" and rows[2]["correction_of"] == ""   # 자기 자신·원공고 없음은 비움


def t_extract_terms():
    """실제 GH 공고문 글자 발췌에서 소득표·자산·자동차를 뽑고, 없는 값은 '확인필요'로 둔다."""
    import extract_terms
    text = open(os.path.join(os.path.dirname(__file__), "fixtures", "gh_notice_terms_excerpt.txt"), encoding="utf-8").read()
    f, ev = extract_terms.parse_terms(text, "안성공도 참아름 2단지 국민임대주택 예비입주자 모집공고")
    assert f["income_basis"] == "도시근로자 월평균소득" and f["income_pcts"] == "70", f
    assert f["asset_total_man"] == "34500" and f["car_man"] == "4542", f
    tab = json.loads(f["income_table"])
    assert tab["3"] == [5717900, 6534743, 7351586] and tab["1"] == [3432027], tab
    assert "+10%" in f["income_bonus"], f["income_bonus"]
    assert f["recruit_target"].startswith("일반"), f["recruit_target"]
    f2, _ = extract_terms.parse_terms("아무 조건도 없는 글", "무제")
    assert f2["asset_total_man"] == "확인필요" and f2["income_table"] == "확인필요"
    assert extract_terms._man("2.45", "억원") == 24500 and extract_terms._man("4,542", "만원") == 4542


for n, f in list(globals().items()):
    if n.startswith("t_"):
        f(); print("통과:", n)
