import { IColumn } from "../../types/tableTypes";

export const companyColumns: IColumn[] = [
  { field: "companyName", label: "Company" },
  { field: "ticker", label: "Ticker" },
  { field: "industry", label: "Industry" },
  { field: "sector", label: "Sector" },
  { field: "beta", label: "Beta" },
  { field: "raw.ceo", label: "CEO" },
  { field: "raw.description", label: "Summary" },
  { field: "raw.exchangeShortName", label: "Exchange" },
];
