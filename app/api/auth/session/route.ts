import { NextRequest, NextResponse } from "next/server";
import { api } from "../../api";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie") ?? "";
    const hasAccess = /(^|;\s*)accessToken=/.test(cookieHeader);
    if (hasAccess) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const apiRes = await api.get("/auth/session", {
      headers: { cookie: cookieHeader },
    });

    const ok = apiRes?.data && typeof apiRes.data === "object";

    const res = NextResponse.json({ success: Boolean(ok) }, { status: 200 });

    const setCookie = apiRes.headers["set-cookie"];
    if (setCookie) {
      if (Array.isArray(setCookie)) {
        setCookie.forEach((c) => res.headers.append("set-cookie", c));
      } else {
        res.headers.set("set-cookie", setCookie);
      }
    }
    return res;
  } catch (error) {
    logErrorResponse(error);
    if (isAxiosError(error)) {
      return NextResponse.json({ success: false }, { status: 200 });
    }
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
