# notice-collector — 공공임대 공고 수집 에이전트

LH · SH · GH(+마이홈 API)의 주택 모집공고를 모아 **한 장의 목록(CSV·JSON)** 으로 만들고, 첨부 공고문(PDF)을 저장하고, **실행 기록**(신규/정정/변동/실패)을 남깁니다. 표준 라이브러리만 쓰므로 `pip install`이 필요 없습니다 (Python 3.9+).

## 5분 사용법
1. 공공데이터포털(data.go.kr)에서 아래 API를 각각 **활용신청**하고 인증키를 받습니다. 키는 같지만 서비스마다 신청이 따로입니다.
   - LH 분양임대공고문 조회 / 국토교통부 마이홈포털 공고(HWSPR02)
2. 키를 환경변수로 넣습니다 (파일에 적지 마세요).
   - Windows(PowerShell): `$env:DATA_GO_KR_KEY="발급받은키"`
   - macOS/Linux: `export DATA_GO_KR_KEY="발급받은키"`
3. 실행합니다.
   ```
   python scripts/run_all.py
   ```
4. `out/` 에 결과가 생깁니다: `list.csv`, `list.json`, `run_log.md`, `attachments/`.

일부만 돌리기: `--only sh,gh` · 자격 조건 뽑기: `--extract` · 첨부 안 받기: `--no-download` · 상세 화면 안 읽기: `--no-detail` · 화면 구조가 어긋날 때 원본 저장: `--dump-html` (`out/debug/`) · SH 분양 게시판도: `--sh-boards 2,1`

두 번째 실행부터는 `out/list.json`을 기억해 두고 **새 글만** 상세·첨부를 읽습니다. 첫 실행은 SH·GH 상세를 2초 간격으로 읽어 몇 분 걸립니다.

## 출처와 방식
| 출처 | 방식 | 비고 |
|---|---|---|
| LH | 공식 API | 토지·상가 제외 |
| 마이홈 | 공식 API | LH 행은 중복이라 버림. SH·GH 행은 **세기만** 하고 기록 (2026-11-23 확인: 0건) |
| SH | i-sh.co.kr 공고 및 공지(주택임대) 게시판 | 글번호(seq)로 중복·신규 판단, 공고문 PDF 저장 |
| GH | apply.gh.or.kr 청약공고(임대주택·매입임대) 목록 | 공고번호(pbancNo)로 판단, 접수기간·공고문 PDF 저장. 실시간 경로는 이것뿐 (아래 표) |

### SH·GH 화면 구조 (2026-11-24 실제 화면으로 확인)
| | 목록 | 상세 | 첨부 |
|---|---|---|---|
| SH | `brd/m_247/list.do?multi_itm_seq=2&page=N`, 제목 링크 `getDetailView('313481')` | `view.do?seq=313481&multi_itm_seq=2` | 상세 스크립트의 `initParam.downList` → `/app/com/file/innoFD.do?brdId=..&seq=..&fileTp=..&fileSeq=..` |
| GH | `/sb/sr/sr7150/selectPbancRentHouseList.do?pageIndex=N` (임대주택), `sr7155` (매입임대) | `selectPbancDetailView.do?pbancNo=..&pbancKndCd=..&previewYn=N&bizTyNm=..` | 상세의 `apply-cdn.gh.or.kr/.../selectFileDown.do?...` 링크 |

GH 목록 표는 `</td>`가 빠진 칸이 있어 전용 파서로 읽습니다. 실제 화면 발췌는 `tests/fixtures/`에 있습니다.

### GH 공식 데이터 — 확인 완료, 제외
공공데이터포털의 GH 주택청약 모집·공급정보(기준일 2026-09-08)와 경기데이터드림의 연간 데이터셋(기준일 2026-03-13 / 2026-09-11)은 갱신이 연 단위라 신규 공고 수집에 맞지 않아 제외했습니다. 경기도 행복주택 현황(분기)은 참고용입니다.

## 실제 수집 예시 (`examples/`)
2026-11-24에 SH·GH를 실제로 수집한 결과입니다(SH 9건, GH 31건, 실패 0). LH·마이홈은 인증키가 필요해 빠져 있습니다. `run_log.md`에 무엇을 왜 뺐는지 적혀 있습니다.

## 결과 파일
`list.csv` 한 행 = 공고 1건. 열: key, org, source, title, posted_date, apply_start, apply_end, status, type, region, correction_of(정정공고가 가리키는 원공고 key), is_correction, attachments, detail_url, collected_at.
`run_log.md`: 신규·정정·변동·실패 건수, 출처별 표, **실패는 "출처·단계(목록/상세/첨부)·건수·이유"** 로 기록. 한 출처가 실패해도 나머지는 계속 돌립니다.

## 자격 조건 열 (맞춤 공고 자격진단 웹앱용, `--extract`)
공고문 PDF에서 자격 조건을 **초안**으로 뽑아 `list.csv`·`list.json`에 열로 붙입니다(`pdftotext`(poppler)가 있어야 합니다. 없으면 실패로 기록하고 건너뜁니다). 못 찾은 값은 빈칸이 아니라 `확인필요`로 두고, 값마다 근거 문장을 `evidence`에 남깁니다. **자동으로 뽑은 값은 사람이 PDF 원문과 맞춘 뒤에야 `대조완료`로 바꿔 쓰세요.**

