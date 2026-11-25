"""공고문 PDF에서 '자격 조건'을 뽑아 목록에 붙인다 (맞춤 공고 자격진단 웹앱의 재료).

원칙
- 자동으로 뽑은 값은 **초안**이다. 못 찾은 값은 빈칸이 아니라 '확인필요'로 둔다.
- 값마다 근거 문장을 evidence 에 남겨, 사람이 PDF 원문과 맞춰 볼 수 있게 한다.
- extract_status: '자동추출(원문대조 필요)' | '확인필요(PDF 없음/글자 못 읽음)'. 대조가 끝난 건만 '대조완료'로 바꿀 것.
- PDF 글자 읽기는 pdftotext(poppler)가 있을 때만 한다. 없으면 실패로 기록하고 넘어간다.
"""
import csv
import json
import os
import re
import shutil
import subprocess

TODO = "확인필요"
SKIP_NAME = ("팸플릿", "포스터", "옵션", "신청서", "서식", "양식", "주택내역", "관리현황", "산정자료",
             "마감재", "접수 방법", "접수방법", "요약본", "별지", "참고", "부모 범위")

TERM_COLS = ["key", "tier", "unit_filter", "supply_group", "rank", "residence_level", "residence_areas", "residence_basis", "income_eval_scope", "household_head_rule", "income_pct_dual", "asset_kind", "car_rule_type", "sub_timing", "sub_min_rounds", "income_basis", "income_pcts", "income_table", "income_bonus",
             "asset_total_man", "car_man", "homeless_scope", "age_min", "age_max",
             "marriage_years_max", "child_age_max", "work_years_max", "extract_status", "std_applied", "evidence"]

TARGET_WORDS = [("청년", "청년"), ("신혼부부", "신혼부부"), ("한부모", "한부모가족"), ("고령자", "고령자"),
                ("홀몸어르신", "고령자"), ("대학생", "대학생"), ("자립준비청년", "자립준비청년"),
                ("주거급여", "주거급여수급자"), ("기숙사", "기숙사입주"), ("창업", "창업지원")]

NEW_COLS = ["supply_groups", "ranks", "is_precontract", "reception_channel", "recruit_target", "recruit_mode", "income_basis", "income_pcts", "income_table",
            "income_bonus", "asset_total_man", "car_man", "homeless_rule", "subscription_rule",
            "residence_rule", "pdf_used", "extract_status", "evidence", "wp_post_url"]


def have_pdftotext():
    return shutil.which("pdftotext") is not None


def pdf_text(path):
    """pdftotext -layout 결과 문자열. 못 읽으면 예외."""
    r = subprocess.run(["pdftotext", "-layout", path, "-"], capture_output=True, timeout=120)
    return r.stdout.decode("utf-8", errors="replace")


def have_ocr():
    """한글 OCR 가능 여부: tesseract + pdftoppm + 한글(kor) 언어 데이터."""
    if not (shutil.which("tesseract") and shutil.which("pdftoppm")):
        return False
    r = subprocess.run(["tesseract", "--list-langs"], capture_output=True, timeout=30)
    return b"kor" in r.stdout.split()


def ocr_text(path, max_pages=40, dpi=200):
    """글자가 없는 PDF(이미지)를 쪽별로 그림으로 바꿔 tesseract(kor+eng)로 읽는다."""
    import tempfile
    with tempfile.TemporaryDirectory() as td:
        subprocess.run(["pdftoppm", "-r", str(dpi), "-l", str(max_pages), "-png", path, os.path.join(td, "p")],
                       capture_output=True, timeout=600)
        parts = []
        for fn in sorted(os.listdir(td)):
            if fn.endswith(".png"):
                r = subprocess.run(["tesseract", os.path.join(td, fn), "-", "-l", "kor+eng", "--psm", "6"],
                                   capture_output=True, timeout=300)
                parts.append(r.stdout.decode("utf-8", errors="replace"))
        return "\n".join(parts)


def pick_notice_pdf(paths):
    """첨부 중 모집 공고문 한 개를 고른다(팸플릿·포스터·서식 제외, 파일 크기 큰 것 우선)."""
    cands = []
    for p in paths:
        name = os.path.basename(p)
        if not name.lower().endswith(".pdf"):
            continue
        if any(w in name for w in SKIP_NAME):
            continue
        score = (1 if ("공고" in name or "모집" in name) else 0, os.path.getsize(p) if os.path.exists(p) else 0)
        cands.append((score, p))
    return max(cands)[1] if cands else ""


def _num(s):
    return int(s.replace(",", ""))


def _man(value, unit):
    """'34,500만원' / '2.45억원' → 만원 단위 정수."""
    v = float(value.replace(",", ""))
    return int(round(v * 10000)) if unit.startswith("억") else int(round(v))


