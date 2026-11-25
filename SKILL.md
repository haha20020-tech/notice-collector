---
name: notice-collector
description: LH·SH·GH·마이홈의 공공임대 모집공고를 모아 통합 목록(CSV/JSON)·첨부 PDF·실행 기록으로 만든다. 공고 수집, 신규·정정 확인이 필요할 때 사용.
---

# 공고 수집 일꾼

1. 환경변수 `DATA_GO_KR_KEY` 확인 (없으면 사용자에게 설정을 요청, 키를 대화에 붙이게 하지 않는다).
2. `python scripts/run_all.py` 실행. 일부만: `--only sh,gh`. 목록만: `--no-detail`. 마감 공고 빼기: `--skip-closed`.
3. `out/run_log.md` 를 읽고 신규·정정·변동·실패 건수를 보고한다. 실패는 "출처·단계·이유"를 그대로 전한다.
4. 실패가 SH·GH 화면 읽기라면 `--dump-html` 로 다시 돌려 `out/debug/` 를 확인한다.

금지: 로그인·캡차 우회, 담당자 개인정보 저장, 키를 파일에 쓰기, 하루 2회 초과 실행.
