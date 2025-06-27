import { TablePagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import { apiClient } from "../apis/apiClient";
import {
  metricColumns,
  summaryColumns,
} from "../constants/tableColumns/summaryMetricTableColumns";
import SearchBar from "./SearchBar";
import { TableDisplay } from "./TableDisplay";

import styles from "./SummaryMetricTables.module.css";

export default function SummaryMetricTables() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [metrics, setMetrics] = useState([]);
  const [summaries, setSummaries] = useState([]);
  // const [openFavoritesModal, setFavoritesModal] = useState(false);
  const [error, setError] = useState({});

  const SEARCH_FIELDS = "ticker,ticker_year,industry,sector";

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(0);
      setDebouncedSearch(search);
      return;
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    try {
      const fetchData = async () => {
        // page incremented to satisfy MUI and Backend structures
        const url = `${
          import.meta.env.VITE_BASE_URL
        }/combined?pageSize=${rowsPerPage}&page=${
          page + 1
        }&search=${debouncedSearch}&fields=${SEARCH_FIELDS}`;

        const data: any = await apiClient(url, {});

        const { keys, metrics, summaries, totalCount } = data;
        setMetrics(metrics);
        setSummaries(summaries);
        setCount(totalCount);
      };
      fetchData();
    } catch (err) {
      console.log(err);
      setError(err as Error);
    }
  }, [page, rowsPerPage, debouncedSearch, error]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const validateAndSetSearch = (value: string) => {
    // TODO add error handling to update user on invalid input
    if (value.length > 100) {
      return;
    }
    // Only allow alphanumeric, whitespace, dot, comma, and dash
    if (!/^[\w\s.,-]*$/.test(value)) {
      return;
    }

    setSearch(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableAndSearchContainer}>
        <div className={styles.searchContainer}>
          <SearchBar onSearch={validateAndSetSearch} />
        </div>

        <div className={styles.tablesContainer}>
          <div className={styles.top_table}>
            <TableDisplay data={summaries} columns={summaryColumns} />
          </div>

          <div className={styles.bottom_table}>
            <TableDisplay data={metrics} columns={metricColumns} />
          </div>
        </div>

        <TablePagination
          component="div"
          count={count}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
}