def parse_terms(text, title=""):
    """공고문 글자에서 자격 조건 초안을 뽑는다. 반환: (필드 dict, 근거 list)."""
    flat = re.sub(r"[ \t]+", " ", text)
    ev = []
    out = {c: TODO for c in NEW_COLS if c not in ("pdf_used", "extract_status", "evidence", "wp_post_url")}

    # 소득 기준 이름·비율 -------------------------------------------------
    pcts = []
    for m in re.finditer(r"도시근로자\s*(?:가구원수별\s*)?(?:가구당\s*)?월평균\s*(?:가구)?\s*소득(?:의|\s*의)?\s*\[?\s*(\d{2,3})\s*%\]?\s*(?:이하|초과|~)", flat):
        pcts.append(m.group(1))
        if len(ev) < 6:
            ev.append("소득%: " + m.group(0)[:60])
    for m in re.finditer(r"월평균\s*소득\s*\(?\s*(\d{2,3})\s*%", flat):   # '월평균소득 70% 이하', '월평균소득기준 (50%)' 꼴도
        pcts.append(m.group(1))
    if pcts:
        out["income_basis"] = "도시근로자 월평균소득"
        out["income_pcts"] = "|".join(dict.fromkeys(pcts))
    elif re.search(r"기준\s*중위소득", flat):
        out["income_basis"] = "기준 중위소득"
        m = re.search(r"기준\s*중위소득의?\s*(\d{2,3})\s*%", flat)
        if m:
            out["income_pcts"] = m.group(1)
            ev.append("소득%: " + m.group(0)[:60])

    # 가구원수별 소득 금액표 ('3인 가구  5,717,900  6,534,743 ...') ------------------
    table = {}
    for line in text.splitlines():
        m = re.match(r"\s*(\d)\s*인\s*(?:가구|이하)?\s+((?:[\d,]{6,}\s*(?:원)?\s*[-]?\s*)+)", line)
        if m:
            nums = [_num(x) for x in re.findall(r"\d{1,3}(?:,\d{3})+", m.group(2))]
            if nums and m.group(1) not in table:
                table[m.group(1)] = nums
    if table:
        out["income_table"] = json.dumps(table, ensure_ascii=False)
        ev.append(f"소득표 {len(table)}행: " + ", ".join(f"{k}인={v[0]:,}" for k, v in sorted(table.items())[:3]))

    # 가산 규칙 문구 --------------------------------------------------------
    bonus = []
    for pat in (r"1\s*인\s*가구[^\n]{0,12}\+\s*20\s*%[^\n]{0,30}2\s*인\s*가구[^\n]{0,12}\+\s*10\s*%",
                r"2023\s*년\s*3\s*월\s*28\s*일\s*이후[^\n]{0,80}(?:가산|\+\s*\d+\s*%)",
                r"출산\s*자녀[^\n]{0,40}\d+\s*%\s*가산",
                r"자녀[^\n]{0,30}\+\s*10\s*%[^\n]{0,40}\+\s*20\s*%"):
        m = re.search(pat, text)
        if m:
            bonus.append(re.sub(r"\s+", " ", m.group(0))[:80])
    if bonus:
        out["income_bonus"] = " / ".join(bonus)

    # 자산·자동차 -----------------------------------------------------------
    m = re.search(r"총\s*자산(?:가액|\s*기준)?\s*(?::|은)?\s*([\d,\.]+)\s*(억\s*원|만\s*원)\s*이하", flat)
    if m:
        out["asset_total_man"] = str(_man(m.group(1), m.group(2).replace(" ", "")))
        ev.append("총자산: " + m.group(0)[:50])
    m = re.search(r"자동차\s*(?:가액)?\s*(?:기준)?\s*(?::|은)?\s*([\d,\.]+)\s*(억\s*원|만\s*원)\s*이하", flat)
    if m:
        out["car_man"] = str(_man(m.group(1), m.group(2).replace(" ", "")))
        ev.append("자동차: " + m.group(0)[:50])
    # 금액 없이 '영구임대주택 자산기준을 충족'처럼 유형 이름만 적힌 공고는 그 유형의 자산기준을 뜻한다(타래 2026-11-25).
    # 공고문 안의 표현을 근거로 한 값이므로 공고문 값으로 취급한다(표준 표 값이 아님).
    ASSET_REF = (("영구임대", "24500", "4542"), ("국민임대", "34500", "4542"))
    if out["asset_total_man"] == TODO or out["car_man"] == TODO:
        for name, a_man, c_man in ASSET_REF:
            m = re.search(name + r"\s*(?:주택)?\s*(?:의\s*)?자산\s*(?:기준|요건)", flat)
            if m:
                if out["asset_total_man"] == TODO:
                    out["asset_total_man"] = a_man
                if out["car_man"] == TODO:
                    out["car_man"] = c_man
                ev.append("자산기준 참조: " + re.sub(r"\s+", " ", m.group(0))[:30] + f" → 총자산 {a_man}·자동차 {c_man}")
                break

    # 무주택 ------------------------------------------------------------------
    if "무주택세대구성원" in flat:
        out["homeless_rule"] = "세대구성원 전원 무주택"
    elif re.search(r"무주택\s*(?:자|세대)", flat):
        out["homeless_rule"] = "무주택 요건 있음(대상 확인필요)"

    # 청약저축 ----------------------------------------------------------------
    if re.search(r"가입\s*사실[^\n]{0,20}증명", flat):
        out["subscription_rule"] = "입주 전까지 가입사실 증명"
    elif re.search(r"청약통장[^\n]{0,30}납입\s*회차|주택청약종합저축에\s*가입하여\s*\d+\s*회", flat):
        out["subscription_rule"] = "순위 요건(납입 회차)"
    elif re.search(r"청약\s*(?:저축|통장)", flat):
        out["subscription_rule"] = "언급 있음(조건 확인필요)"
    else:
        out["subscription_rule"] = "언급 없음"

    # 거주 요건 ---------------------------------------------------------------
    m = re.search(r"\((?:1순위)\)[^\n]{0,60}거주자", flat) or re.search(r"1순위[^\n]{0,60}거주(?:지|자)[^\n]{0,30}", flat)
    if m:
        out["residence_rule"] = re.sub(r"\s+", " ", m.group(0))[:80]

    # 모집 계층: 제목에 계층 말이 있으면 그것만 쓴다(본문 앞부분에는 '현장접수 대상 고령자'처럼 다른 뜻이 섞인다).
    found = [label for kw, label in TARGET_WORDS if kw in title and True]
    found = list(dict.fromkeys(found))
    if not found:
        if re.search(r"국민임대|영구임대|통합공공임대|장기전세", title):
            found = ["일반(계층 구분은 공고문 확인)"]
        elif re.search(r"행복주택|매입임대", title):
            # 행복주택·매입임대는 한 공고에 계층이 여러 개 — 본문에서 후보만 적고 확인필요를 붙인다
            body = [label for kw, label in TARGET_WORDS[:4] if kw in flat[:6000] and label != "고령자"]
            found = list(dict.fromkeys(body)) + ["(계층 목록 확인필요)"]
    if found:
        out["recruit_target"] = "|".join(found)

    # 모집 방식 ---------------------------------------------------------------
    t = title + " " + flat[:1500]
    modes = []
    for kw, label in (("예비입주자", "예비입주자"), ("추가모집", "추가모집"), ("입주자격완화", "자격완화"),
                      ("선착순", "선착순"), ("선계약", "선계약후검증"), ("입주자 모집", "입주자모집")):
        if kw in t and label not in modes:
            modes.append(label)
    # 일반 매입임대는 '예비입주자 모집'과 '입주자 모집'의 조건이 다르다. 예비 없이 입주자 모집만 있으면 장기미임대(타래 2026-11-25).
    if re.search(r"일반\s*매입", title) and (("예비" not in title) or re.search(r"입주자\s*및\s*예비", title)):
        modes.append("장기미임대")
    if modes:
        out["recruit_mode"] = "|".join(modes)

    # 1단계 추가 항목 (공고 전체 기준) ------------------------------------------
    sg = []
    for kw, label in (("우선공급", "우선공급"), ("일반공급", "일반공급"), ("특별공급", "특별공급")):
        if kw in flat:
            sg.append(label)
    if re.search(r"50\s*㎡\s*미만", flat):
        sg.append("50㎡미만")
    if re.search(r"50\s*㎡\s*이상", flat):
        sg.append("50㎡이상")
    out["supply_groups"] = "|".join(sg) if sg else TODO
    rk = sorted({int(x) for x in re.findall(r"(?<![\d.])([1-5])\s*순위", flat)})
    out["ranks"] = "|".join(f"{n}순위" for n in rk) if rk else TODO
    out["is_precontract"] = "예" if re.search(r"선\s*계약\s*후\s*(?:자격)?\s*검증|선계약", flat) else "아니오"
    ch = []
    if re.search(r"인터넷\s*(?:청약|신청|접수)|청약센터|청약Home|온라인", flat):
        ch.append("인터넷")
    if re.search(r"현장\s*(?:접수|방문|청약)", flat):
        ch.append("현장")
    out["reception_channel"] = "병행" if len(ch) == 2 else (ch[0] + "전용" if ch else TODO)
    m = re.search(r"맞벌이[^\n]{0,50}?(\d{2,3})\s*%", flat)
    out["income_pct_dual"] = m.group(1) if m else TODO
    if m:
        ev.append("맞벌이: " + re.sub(r"\s+", " ", m.group(0))[:50])
    out["asset_kind"] = ("총자산" if re.search(r"총\s*자산(?:가액)?[^\n]{0,30}이하", flat)
                         else "부동산" if re.search(r"부동산(?:가액)?[^\n]{0,20}이하", flat)
                         else "미적용" if re.search(r"자산[^\n]{0,12}(?:기준\s*)?미적용", flat) else TODO)
    out["car_rule_type"] = ("금액한도" if re.search(r"자동차(?:가액)?[^\n]{0,24}[\d,]+\s*만\s*원\s*이하", flat)
                            else "미소유필수" if re.search(r"자동차[^\n]{0,10}(?:미소유|소유하지\s*않)", flat)
                            else "기준없음" if re.search(r"자동차[^\n]{0,16}(?:기준\s*)?(?:미적용|적용하지\s*않)", flat) else TODO)
    m = re.search(r"(\d{1,2})\s*회\s*이상\s*납입", flat)
    # '24회 이상 납입 3점'처럼 점수로 주는 항목은 청약저축이 필수가 아니라 배점이다(필터에서 조건으로 쓰면 안 된다).
    score_rounds = re.findall(r"(\d{1,2})\s*회\s*이상(?:\s*\d{1,2}\s*회\s*(?:미만|이하))?\s*납입\s*(?:\(\s*\d+\s*점\s*\)|\d+\s*점)", flat)
    if score_rounds:
        out["sub_min_rounds"] = "|".join(dict.fromkeys(score_rounds))
        out["sub_timing"] = "배점항목"
    else:
        out["sub_min_rounds"] = m.group(1) if m else TODO
    out["sub_timing"] = (out["sub_timing"] if score_rounds else "신청시순위필수" if m else
                         "불필요" if re.search(r"청약\s*(?:저축|통장)[^\n]{0,24}(?:불필요|필요\s*없|무관)", flat) else TODO)
    return out, ev


