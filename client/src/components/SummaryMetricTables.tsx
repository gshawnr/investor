import React, { useState, useEffect } from "react";
import { TablePagination } from "@mui/material";
import { TableDisplay, IColumn } from "./TableDisplay";
import { apiClient } from "../apis/apiClient";
import SearchBar from "./SearchBar";

import styles from "./SummaryMetricTables.module.css";
import { clear } from "console";

export default function SummaryMetricTables() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(8);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [metrics, setMetrics] = useState([]);
  const [summaries, setSummaries] = useState([]);
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
          process.env.REACT_APP_BASE_URL
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
      <div className={styles.tables}>
        <div className={styles.searchContainer}>
          <SearchBar onSearch={validateAndSetSearch} />
        </div>

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
  );
}

const metricColumns: IColumn[] = [
  { field: "ticker", label: "Ticker" },
  { field: "ticker_year", label: "Ticker_Year" },
  { field: "fiscalYear", label: "Year" },
  { field: "industry", label: "Industry" },
  { field: "sector", label: "Sector" },
  { field: "performanceData.returnOnEquity", label: "ROE" },
  { field: "performanceData.salesToEquity", label: "Sales / Equity" },
  { field: "profitabilityData.grossMargin", label: "Gross Margin" },
  { field: "profitabilityData.netMargin", label: "Net Margin" },
  { field: "stabilityData.debtToEquity", label: "DTE" },
  { field: "stabilityData.debtToEbitda", label: "Debt / EBITDA" },
  { field: "stabilityData.currentRatio", label: "CR" },
  { field: "avgStockPrice", label: "Avg Price" },
  { field: "valueData.dcfValuePerShare", label: "DCF" },
  { field: "valueData.dcfToAvgPrice", label: "DCF / Avg Price" },
  { field: "valueData.priceToEarnings", label: "Price / Earnings" },
  { field: "valueData.earningsYield", label: "Earnings Yield" },
  { field: "valueData.priceToSales", label: "Price / Sales" },
];

const summaryColumns: IColumn[] = [
  { field: "ticker", label: "Ticker" },
  { field: "ticker_year", label: "Ticker_Year" },
  { field: "fiscalYear", label: "Year" },
  { field: "industry", label: "Industry" },
  { field: "beta", label: "Beta" },
  { field: "currency", label: "Currency" },
  { field: "assets", label: "Assets" },
  { field: "currentAssets", label: "Current Assets" },
  { field: "liabilities", label: "Liabilities" },
  { field: "currentLiabilities", label: "Current Liabilities" },
  { field: "longTermDebt", label: "LTD" },
  { field: "totalDebt", label: "Total Debt" },
  { field: "depreciationAndAmortization", label: "Depr & Amort" },
  { field: "capEx", label: "CapEx" },
  { field: "ebitda", label: "EBITDA" },
  { field: "equity", label: "Equity" },
  { field: "revenue", label: "Revenue" },
  { field: "grossProfit", label: "Gross Profit" },
  { field: "operatingIncome", label: "Operating Income" },
  { field: "netIncome", label: "Net Income" },
  { field: "eps", label: "EPS" },
  { field: "epsDiluted", label: "EPS Diluted" },
];
