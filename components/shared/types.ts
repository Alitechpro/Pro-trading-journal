// app/components/shared/types.ts

export interface Trade {
  id: string;
  symbol: string;
  date: string;
  capitalRisked: number;
  quantity: number;
  entry: number;
  exit: number;
  pnlPercent: number;
  pnlDollar: number;
  fees: number;
}

export const FEE_RATE = 0.001;
