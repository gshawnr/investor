export const validTargetRequirements = {
  debtToEquity: { lte: 2 },
  excludedIndustries: ["gold", "asset management", "capital markets "],
  includedCurrencies: ["USD", "CAD", "TWD", "GBP", "EUR", "JPY"],
  grossMargin: { gte: 0.3 },
  netMargin: { gte: 0.07 },
  roe: { gte: 0.08 },
  currentRatio: { gte: 1.15 },
};