def apply_period(text):
    """'신청기간 : 2026. 11. 24.(화) ~ 12. 7.(월)' 꼴에서 (시작일, 마감일) ISO 문자열. 못 찾으면 ("", "")."""
    flat = re.sub(r"[ \t]+", " ", text)
    pat = (r"(?:청약\s*)?(?:신청|접수)(?:\s*접수)?\s*(?:기간|일정|일시)\s*[:：]?\s*(?:\S{0,12}?\s)?"
           r"(\d{4})\s*[.\-년]\s*(\d{1,2})\s*[.\-월]\s*(\d{1,2})\s*[.일]?\s*(?:\([^)]{1,3}\))?[^~∼\n]{0,24}?[~∼]\s*"
           r"(?:(\d{4})\s*[.\-년]\s*)?(\d{1,2})\s*[.\-월]\s*(\d{1,2})")
    m = re.search(pat, flat)
    if not m:
        # 마감일만 적힌 공고: '접수마감일 26.11.27.' → 시작일은 모르므로 비워 둔다
        m2 = re.search(r"접수\s*마감일?\s*[:：]?\s*(?:20)?(\d{2})\s*[.\-]\s*(\d{1,2})\s*[.\-]\s*(\d{1,2})", flat)
        if m2:
            import datetime
            try:
                return "", datetime.date(2000 + int(m2.group(1)), int(m2.group(2)), int(m2.group(3))).isoformat()
            except ValueError:
                pass
        return "", ""
    y1, m1, d1, y2, m2, d2 = m.groups()
    y1, m1, d1, m2, d2 = int(y1), int(m1), int(d1), int(m2), int(d2)
    y2 = int(y2) if y2 else (y1 + 1 if m2 < m1 else y1)
    try:
        import datetime
        a = datetime.date(y1, m1, d1)
        b = datetime.date(y2, m2, d2)
    except ValueError:
        return "", ""
    if b < a or (b - a).days > 60:       # 이상한 값은 버린다
        return "", ""
    return a.isoformat(), b.isoformat()


