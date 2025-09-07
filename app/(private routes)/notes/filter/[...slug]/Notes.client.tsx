"use client";

import { useEffect, useMemo, useState } from "react";
import css from "./NotesPage.module.css";
import { useDebounce } from "use-debounce";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import { fetchNotes, type FetchNotesResponse } from "@/lib/api/clientApi";
import { NoteTag } from "@/types/note";
import Link from "next/link";

function Loader() {
  return <div>Loading...</div>;
}
function ErrorBox({ error }: { error: unknown }) {
  const msg = error instanceof Error ? error.message : "Unknown error";
  return <div>Error: {msg}</div>;
}

export default function NotesClient({
  initialPage,
  perPage,
  initialSearch,
  selectedTag,
}: {
  initialPage: number;
  perPage: number;
  initialSearch: string;
  selectedTag: "All" | NoteTag;
}) {
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [debounceSearch] = useDebounce(search, 300);

  useEffect(() => setPage(1), [debounceSearch, selectedTag]);

  const q = useMemo(
    () => ({ page, perPage, search: debounceSearch, tag: selectedTag }),
    [page, perPage, debounceSearch, selectedTag],
  );

  const { data, isPending, error } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", q],
    queryFn: () =>
      fetchNotes({
        ...q,
        tag: q.tag === "All" ? undefined : q.tag,
      }),
    placeholderData: keepPreviousData,
  });

  if (isPending) return <Loader />;
  if (error) return <ErrorBox error={error} />;

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} placeholder="Search notes..." />
        <Link prefetch={false} href="/notes/action/create" className={css.button}>
          Create note
        </Link>
      </div>
      <NoteList notes={notes} />
      <Pagination pageCount={totalPages} currentPage={page} onPageChange={setPage} />
    </div>
  );
}
