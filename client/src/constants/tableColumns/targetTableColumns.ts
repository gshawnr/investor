import { IColumn } from "../../types/tableTypes";

export const targetColumns: IColumn[] = [
  { field: "ticker", label: "Ticker" },
  { field: "ticker_year", label: "Ticker_Year" },
  { field: "dcfValueUSD", label: "DCF" },
  { field: "fiscalYear", label: "Fiscal Year" },
  { field: "industry", label: "Industry" },
  { field: "marketPriceUSD", label: "Current Price USD" },
  { field: "targetPriceUSD", label: "Target Price USD" },
  { field: "potentialReturn", label: "Potential Return" },
];
