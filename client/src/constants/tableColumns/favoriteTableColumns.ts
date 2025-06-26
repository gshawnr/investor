import { IColumn } from "../../types/tableTypes";

export const favoriteColumns: IColumn[] = [
  { field: "ticker", label: "Ticker" },
  { field: "industry", label: "Industry" },
  { field: "sector", label: "Sector" },
  { field: "targetPurchasePriceUSD", label: "Target Purchase USD" },
  { field: "targetSalesPriceUSD", label: "Target Sale USD" },
  { field: "createdAt", label: "Created" },
  { field: "updatedAt", label: "Last Updated" },
];
