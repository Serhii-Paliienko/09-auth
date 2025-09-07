"use client";

import { api } from "./api";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag | "All";
}
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
export interface CreateNoteInput {
  title: string;
  content?: string;
  tag: NoteTag;
}

export async function registerUser(payload: {
  email: string;
  password: string;
}): Promise<User> {
  const { data } = await api.post<User>("/auth/register", payload);
  return data;
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<User> {
  const { data } = await api.post<User>("/auth/login", payload);
  return data;
}

export async function logoutUser(): Promise<void> {
  await api.post("/auth/logout");
}

export async function getSession(): Promise<{ success: boolean }> {
  const { data } = await api.get<{ success: boolean }>("/auth/session");
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export async function updateMe(patch: Partial<User>): Promise<User> {
  const { data } = await api.patch<User>("/users/me", patch);
  return data;
}

export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const { page = 1, perPage = 12, search, tag } = params;
  const q: Record<string, unknown> = { page, perPage };
  if (search) q.search = search;
  if (tag) q.tag = tag;

  const { data } = await api.get<FetchNotesResponse>("/notes", { params: q });
  return data;
}

export async function createNote(input: CreateNoteInput): Promise<Note> {
  const { data } = await api.post<Note>("/notes", input);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}
