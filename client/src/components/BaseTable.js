import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";

import styles from "./BaseTable.module.css";

// Sample column structure
const COLUMNS = [
  { id: "city", label: "City", minWidth: 50 },
  { id: "state", label: "State", minWidth: 50 },
  { id: "country", label: "Country", minWidth: 50 },
];

const ROWS = [
  { country: "Canada", city: "Toronto", state: "ON" },
  { country: "United States", city: "Boston", state: "MA" },
  { country: "Mexico", city: "Mexico City", state: "GJ" },
];

export default function BaseTable({
  columns = COLUMNS,
  rows = ROWS,
  rowCount = 3,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || "left"}
                  style={{ textAlign: "center", minWidth: col.minWidth }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, idx) => (
              <TableRow hover key={idx}>
                {columns.map((col) => (
                  <TableCell key={col.id} align={col.align || "left"}>
                    {row[col.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={rowCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );
}
