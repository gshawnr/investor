import apiClient from "./finApiClient";

export const getBalanceSheets = async (params: any): Promise<any> => {
  const { ticker, period, limit } = params;

  const limitNum = parseInt(limit);
  const fetch = constructFetch(
    "balance-sheet-statement",
    ticker,
    period,
    limitNum
  );

  const response = await apiClient.get(fetch);
  return response.data;
};

export const getIncomes = async (params: any): Promise<any> => {
  const { ticker, period, limit } = params;

  const limitNum = parseInt(limit);
  const fetch = constructFetch("income-statement", ticker, period, limitNum);

  const response = await apiClient.get(fetch);
  return response.data;
};

export const getCashflows = async (params: any): Promise<any> => {
  const { ticker, period = "annual", limit = "10" } = params;

  const limitNum = parseInt(limit);
  const fetch = constructFetch("cash-flow-statement", ticker, period, limitNum);

  const response = await apiClient.get(fetch);
  return response.data;
};

export const getProfile = async (params: any): Promise<any> => {
  const { ticker } = params;

  const fetch = constructFetch("profile", ticker);

  const response = await apiClient.get(fetch);
  return response.data;
};

const constructFetch = (
  type: string,
  ticker: string,
  period?: string,
  limit?: number
) => {
  let base = `${type}/${ticker}?apikey=${process.env.FIN_API_KEY}`;
  if (period) base = base + `&period=${period}`;
  if (limit) base = base + `&limit=${limit}`;

  console.log("fetching", type, ticker, period, limit);
  return base;
};