def _first_int(pat, text):
    m = re.search(pat, text)
    return m, (int(m.group(1)) if m else None)


# ---- 2단계: 거주요건 성격 · 검증 범위 (분류규칙_2단계_261125.md) -----------------------------
CATCH_ALL = re.compile(r"(?:제?\s*1\s*[,·및]\s*2\s*순위|1\s*순위\s*및\s*2\s*순위|1,\s*2순위)\s*(?:외|에\s*해당(?:되지|하지)\s*(?:아니|않)는)")
REGION_NAME = re.compile(r"[가-힣]{2,6}(?:특별시|광역시|특별자치시|특별자치도|도|시|군|구)")


def _clip(s, n=60):
    return re.sub(r"\s+", " ", s).strip()[:n]


def classify_residence(text, title="", region="", typ=""):
    """거주요건 성격 → (level, areas, basis, evidence). level: 필수배제/순위/배점만/없음/확인필요."""
    flat = re.sub(r"[ \t]+", " ", text)
    must = None
    for pat, why in ((r"사업대상지역[^\n]{0,24}주민등록[^\n]{0,12}등재", "사업대상지역 등재"),
                     (r"모집권역[^\n]{0,70}(?:외|이외)[^\n]{0,40}(?:무효|불가)", "모집권역 외 무효"),
                     (r"(?:모집)?공고일\s*(?:\([^)\n]{0,20}\))?\s*현재\s*([가-힣·\s]{2,24}?)에\s*(?:주민등록\s*(?:이\s*)?등재|주민등록상|거주하는|주민등록)", "공고일 현재 ○○ 등재·거주")):
        m = re.search(pat, flat)
        if m:
            must = (why, m)
            break
    rank_res = re.search(r"\(?[1-3]\s*순위\)?[^\n]{0,24}(?:모집)?공고일\s*현재[^\n]{0,50}거주", flat) or \
        re.search(r"거주지이거나\s*(?:재학|소득)", flat) or \
        re.search(r"[1-3]\s*순위\s*[:：]\s*(?:입주자\s*)?(?:모집)?공고일\s*현재[^\n]{0,40}(?:거주|주소지)", flat)
    catch = CATCH_ALL.search(flat)
    unrecruited = re.search(r"[2-3]\s*순위[^\n]{0,20}(?:모집하지\s*않|미모집)", flat)
    basis = "없음"
    seg = ""
    if rank_res:
        seg = flat[max(0, rank_res.start() - 80): rank_res.end() + 160]
    if "재학" in seg and "소득" in seg:
        basis = "거주지+재학대학+소득근거지"
    elif "재학" in seg:
        basis = "거주지+재학대학"
    elif "소득 근거지" in seg or "소득근거지" in seg:
        basis = "거주지+소득근거지"
    elif rank_res or must:
        basis = "거주지"
    # 영구임대: 제목·유형 규칙(원문 문구가 머리글뿐인 경우)
    type_rule = bool(re.search(r"영구임대", title + " " + typ))
    if unrecruited and (rank_res or must):
        level, why = "필수배제", "2·3순위 미모집: " + _clip(unrecruited.group(0))
    elif must and must[0] == "공고일 현재 ○○ 등재·거주" and rank_res and (catch or re.search(r"3\s*순위", flat)):
        level, why = "순위", _clip(rank_res.group(0))     # 거주 순위표가 있고 3순위(그 외)가 있으면 누구나 신청 가능
    elif must:
        level, why = "필수배제", must[0] + ": " + _clip(must[1].group(0))
    elif rank_res:
        level, why = "순위", _clip(rank_res.group(0))
    elif type_rule:
        level, why, basis = "필수배제", "유형·제목 규칙(영구임대는 지역 거주 필수)", "거주지"
    elif re.search(r"타\s*지역[^\n]{0,20}신청\s*가능", flat):
        level, why = "없음", "타 지역 거주자도 신청 가능"
    elif re.search(r"거주(?:지역)?\s*(?:기간)?[^\n]{0,30}\d+\s*점", flat):
        level, why = "배점만", "거주 점수 문구"
    elif re.search(r"(?:주민등록|거주(?!기간|하지))[^\n]{0,15}(?:자격|요건|조건|순위)", flat):
        level, why = TODO, "거주 문구는 있으나 규칙에 안 맞음(한 값으로 못 나눔)"
    else:
        level, why = "없음", "지역 조건 문구 없음"
    areas = TODO
    if level == "필수배제":
        if must and must[0] == "공고일 현재 ○○ 등재·거주":
            areas = "필수:" + _clip(must[1].group(1), 30)
        elif must and must[0] == "사업대상지역 등재":
            areas = "필수:사업대상지역"
        elif must:
            areas = "필수:모집권역"
        else:
            m = REGION_NAME.search(title) if title else None
            areas = "필수:" + (m.group(0) if m else (region or TODO))
    elif level == "순위":
        lines = re.findall(r"\(?[1-3]\s*순위\)?\s*[:：]?[^\n]{0,70}(?:거주|주소지)[^\n]{0,30}", flat)
        areas = "; ".join(_clip(x, 60) for x in lines[:3]) if lines else TODO
        if not lines:
            m = REGION_NAME.search(title)
            areas = ("제목:" + m.group(0)) if m else (region or TODO)
    elif level in ("없음", "배점만"):
        areas = "없음"
    if level == "없음":
        basis = "없음"
    return level, areas, basis, why


