import { cookies } from "next/headers";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

const BASE = `${process.env.NEXT_PUBLIC_API_URL}/api`;

async function cookieHeader(): Promise<string | undefined> {
  const store = await cookies();
  const all = store.getAll();
  if (!all.length) return undefined;
  return all.map(({ name, value }) => `${name}=${value}`).join("; ");
}

async function withCookieFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const cookie = await cookieHeader();

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...(cookie ? { Cookie: cookie } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export const getMeServer = () => withCookieFetch<User>("/users/me");

export async function fetchNotesServer(params: {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag | "All";
}) {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.perPage) q.set("perPage", String(params.perPage));
  if (params.search) q.set("search", params.search);
  if (params.tag && params.tag !== "All") q.set("tag", params.tag);
  return withCookieFetch<{ notes: Note[]; totalPages: number }>(`/notes?${q.toString()}`);
}

export const fetchNoteByIdServer = (id: string) => withCookieFetch<Note>(`/notes/${id}`);