| 열 | 뜻 |
|---|---|
| recruit_target | 모집 계층(`\|`로 여러 개). 제목에 계층 말이 없으면 `일반(…)` 또는 `(계층 목록 확인필요)` |
| recruit_mode | 예비입주자·추가모집·자격완화·선착순·선계약후검증·입주자모집 |
| income_basis / income_pcts | 소득 기준 이름(도시근로자 월평균소득 등)과 비율들(예: `70\|50`) |
| income_table | 가구원수별 월평균소득 금액표(JSON, 한 줄에 읽힌 칸만) |
| income_bonus | 가산 규칙 문구(1인 20%·2인 10%, 출산자녀 가산 등) |
| asset_total_man / car_man | 총자산·자동차 한도(만원) |
| homeless_rule / subscription_rule / residence_rule | 무주택 대상, 청약저축 조건, 1순위 거주 요건 문구 |
| pdf_used / extract_status / evidence | 읽은 PDF, 추출 상태, 근거 문장 |
| wp_post_url | 게시한 글 주소. `data/wp_posts.csv`(key,wp_post_url)에 적으면 붙습니다 |

실제 공고문 PDF 7개(GH 5·SH 2)로 시험했습니다: 소득 비율 7/7, 소득표 6/7, 총자산 3/7, 자동차 4/7을 뽑았고 나머지는 `확인필요`입니다(자산·자동차가 자녀 수별 표로 적힌 공고 등). 표가 두 단으로 갈라진 공고는 금액표가 일부만 읽힙니다. 한 공고에 계층이 여럿이면 계층별 소득·자산 값은 아직 나누지 못합니다.

## 지키는 원칙
- 로그인·캡차를 우회하지 않습니다. 각 사이트의 robots.txt를 확인하고 금지 경로는 요청하지 않습니다(SH·GH 모두 이 경로는 허용).
- 하루 1~2회, 요청 사이 1~2초 쉼. 상세·첨부는 새 글에만 읽습니다.
- SH 화면은 상세로 넘어갈 때 대기열(NetFunnel) 위젯을 거칩니다. 이 위젯은 오류가 나도 그대로 넘겨 주는 부하 분산용이라 이 도구는 상세 주소를 바로 읽되, 새 글에만 2초 간격으로 읽습니다. 꺼림칙하면 `--no-detail`로 목록만 모읍니다.
- 담당자 이름·전화·이메일은 저장하지 않습니다. 파일 이름에 '연락처'·'담당자'가 든 첨부는 받지 않습니다.
- SH 게시판은 시스템 공지가 섞여 있어 제목에 '모집'·'공고'가 있는 글만 남깁니다.
- 화면을 읽을 때 표 머리글을 못 찾으면 조용히 넘어가지 않고 **실패로 기록**합니다.
- 인증키는 코드·저장소에 넣지 않습니다.

## 알려진 한계
- 화면 구조는 2026-11-24 기준입니다. 사이트가 바뀌면 표 머리글을 못 찾아 **실패로 기록**되고, `--dump-html`로 원본을 남겨 고칩니다.
- 첨부는 PDF만 저장합니다(HWP는 이름만 목록에 남김).
- SH 신청기간은 게시판에 없고 공고문 PDF 안에만 있어 비어 있습니다. LH 신청 시작일도 API 목록에 없습니다.
- LH 행은 공고문 PDF를 받지 않아 `--extract`가 `확인필요(PDF 없음)`로 둡니다(LH 공고문 파일 주소 받기는 아직 없음).
- LH 목록은 서버 기본값(최근 두 달)만 받습니다. 날짜 검색 조건은 검증 전이라 쓰지 않습니다.

## 시험
`python tests/test_parsers.py` — 실제 SH·GH 화면 발췌와 가짜 응답으로 파서·합치기·재실행(새 글만 읽기)을 확인합니다. 네트워크 없이 돌아갑니다.

## 라이선스
MIT

## 계층별 조건 표와 첨부 받기 (2026-11-25 추가)

- `python scripts/extract_terms.py --out out` : 이미 받은 PDF에서 조건을 다시 뽑는다(인터넷 불필요). 결과: `list.csv/json`(공고 1건 1행, 접수기간 포함) + `terms.csv/json`(공고번호+계층 1행).
- `terms.csv` 열: key, tier, income_basis, income_pcts, income_table, income_bonus, asset_total_man, car_man, homeless_scope, age_min, age_max, marriage_years_max, child_age_max, work_years_max, extract_status, evidence. 계층이 둘 이상인 공고는 공고 전체 값(소득%·자산·자동차)이 어느 계층 것인지 알 수 없어 `확인필요`로 둔다.
- 못 뽑은 값은 빈칸이 아니라 `확인필요`. 모든 값은 `자동추출(원문대조 필요)`. 글자가 없는 이미지 PDF는 tesseract 한글(kor) 데이터가 있으면 OCR(`자동추출(OCR, 원문대조 필요)`), 없으면 `확인필요`.
- `python scripts/run_all.py --only lh --lh-files` : LH 첨부 PDF를 상세 API(dsAhflInfo)로 받는다(이미 받은 공고는 건너뜀). PDF는 PC `out/attachments/`에만 두고 깃허브에는 올리지 않는다(.gitignore).