def unit_blocks(text):
    """'39형/49형 …(1순위)…(3순위) / 59형 …(1순위)…' 처럼 주택형마다 순위 기준이 다른 표를 나눈다."""
    lines = text.split("\n")
    starts = [i for i, l in enumerate(lines) if re.search(r"\(1순위\)", l)]
    blocks = []
    for n, i in enumerate(starts):
        end = starts[n + 1] if n + 1 < len(starts) else min(len(lines), i + 4)
        end = min(end, i + 4)
        chunk = lines[i:end]
        labels = []
        for l in chunk:
            labels += re.findall(r"\d{2}\s*형", l)
        labels = list(dict.fromkeys(x.replace(" ", "") for x in labels))
        if labels:
            blocks.append(("|".join(labels), "\n".join(chunk)))
    return blocks


def unit_variants(text, title, region, typ):
    """주택형마다 거주 기준이 다르면 [(unit_filter, level, areas, basis, why)], 아니면 []."""
    bl = unit_blocks(text)
    if len(bl) < 2:
        return []
    out = []
    for label, chunk in bl:
        if re.search(r"거주", chunk):
            lv, ar, ba, why = classify_residence(chunk, title, region, typ)
            if lv in ("없음", TODO):
                lv, ar, ba, why = "순위", "; ".join(_clip(x, 50) for x in re.findall(r"\(?[1-3]\s*순위\)?[^\n]{0,60}", chunk)[:3]), "거주지", _clip(chunk)
            out.append((label, lv, ar, ba, why))
        elif re.search(r"청약\s*(?:저축|통장)|납입", chunk):
            out.append((label, "없음", "없음", "없음", "순위 기준이 청약저축 납입 횟수(거주 아님)"))
    levels = {x[1] for x in out}
    return out if len(out) >= 2 and len(levels) >= 2 else []


def scopes(text, tier):
    """(homeless_scope, income_eval_scope, household_head_rule, evidence)"""
    flat = re.sub(r"[ \t]+", " ", text)
    ev = []
    hl = inc = TODO
    hh = "세대주무관"
    solo = re.search(r"혼인\s*중이\s*아닌\s*경우로서\s*단독세대주로\s*입주하려는\s*고령자", flat)
    nonhead = re.search(r"세대주가\s*아닌\s*청년[^\n]{0,40}본인", flat)
    if nonhead or re.search(r"세대원이\s*있는\s*세대의\s*세대주인\s*경우[^\n]{0,30}세대구성원\s*전체", flat):
        hh = "비세대주=본인만,세대주=세대전체"
    elif solo:
        hh = "단독세대주(고령자)"
    m_self = re.search(r"무주택자\s*\(본인\)|본인이\s*무주택|무주택자이며\s*미혼|주택소유여부는\s*신청자\s*본인에\s*한하여", flat)
    if tier == "청년" and m_self:
        hl = "본인"
        ev.append("무주택: " + _clip(m_self.group(0)))
    elif tier == "고령자" and solo:
        hl = "본인"
        ev.append("무주택: 단독세대주 고령자")
    elif tier in ("신혼부부", "예비신혼부부") and re.search(r"혼인으로\s*구성될\s*세대구성원", flat):
        hl = "예비신혼구성원"
        ev.append("무주택: 혼인으로 구성될 세대구성원")
    elif re.search(r"무주택\s*세대구성원|세대구성원\s*전원", flat):
        hl = "세대구성원전원"
    m_sh = re.search(r"소득\s*및\s*자산은\s*신청자\s*본인에\s*한하여", flat)
    if tier == "청년" and (m_sh or nonhead):
        inc = "본인"
        ev.append("소득: 신청자 본인에 한하여")
    elif re.search(r"소득[^\n]{0,40}세대구성원\s*(?:전원|모두)|세대구성원\s*(?:전원|모두)[^\n]{0,24}(?:월평균)?\s*소득", flat):
        inc = "세대원전체"
    elif re.search(r"해당\s*세대(?:의|를)[^\n]{0,70}월평균\s*소득|해당\s*세대의[^\n]{0,40}소득", flat):
        inc = "세대원전체"
        ev.append("소득: 해당 세대의 월평균소득(세대 단위)")
    return hl, inc, hh, ev


def rank_split_youth(text):
    """청년 매입(GH-787 꼴): 1순위 면제 / 2순위 본인+부모 / 3순위 본인 → [(rank, income_eval_scope)] 또는 []"""
    flat = re.sub(r"[ \t]+", " ", text)
    if re.search(r"2순위\s*신청\s*시\s*본인\s*및\s*부모[^\n]{0,60}", flat) and re.search(r"3순위\s*신청\s*시\s*본인만", flat):
        first = "면제" if re.search(r"1순위[^\n]{0,120}수급자", flat) else TODO
        return [("1순위", first), ("2순위", "본인+부모"), ("3순위", "본인")]
    return []


