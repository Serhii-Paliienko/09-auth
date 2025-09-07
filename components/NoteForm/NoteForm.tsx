"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, type CreateNoteInput } from "@/lib/api/clientApi";
import { TAGS, type NoteTag } from "@/types/note";
import { useNoteDraftStore } from "@/lib/store/noteStore";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onCancel?: () => void;
}

export default function NoteForm({ onCancel }: NoteFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const handleChange =
    (field: keyof CreateNoteInput) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = field === "tag" ? (e.target.value as NoteTag) : e.target.value;
      setDraft({ [field]: value } as Partial<CreateNoteInput>);
    };

  const { mutate, isPending, error } = useMutation({
    mutationFn: (payload: CreateNoteInput) => createNote(payload),
    onSuccess: (created) => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ["notes"], exact: false });
      router.replace(`/notes/filter/${encodeURIComponent(created.tag ?? "All")}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(draft);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else router.back();
  };

  const tagOptions = TAGS.filter((t): t is NoteTag => t !== "All");
  const titleOk = draft.title.trim().length >= 3 && draft.title.trim().length <= 50;
  const canSubmit = titleOk && !isPending;

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={draft.title}
          onChange={handleChange("title")}
          placeholder="Note title"
          required
          minLength={3}
          maxLength={50}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={draft.content ?? ""}
          onChange={handleChange("content")}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={handleChange("tag")}
          required
        >
          {tagOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className={css.error}>
          {error instanceof Error ? error.message : "Failed to create note"}
        </p>
      )}

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
          disabled={isPending}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={!canSubmit}>
          {isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
