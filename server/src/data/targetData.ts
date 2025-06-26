// These requirments define "good" companyies not "good" value.
export const validTargetRequirements = {
  debtToEquity: { lte: 3.5 },
  excludedIndustries: ["gold", "asset management", "capital markets "],
  includedCurrencies: ["USD", "CAD", "TWD", "GBP", "EUR", "JPY"],
  grossMargin: { gte: 0.2 },
  netMargin: { gte: 0 },
  roe: { gte: 0.08 },
  currentRatio: { gte: 1 },
};
