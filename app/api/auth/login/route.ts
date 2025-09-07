import { NextRequest, NextResponse } from "next/server";
import { api } from "../../api";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiRes = await api.post("/auth/login", body);
    const res = NextResponse.json(apiRes.data, { status: apiRes.status });

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
      const status = error.response?.status ?? 500;
      const data = error.response?.data ?? { message: "Unexpected error" };
      return NextResponse.json(data, { status });
    }
    return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
  }
}
