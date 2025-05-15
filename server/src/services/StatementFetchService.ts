import { getBalanceSheets, getIncomes } from "../apis/finApiService";
import BalanceSheetService from "./BalanceSheetService";
import IncomeService from "./IncomeService";

class StatementFetchService {
  async fetchBalanceSheets(data: any) {
    const { ticker, period, limit } = data;
    const balanceSheets = await getBalanceSheets({
      ticker,
      period,
      limit,
    });

    let successCount = 0;
    let errorCount = 0;
    const totalCount = balanceSheets.length;
    for (const item of balanceSheets) {
      try {
        const { symbol: ticker, date: fiscalYear } = item;

        await BalanceSheetService.createBalanceSheet({
          ticker,
          fiscalYear,
          raw: item,
        });

        successCount++;
      } catch (err) {
        console.error(`Error saving this balance sheets ${item}`, err);
        errorCount++;
      }
    }

    return {
      successCount,
      errorCount,
      totalCount,
    };
  }

  async fetchIncomeStatements(data: any) {
    const { ticker, period, limit } = data;
    const incomes = await getIncomes({
      ticker,
      period,
      limit,
    });

    let successCount = 0;
    let errorCount = 0;
    const totalCount = incomes.length;
    for (const item of incomes) {
      try {
        const { symbol: ticker, date: fiscalYear } = item;

        await IncomeService.createIncome({
          ticker,
          fiscalYear,
          raw: item,
        });

        successCount++;
      } catch (err) {
        console.error(`Error saving this income statement ${item}`, err);
        errorCount++;
      }
    }

    return {
      successCount,
      errorCount,
      totalCount,
    };
  }
}

export default new StatementFetchService();
