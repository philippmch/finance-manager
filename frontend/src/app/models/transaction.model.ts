export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Transaction {
  id?: number;
  description: string;
  amount: number;
  date: string; // ISO format date string
  category: string;
  type: TransactionType;
}
