#!/usr/bin/env python3
"""LH public data API client — PC version.

Read-only. Reads the serviceKey from the DATA_GO_KR_KEY environment
variable only; the real key never appears in this file, arguments, or logs.
Set it first (Windows): set DATA_GO_KR_KEY=... (do not paste it into
chat, files, or logs).
"""
import argparse
import json
import os
import sys
import urllib.parse
import urllib.request


BASE = "https://apis.data.go.kr/B552555"

ENDPOINTS = {
    "notices": f"{BASE}/lhLeaseNoticeInfo1/lhLeaseNoticeInfo1",
    "supply": f"{BASE}/lhLeaseNoticeSplInfo1/getLeaseNoticeSplInfo1",
    "detail": f"{BASE}/lhLeaseNoticeDtlInfo1/getLeaseNoticeDtlInfo1",
    # Cutline operation verified 2026-11-22: getCsrLsPwiPneScrInfo.
    # Required search field is CNP_NM (sido name, e.g. 인천광역시).
    # Recognised optional filters: PAN_NM, SBD_LGO_NM, SGG_NM.
    "cutline": f"{BASE}/lhCsrLsPwiPneScrInfo/getCsrLsPwiPneScrInfo",
}


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args):
        raise RuntimeError("redirect refused, verify the endpoint")


def service_key():
    key = os.environ.get("DATA_GO_KR_KEY", "")
    if not key:
        print("DATA_GO_KR_KEY environment variable is not set", file=sys.stderr)
        raise SystemExit(2)
    return key


def call(endpoint, params):
    params = dict(params)
    params["serviceKey"] = service_key()
    url = endpoint + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, method="GET")
    req.add_header("Accept", "application/json")
    with urllib.request.build_opener(NoRedirect()).open(req, timeout=30) as resp:
        raw = resp.read()
    try:
        return json.loads(raw.decode("utf-8"))
    except Exception:
        # data.go.kr returns XML on error even when resultType=json is set
        print(raw.decode("utf-8", errors="replace")[:4000])
        raise SystemExit(2)


def main():
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)

    n = sub.add_parser("notices")
    n.add_argument("--pg-sz", default="5")
    n.add_argument("--page", default="1")
    n.add_argument("--pan-nm", default="")
    n.add_argument("--upp-ais-tp-cd", default="")
    n.add_argument("--cnp-cd", default="")
    n.add_argument("--pan-ss", default="")
    n.add_argument("--pan-nt-st-dt", default="2026.11.01")
    n.add_argument("--clsg-dt", default="2026.12.31")

    s = sub.add_parser("supply")
    s.add_argument("--spl-inf-tp-cd", required=True)
    s.add_argument("--ccr-cnnt-sys-ds-cd", required=True)
    s.add_argument("--pan-id", required=True)
    s.add_argument("--pg-sz", default="10")
    s.add_argument("--page", default="1")

    d = sub.add_parser("detail")
    d.add_argument("--spl-inf-tp-cd", required=True)
    d.add_argument("--ccr-cnnt-sys-ds-cd", required=True)
    d.add_argument("--pan-id", required=True)
    d.add_argument("--upp-ais-tp-cd", required=True)
    d.add_argument("--pg-sz", default="10")
    d.add_argument("--page", default="1")

    c = sub.add_parser("cutline")
    c.add_argument("--pg-sz", default="5")
    c.add_argument("--page", default="1")
    c.add_argument("--cnp-nm", required=True, help="sido name, e.g. 인천광역시")
    c.add_argument("--pan-nm", default="")
    c.add_argument("--sbd-lgo-nm", default="")
    c.add_argument("--sgg-nm", default="")

    a = p.parse_args()
    base = {"resultType": "json", "PG_SZ": a.pg_sz, "PAGE": a.page}
    if a.cmd == "notices":
        params = dict(base)
        for k, v in [("PAN_NM", a.pan_nm), ("UPP_AIS_TP_CD", a.upp_ais_tp_cd),
                     ("CNP_CD", a.cnp_cd), ("PAN_SS", a.pan_ss),
                     ("PAN_NT_ST_DT", a.pan_nt_st_dt), ("CLSG_DT", a.clsg_dt)]:
            if v:
                params[k] = v
        out = call(ENDPOINTS["notices"], params)
    elif a.cmd == "supply":
        out = call(ENDPOINTS["supply"], dict(base, SPL_INF_TP_CD=a.spl_inf_tp_cd,
                                              CCR_CNNT_SYS_DS_CD=a.ccr_cnnt_sys_ds_cd,
                                              PAN_ID=a.pan_id))
    elif a.cmd == "detail":
        out = call(ENDPOINTS["detail"], dict(base, SPL_INF_TP_CD=a.spl_inf_tp_cd,
                                              CCR_CNNT_SYS_DS_CD=a.ccr_cnnt_sys_ds_cd,
                                              PAN_ID=a.pan_id,
                                              UPP_AIS_TP_CD=a.upp_ais_tp_cd))
    elif a.cmd == "cutline":
        params = dict(base, CNP_NM=a.cnp_nm)
        for k, v in [("PAN_NM", a.pan_nm), ("SBD_LGO_NM", a.sbd_lgo_nm),
                     ("SGG_NM", a.sgg_nm)]:
            if v:
                params[k] = v
        out = call(ENDPOINTS["cutline"], params)
    print(json.dumps(out, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