def tier_rows(row, fields, text):
    """공고 1건을 계층별 행으로 나눈다. 계층이 둘 이상이면 공고 전체 값(소득%·자산·자동차)은
    어느 계층 것인지 알 수 없으므로 넣지 않고 '확인필요'로 둔다. 계층마다 확실히 읽힌 값만 숫자로 적는다."""
    flat = re.sub(r"[ \t]+", " ", text)
    raw = fields.get("recruit_target", TODO)
    tiers = [t for t in raw.split("|") if t and t != TODO and not t.startswith("(") and not t.startswith("일반")]
    if not tiers:
        tiers = ["일반"]
    single = len(tiers) == 1
    out = []
    for t in tiers:
        r = {c: TODO for c in TERM_COLS}
        r.update({"key": row["key"], "tier": t, "extract_status": "자동추출(원문대조 필요)"})
        ev = []
        if single:
            for c in ("income_basis", "income_pcts", "income_table", "income_bonus", "asset_total_man", "car_man",
                      "income_pct_dual", "asset_kind", "car_rule_type", "sub_timing", "sub_min_rounds"):
                r[c] = fields.get(c, TODO)
            r["supply_group"] = fields.get("supply_groups", TODO)
            r["rank"] = fields.get("ranks", TODO)
        else:
            r["income_basis"] = fields.get("income_basis", TODO)       # 기준 이름은 공고 전체에 같다
        # 무주택·소득 검증 범위, 세대주 분기 (2단계)
        hl, inc, hh, sev = scopes(text, t)
        r["homeless_scope"], r["income_eval_scope"], r["household_head_rule"] = hl, inc, hh
        ev += sev
        lv, ar, ba, why = classify_residence(text, row.get("title", ""), row.get("region", ""), row.get("type", ""))
        r["residence_level"], r["residence_areas"], r["residence_basis"] = lv, ar, ba
        ev.append("거주요건: " + why)
        r["unit_filter"] = "전체"
        # 나이·혼인·자녀·종사기간 (계층별로 의미가 있는 것만)
        if t in ("청년", "자립준비청년"):
            m = re.search(r"(?:만\s*)?(\d{2})\s*세\s*이상[^\n]{0,14}?(?:만\s*)?(\d{2})\s*세\s*이하", flat)
            if m:
                r["age_min"], r["age_max"] = m.group(1), m.group(2)
                ev.append("나이: " + m.group(0)[:40])
            m, v = _first_int(r"소득이\s*있는\s*업무에\s*종사한?\s*기간[^\n]{0,40}?(\d{1,2})\s*년\s*이내", flat)
            if m:
                r["work_years_max"] = str(v)
                ev.append("종사기간: " + m.group(0)[:50])
        if t in ("신혼부부",):
            m, v = _first_int(r"혼인\s*(?:기간)?[^\n]{0,12}?(\d{1,2})\s*년\s*이내", flat)
            if m:
                r["marriage_years_max"] = str(v)
                ev.append("혼인: " + m.group(0)[:40])
        if t in ("신혼부부", "한부모가족"):
            m, v = _first_int(r"(\d{1,2})\s*세\s*이하\s*(?:의\s*)?(?:자녀|아이|영유아)", flat)
            if m:
                r["child_age_max"] = str(v)
                ev.append("자녀: " + m.group(0)[:40])
        r["evidence"] = " ; ".join(ev)
        variants = [r]
        uv = unit_variants(text, row.get("title", ""), row.get("region", ""), row.get("type", ""))
        if uv:                                   # 주택형마다 거주 기준이 다름 → 행을 쪼갠다
            variants = []
            for label, lv2, ar2, ba2, why2 in uv:
                v = dict(r)
                v.update({"unit_filter": label, "residence_level": lv2, "residence_areas": ar2,
                          "residence_basis": ba2, "evidence": r["evidence"] + " ; 주택형 " + label + ": " + why2})
                variants.append(v)
        rs = rank_split_youth(text) if t == "청년" else []
        if rs:                                   # 순위마다 소득 검증 범위가 다름 → 행을 쪼갠다
            nv = []
            for v in variants:
                for rk, sc in rs:
                    w = dict(v)
                    w.update({"rank": rk, "income_eval_scope": sc, "evidence": v["evidence"] + " ; 순위별 소득 범위: " + rk})
                    nv.append(w)
            variants = nv
        out.extend(variants)
    return out


def extract_row(row, out_dir, ocr=False):
    """목록 한 행의 첨부 PDF에서 조건을 뽑아 row 에 채운다. 반환: (상태 문자열, 계층 행 목록)."""
    paths = []
    for part in (row.get("attachments") or "").split(" | "):
        part = part.strip()
        if part.startswith("attachments/"):
            paths.append(os.path.join(out_dir, part))
    pdf = pick_notice_pdf(paths)
    row["pdf_used"] = os.path.relpath(pdf, out_dir).replace("\\", "/") if pdf else ""
    if not pdf:
        for c in NEW_COLS:
            if c not in ("wp_post_url",) and not row.get(c):
                row[c] = TODO
        row["extract_status"] = "확인필요(PDF 없음)"
        return row["extract_status"], []
    text = pdf_text(pdf)
    used_ocr = False
    if len(text.strip()) < 200:
        if ocr and have_ocr():
            text = ocr_text(pdf, max_pages=int(os.environ.get("OCR_MAX_PAGES", "15")))
            used_ocr = True
        if len(text.strip()) < 200:
            row["extract_status"] = "확인필요(PDF 글자를 못 읽음: 이미지 PDF" + ("·OCR 실패" if used_ocr else "·OCR 안 함") + ")"
            for c in NEW_COLS:
                if c not in ("wp_post_url", "pdf_used", "extract_status") and not row.get(c):
                    row[c] = TODO
            return row["extract_status"], []
    fields, ev = parse_terms(text, row.get("title", ""))
    row.update(fields)
    # 접수기간: 목록에 비어 있을 때만 PDF 값으로 채운다 (있는 값은 바꾸지 않는다)
    a, b = apply_period(text)
    if a and not row.get("apply_start"):
        row["apply_start"] = a
        ev.append("접수시작: PDF")
    if b and not row.get("apply_end"):
        row["apply_end"] = b
        ev.append("접수마감: PDF")
    row["evidence"] = " ; ".join(ev)
    row["extract_status"] = "자동추출(OCR, 원문대조 필요)" if used_ocr else "자동추출(원문대조 필요)"
    terms = tier_rows(row, fields, text)
    if used_ocr:
        for t in terms:
            t["extract_status"] = row["extract_status"]
    return row["extract_status"], terms


def load_wp_posts(path):
    """data/wp_posts.csv (key,wp_post_url) → dict. 게시한 글만 적는다."""
    d = {}
    if path and os.path.exists(path):
        with open(path, encoding="utf-8-sig", newline="") as f:
            for r in csv.DictReader(f):
                if r.get("key") and r.get("wp_post_url"):
                    d[r["key"].strip()] = r["wp_post_url"].strip()
    return d


CLOSED_STATUS = ("접수마감",)     # 마감된 공고는 구형 기준 값이 섞이므로 조건 추출에서 뺀다


def is_closed(row):
    return (row.get("status") or "") in CLOSED_STATUS


