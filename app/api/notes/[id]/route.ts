import { NextResponse } from "next/server";
import { api } from "../../api";
import { cookies } from "next/headers";
import { logErrorResponse } from "../../_utils/utils";
import { isAxiosError } from "axios";

type Props = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Props) {
  try {
    const cookieStore = await cookies();
    const { id } = await params;
    const res = await api(`/notes/${id}`, { headers: { Cookie: cookieStore.toString() } });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      const status = error.response?.status ?? 500;
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status },
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  try {
    const cookieStore = await cookies();
    const { id } = await params;
    const res = await api.delete(`/notes/${id}`, { headers: { Cookie: cookieStore.toString() } });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      const status = error.response?.status ?? 500;
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status },
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Props) {
  try {
    const cookieStore = await cookies();
    const { id } = await params;
    const body = await request.json();

    const res = await api.patch(`/notes/${id}`, body, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      const status = error.response?.status ?? 500;
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status },
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
