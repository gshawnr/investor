import apiClient from "./finApiClient";

export const getBalanceSheets = async (params: any): Promise<any> => {
  const { symbol, period = "annual", limit = "10" } = params;

  const limitNum = parseInt(limit);
  const fetch = constructFetch(
    "balance-sheet-statement",
    symbol,
    period,
    limitNum
  );

  const response = await apiClient.get(fetch);
  return response.data;
};

export const getIncomes = async (params: any): Promise<any> => {
  const { symbol, period = "annual", limit = "10" } = params;
  const limitNum = parseInt(limit);

  const fetch = constructFetch("income-statement", symbol, period, limitNum);

  const response = await apiClient.get(fetch);
  return response.data;
};

export const getCashflows = async (params: any): Promise<any> => {
  const { symbol, period = "annual", limit = "10" } = params;
  const limitNum = parseInt(limit); // TODO may be unnecessary

  const fetch = constructFetch("cash-flow-statement", symbol, period, limitNum);

  const response = await apiClient.get(fetch);
  return response.data;
};

export const getProfile = async (params: any): Promise<any> => {
  const { symbol } = params;

  const fetch = constructFetch("profile", symbol);

  const response = await apiClient.get(fetch);
  return response.data;
};

const constructFetch = (
  type: string,
  symbol: string,
  period?: string,
  limit?: number
) => {
  let base = `${type}/${symbol}?apikey=${process.env.FIN_API_KEY}`;
  if (period) base = base + `?period=${period}`;
  if (limit) base = base + `?limit=${period}`;

  return base;
};