def run(rows, out_dir, log, wp_posts_path=None, only_missing=True, ocr=True, include_closed=False):
    """rows 를 제자리에서 채우고 계층별 행 목록을 돌려준다. PDF 읽기 도구가 없으면 실패로 기록하고 wp 주소만 붙인다."""
    posts = load_wp_posts(wp_posts_path)
    ok = fail = skip = ocr_n = 0
    terms = []
    can = have_pdftotext()
    if not can:
        log.fail("추출", "준비", "pdftotext(poppler)가 없어 자격 조건 추출을 건너뜀", 1)
    elif ocr and not have_ocr():
        log.note("OCR 안 함: tesseract 한글(kor) 언어 데이터가 없음 — 이미지 PDF는 '확인필요'로 남김")
    for r in rows:
        r["wp_post_url"] = posts.get(r["key"], r.get("wp_post_url", ""))
        if not can:
            continue
        if is_closed(r) and not include_closed:
            continue
        if only_missing and (r.get("extract_status") or "").startswith("자동추출"):
            skip += 1
            continue
        try:
            st, tr = extract_row(r, out_dir, ocr=ocr)
            terms.extend(tr)
            if st.startswith("자동추출"):
                ok += 1
                ocr_n += 1 if "OCR" in st else 0
            else:
                fail += 1
                if "PDF 없음" not in st:
                    log.fail("추출", "PDF", f"{r['key']}: {st}")
        except Exception as e:  # 한 건이 죽어도 나머지는 계속
            log.fail("추출", "PDF", f"{r['key']}: {type(e).__name__} {e}")
            r["extract_status"] = "확인필요(추출 오류)"
    log.note(f"자격 조건 추출: 자동추출 {ok}건(OCR {ocr_n}건), 확인필요 {fail}건, 이미 추출됨 {skip}건 (모두 원문대조 필요)")
    return terms


# ---- 유형 표준 보완 ---------------------------------------------------------------------
# 공고문은 유형별로 표준 양식이고 공고마다 조금씩만 다르다(타래 2026-11-25). 문구를 못 읽은 칸은
# 같은 유형·같은 계층의 다른 공고에서 읽힌 값(표준)으로 채운다. 지역 관련 값은 공고마다 달라 채우지 않는다.
# 완화·선착순·무순위 같은 공고는 표준에서 벗어나므로 표준을 만들 때도, 받을 때도 제외한다.
# 소득·자산·자동차·청약저축 값은 다른(구형일 수 있는) 공고에서 빌리지 않는다. 그 값은 유형별 표준 표(최신 기준)만 쓴다.
STD_COLS = ["income_eval_scope", "homeless_scope", "household_head_rule", "income_table"]
NON_STD_TITLE = re.compile(r"완화|선착순|무순위|동호지정|선계약|잔여|추가\s*모집|공가")



# ---- 유형별 표준 표 (data/standard_terms.csv) ---------------------------------------------
# 값 찾는 순서: ① 공고문 PDF → ② 유형별 표준 표(이 함수) → ③ 둘 다 없으면 '확인필요'.
# 공고문에 값이 있으면 절대 덮어쓰지 않는다. 표준으로 채운 열 이름은 std_applied 에 ';'로 남기고,
# evidence 에도 '표준 적용'으로 적는다(웹앱은 std_applied 가 비어 있지 않은 열을 '신청 가능' 단정 근거로 쓰지 않는다).
# 완화·선착순·무순위·선계약·추가모집 같은 특화 공고는 표준에서 벗어나므로 받지 않는다(확인필요로 둔다).
STD_TABLE_COLS = ["residence_level", "income_basis", "income_pcts", "income_bonus", "asset_total_man", "car_man", "asset_kind",
                  "car_rule_type", "income_pct_dual", "sub_timing", "sub_min_rounds"]
NON_STD_MODE = ("자격완화", "선착순", "선계약후검증", "추가모집")



def normalize_dual(terms):
    """income_pct_dual 을 '맞벌이로 체크했을 때 적용할 최종 소득 %'로 통일한다(필터용).
    공고문에서 '+30%p 우대'처럼 가산폭(60 미만)으로 읽힌 값은 소득%의 가장 큰 값에 더해 최종 %로 바꾸고,
    기준을 알 수 없으면 확인필요로 둔다. 원래 읽은 문구는 evidence 에 남는다."""
    n = 0
    for t in terms:
        v = (t.get("income_pct_dual") or "").strip()
        if not v.isdigit() or int(v) >= 60:
            continue
        pcts = [int(x) for x in re.findall(r"\d+", t.get("income_pcts", "")) if int(x) >= 60]
        if pcts:
            t["income_pct_dual"] = str(max(pcts) + int(v))
            t["evidence"] = (t.get("evidence", "") + f" ; 맞벌이 +{v}%p → 최종 {t['income_pct_dual']}%").strip(" ;")
        else:
            t["evidence"] = (t.get("evidence", "") + f" ; 맞벌이 +{v}%p(기준 % 미상)").strip(" ;")
            t["income_pct_dual"] = TODO
        n += 1
    return n


