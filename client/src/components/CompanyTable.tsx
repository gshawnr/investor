import React, { useState, useEffect } from "react";
import { TablePagination } from "@mui/material";
import { TableDisplay, IColumn } from "./TableDisplay";
import { apiClient } from "../apis/apiClient";
import SearchBar from "./SearchBar";

import styles from "./CompanyTable.module.css";

export default function CompanyTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [count, setCount] = useState(8);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState({});

  const SEARCH_FIELDS = "ticker,companyName,industry,sector";

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
      return;
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    try {
      const fetchData = async () => {
        // page incremented to satisfy MUI and Backend structures
        const url = `${
          process.env.REACT_APP_BASE_URL
        }/profiles/paginated?pageSize=${rowsPerPage}&page=${
          page + 1
        }&search=${debouncedSearch}&fields=${SEARCH_FIELDS}`;
        const data: any = await apiClient(url, {});

        const { profiles, totalCount } = data;
        setCompanies(profiles);
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
      <div className={styles.searchContainer}>
        <SearchBar onSearch={validateAndSetSearch} />
      </div>
      <div className={styles.table}>
        <TableDisplay data={companies} columns={companyColumns} />
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
  );
}

const companyColumns: IColumn[] = [
  { field: "companyName", label: "Company" },
  { field: "ticker", label: "Ticker" },
  { field: "industry", label: "Industry" },
  { field: "sector", label: "Sector" },
  { field: "beta", label: "Beta" },
  { field: "raw.ceo", label: "CEO" },
  { field: "raw.description", label: "Summary" },
  { field: "raw.exchangeShortName", label: "Exchange" },
];
