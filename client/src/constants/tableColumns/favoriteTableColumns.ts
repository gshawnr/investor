import { IColumn } from "../../types/tableTypes";

export const favoriteColumns: IColumn[] = [
  { field: "ticker", label: "Ticker" },
  { field: "industry", label: "Industry" },
  { field: "sector", label: "Sector" },
  { field: "targetPurchasePriceUSD", label: "Target Purchase USD" },
  { field: "targetPurchaseDate", label: "Target Purchase Date" },
  { field: "targetSalesPriceUSD", label: "Target Sale USD" },
  { field: "targetSellDate", label: "Target Sell Date" },
  { field: "createdAt", label: "Created" },
  { field: "updatedAt", label: "Last Updated" },
];
