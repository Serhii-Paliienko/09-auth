import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNoteByIdServer } from "@/lib/api/serverApi";
import NoteDetailsClient from "./NoteDetails.client";
import type { Metadata } from "next";
import { OG_IMAGE, SITE_URL } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteByIdServer(id);
  const title = `${note.title} — Note details`;
  const url = `${SITE_URL}/notes/${id}`;
  const description =
    (note.content || "").replace(/\s+/g, " ").slice(0, 160) ||
    `Read the note “${note.title}” on NoteHub.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      images: [{ url: OG_IMAGE }],
    },
  };
}

export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteByIdServer(id),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
}
