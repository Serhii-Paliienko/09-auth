"use client";

import type { ChangeEvent } from "react";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

const SearchBox = ({ value, onChange, placeholder }: SearchBoxProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    onChange(e.target.value);

  return (
    <input
      className={css.input}
      type="text"
      placeholder={placeholder ?? "Search notes..."}
      value={value}
      onChange={handleChange}
      aria-label="Search notes"
      autoComplete="off"
      enterKeyHint="search"
    />
  );
};

export default SearchBox;
