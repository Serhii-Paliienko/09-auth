export interface Note {
  id: string;
  title: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
  tag: NoteTag;
  userId: string;
}

export type NoteTag =
  | "Work"
  | "Personal"
  | "Meeting"
  | "Shopping"
  | "Ideas"
  | "Travel"
  | "Finance"
  | "Health"
  | "Important"
  | "Todo";

export const TAGS: Array<"All" | NoteTag> = [
  "All",
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
  "Ideas",
  "Travel",
  "Finance",
  "Health",
  "Important",
];
