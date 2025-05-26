import { Document } from "mongoose";

interface IPrice extends Document {
  ticker: string;
  calendarYear: string; // Format: 'yyyy-mm-dd'
  ticker_year: string; // Unique identifier combining ticker and fiscal year
}
