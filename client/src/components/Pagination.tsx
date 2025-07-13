import React from "react";
import { TablePagination } from "@mui/material";

type pagintationProps = {
  component: React.ElementType;
  count: number;
  page: number;
  onPageChange: (first: any, page: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (arg: any) => void;
};

function Pagination({
  component,
  count,
  page,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
}: pagintationProps) {
  return (
    <TablePagination
      component={component}
      count={count}
      page={page}
      onPageChange={onPageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
      sx={{ height: "50px" }}
    />
  );
}

export default Pagination;
