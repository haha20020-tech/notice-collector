#!/usr/bin/env python3
"""MyHome portal public housing notice API client — PC version.

Read-only. Reads the serviceKey from the DATA_GO_KR_KEY environment
variable only; the real serviceKey never appears in this file,
arguments, or logs.

Endpoint (verified 2026-11-23 from data.go.kr openapi page 15108420):
  https://apis.data.go.kr/1613000/HWSPR02/rsdtRcritNtcList
Params: serviceKey (required), brtcCode, signguCode, numOfRows,
pageNo, suplyTy, lfstsTyAt, bassMtRntchrgSe, houseTy (all optional).
"""
import argparse
import json
import os
import sys
import urllib.parse
import urllib.request


ENDPOINT = "https://apis.data.go.kr/1613000/HWSPR02/rsdtRcritNtcList"


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args):
        raise RuntimeError("redirect refused, verify the endpoint")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--num-rows", default="3")
    p.add_argument("--page", default="1")
    p.add_argument("--brtc-code", default="")
    p.add_argument("--signgu-code", default="")
    p.add_argument("--suply-ty", default="")
    p.add_argument("--lfsts-ty-at", default="")
    p.add_argument("--bass-mt-rntchrg-se", default="")
    p.add_argument("--house-ty", default="")
    a = p.parse_args()

    params = {"resultType": "json", "numOfRows": a.num_rows, "pageNo": a.page}
    for k, v in [("brtcCode", a.brtc_code), ("signguCode", a.signgu_code),
                 ("suplyTy", a.suply_ty), ("lfstsTyAt", a.lfsts_ty_at),
                 ("bassMtRntchrgSe", a.bass_mt_rntchrg_se),
                 ("houseTy", a.house_ty)]:
        if v:
            params[k] = v
    params["serviceKey"] = os.environ.get("DATA_GO_KR_KEY", "")
    if not params["serviceKey"]:
        print("DATA_GO_KR_KEY environment variable is not set", file=sys.stderr)
        raise SystemExit(2)
    url = ENDPOINT + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, method="GET")
    req.add_header("Accept", "application/json")
    with urllib.request.build_opener(NoRedirect()).open(req, timeout=30) as resp:
        raw = resp.read()
    try:
        out = json.loads(raw.decode("utf-8"))
    except Exception:
        print(raw.decode("utf-8", errors="replace")[:4000])
        raise SystemExit(2)
    print(json.dumps(out, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
