"use client";

import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ pageCount, currentPage, onPageChange }: PaginationProps) => {
  return (
    <ReactPaginate
      forcePage={currentPage - 1}
      pageCount={pageCount}
      onPageChange={(e) => onPageChange(e.selected + 1)}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="&raquo;"
      previousLabel="&laquo;"
      breakLabel="…"
      previousAriaLabel="Previous page"
      nextAriaLabel="Next page"
      renderOnZeroPageCount={null}
    />
  );
};

export default Pagination;
