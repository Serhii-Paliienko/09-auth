import { cookies } from "next/headers";
import { api } from "./api";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

const origin =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const BASE = `${origin}/api`;

async function cookieHeader(): Promise<string | undefined> {
  const store = await cookies();
  const all = store.getAll();
  if (!all.length) return undefined;
  return all.map(({ name, value }) => `${name}=${value}`).join("; ");
}

export async function registerUserServer(payload: {
  email: string;
  password: string;
}): Promise<User> {
  const { data } = await api.post<User>("/auth/register", payload, {
    baseURL: BASE,
  });
  return data;
}

export async function loginUserServer(payload: { email: string; password: string }): Promise<User> {
  const { data } = await api.post<User>("/auth/login", payload, {
    baseURL: BASE,
  });
  return data;
}

export async function logoutUserServer(): Promise<void> {
  const Cookie = await cookieHeader();
  await api.post(
    "/auth/logout",
    {},
    {
      baseURL: BASE,
      headers: Cookie ? { Cookie } : undefined,
    },
  );
}

export async function getSessionServer(): Promise<{ success: boolean }> {
  const Cookie = await cookieHeader();
  const { data } = await api.get<{ success: boolean }>("/auth/session", {
    baseURL: BASE,
    headers: Cookie ? { Cookie } : undefined,
  });
  return data;
}

export async function getMeServer(): Promise<User> {
  const Cookie = await cookieHeader();
  const { data } = await api.get<User>("/users/me", {
    baseURL: BASE,
    headers: Cookie ? { Cookie } : undefined,
  });
  return data;
}

export async function fetchNotesServer(params: {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag | "All";
}): Promise<{ notes: Note[]; totalPages: number }> {
  const { page = 1, perPage = 12, search, tag } = params ?? {};
  const q: Record<string, unknown> = { page, perPage };
  if (search) q.search = search;
  if (tag && tag !== "All") q.tag = tag;

  const Cookie = await cookieHeader();
  const { data } = await api.get<{ notes: Note[]; totalPages: number }>("/notes", {
    baseURL: BASE,
    headers: Cookie ? { Cookie } : undefined,
    params: q,
  });
  return data;
}

export async function fetchNoteByIdServer(id: string): Promise<Note> {
  const Cookie = await cookieHeader();
  const { data } = await api.get<Note>(`/notes/${id}`, {
    baseURL: BASE,
    headers: Cookie ? { Cookie } : undefined,
  });
  return data;
}