def load_standard_table(path):
    if not path or not os.path.exists(path):
        return []
    with open(path, encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def apply_standard_table(terms, rows_by_key, std_rows):
    """terms 의 '확인필요' 칸을 유형별 표준 표로 채운다. 반환: 채운 칸 수. 먼저 맞는 표준 행 하나만 쓴다."""
    filled = 0
    for t in terms:
        r = rows_by_key.get(t["key"], {})
        title = r.get("title", "")
        if NON_STD_TITLE.search(title) or any(m in (r.get("recruit_mode") or "") for m in NON_STD_MODE):
            continue
        typ = r.get("type", "")
        hit = None
        for s in std_rows:
            if not re.search(s["type_re"], typ):
                continue
            if s["title_re"] and not re.search(s["title_re"], title):
                continue
            if s["title_not_re"] and re.search(s["title_not_re"], title):
                continue
            if s["tier_re"] and not re.search(s["tier_re"], t["tier"]):
                continue
            if s.get("rank_re") and not re.search(s["rank_re"], t.get("rank", "")):
                continue
            hit = s
            break
        if not hit:
            continue
        got = []
        for c in STD_TABLE_COLS:
            v = (hit.get(c) or "").strip()
            if t.get(c, TODO) == TODO and v and v != TODO:
                t[c] = v
                got.append(c)
        if got:
            t["std_applied"] = ";".join([x for x in (t.get("std_applied", "").split(";") + got) if x])
            t["evidence"] = (t.get("evidence", "") + " ; 표준 적용(" + hit["std_id"] + "): " + ", ".join(f"{c}={t[c]}" for c in got)).strip(" ;")
            t["extract_status"] = "자동추출(일부 표준 보완, 원문대조 필요)"
            filled += len(got)
    return filled


def fill_from_standard(terms, rows_by_key, min_support=3, min_share=0.7):
    """terms 의 '확인필요' 칸을 같은 (유형, 계층) 표준값으로 채운다. 채운 곳은 evidence 에 '유형 표준 적용'을 남긴다.
    반환: 채운 칸 수. 기준: 같은 (유형, 계층)에서 읽힌 값이 min_support 건 이상이고 그중 min_share 이상이 같을 때만."""
    def grp(t):
        r = rows_by_key.get(t["key"], {})
        return (r.get("type", ""), t["tier"]), r
    votes = {}
    for t in terms:
        g, r = grp(t)
        if NON_STD_TITLE.search(r.get("title", "")) or not g[0]:
            continue
        for c in STD_COLS:
            v = t.get(c, TODO)
            if v and v != TODO:
                votes.setdefault((g, c), {}).setdefault(v, set()).add(t["key"])
    std = {}
    for (g, c), d in votes.items():
        total = sum(len(k) for k in d.values())
        best, ks = max(d.items(), key=lambda kv: len(kv[1]))
        if len(ks) >= min_support and len(ks) / total >= min_share:
            std[(g, c)] = (best, len(ks), total)
    filled = 0
    for t in terms:
        g, r = grp(t)
        if NON_STD_TITLE.search(r.get("title", "")) or not g[0]:
            continue
        got = []
        for c in STD_COLS:
            if t.get(c, TODO) == TODO and (g, c) in std:
                v, n, tot = std[(g, c)]
                t[c] = v
                got.append(f"{c}={v}({n}/{tot}건)")
                t["std_applied"] = ";".join([x for x in (t.get("std_applied", "").split(";") + [c]) if x])
                filled += 1
        if got:
            t["evidence"] = (t.get("evidence", "") + " ; 표준 적용(같은 유형·계층 다수 공고, " + g[0] + "·" + g[1] + "): " + ", ".join(got)).strip(" ;")
            t["extract_status"] = "자동추출(일부 표준 보완, 원문대조 필요)"
    return filled


def write_terms(terms, out_dir):
    """계층별 조건 표(공고번호+계층 한 행) → terms.csv, terms.json"""
    with open(os.path.join(out_dir, "terms.csv"), "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=TERM_COLS, extrasaction="ignore")
        w.writeheader()
        w.writerows(terms)
    with open(os.path.join(out_dir, "terms.json"), "w", encoding="utf-8") as f:
        json.dump(terms, f, ensure_ascii=False, indent=1)


def main():
    """이미 받은 out/ 의 PDF에서 조건만 다시 뽑는다(인터넷 없이 가능): python scripts/extract_terms.py --out out"""
    import argparse
    import sys
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from common import RunLog
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="out")
    ap.add_argument("--wp-posts", default=os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "wp_posts.csv"))
    ap.add_argument("--redo", action="store_true", help="이미 추출된 행도 다시 뽑음")
    ap.add_argument("--no-ocr", action="store_true")
    ap.add_argument("--include-closed", action="store_true", help="마감된 공고도 조건을 뽑음(기본은 뺌: 구형 기준 값 방지)")
    a = ap.parse_args()
    with open(os.path.join(a.out, "list.json"), encoding="utf-8") as f:
        rows = json.load(f)
    log = RunLog()
    terms = run(rows, a.out, log, wp_posts_path=a.wp_posts, only_missing=not a.redo, ocr=not a.no_ocr, include_closed=a.include_closed)
    cols = list(rows[0].keys()) if rows else []
    for c in NEW_COLS:
        if c not in cols:
            cols.append(c)
    with open(os.path.join(a.out, "list.csv"), "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=[c for c in cols if not c.startswith("_")], extrasaction="ignore")
        w.writeheader()
        w.writerows(rows)
    with open(os.path.join(a.out, "list.json"), "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=1)
    # 이미 있던 계층 행은 유지하고, 이번에 다시 뽑은 공고 것만 바꾼다
    tp = os.path.join(a.out, "terms.csv")
    if os.path.exists(tp):
        newkeys = {t["key"] for t in terms}
        with open(tp, encoding="utf-8-sig", newline="") as f:
            terms = [t for t in csv.DictReader(f) if t["key"] not in newkeys] + terms
    by_key = {r["key"]: r for r in rows}
    if not a.include_closed:        # 이전에 뽑아 둔 마감 공고 행도 terms 에서 뺀다
        before = len(terms)
        terms = [t for t in terms if not is_closed(by_key.get(t["key"], {}))]
        print(f"마감 공고 계층행 제외: {before - len(terms)}")
    std_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "standard_terms.csv")
    for t in terms:
        t.setdefault("std_applied", "")
    n_tab = apply_standard_table(terms, by_key, load_standard_table(std_path))      # ② 표준 표
    n_vote = fill_from_standard(terms, by_key)                                       # ② 표준 표에도 없는 칸: 같은 유형·계층 다수값
    n_dual = normalize_dual(terms)                                                   # 맞벌이 소득%를 최종 %로 통일
    print(f"표준 표로 채운 칸: {n_tab}, 같은 유형·계층 다수값으로 채운 칸: {n_vote}, 맞벌이 %를 최종값으로 바꾼 행: {n_dual}")
    write_terms(terms, a.out)
    print(log.to_markdown({"전체": len(rows), "계층행": len(terms)}))


if __name__ == "__main__":
    main()
