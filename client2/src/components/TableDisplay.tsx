import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
} from "@mui/material";
import { IColumn } from "../types/tableTypes";

import styles from "./TableDisplay.module.css";

interface TableDisplayProps {
  data: { ticker_year: string; [keyof: string]: any }[];
  columns: IColumn[];
}

export function TableDisplay({ data, columns }: TableDisplayProps) {
  function getValueByPath(obj: any, path: string) {
    return path.split(".").reduce((acc, key) => {
      if (acc && typeof acc === "object" && key in acc) {
        return acc[key];
      }
      return undefined;
    }, obj);
  }

  return (
    <TableContainer component={Paper} className={styles.tableContainer}>
      <Table size="small" className={styles.table}>
        <TableHead>
          <TableRow className={styles.tableHeader}>
            {columns.map((col) => (
              <TableCell
                key={col.field}
                className={styles.tableCell}
                sx={{ color: "white", fontSize: "16px", fontWeight: "800" }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.ticker_year}
              className={`${styles.tableRow} ${styles.striped}`}
            >
              {columns.map((col) => {
                const value = getValueByPath(row, col.field) ?? "n/a";
                return (
                  <TableCell
                    key={String(col.field)}
                    className={styles.tableCell}
                  >
                    <Tooltip title={String(value)} placement="top" arrow>
                      <span className={styles.cellContent}>{value}</span>
                    </Tooltip>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
