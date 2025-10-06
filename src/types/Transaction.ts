export interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: 'expense' | 'income' | 'estimated_income' | 'estimated_expense';
  date: Date;
  isConverted?: boolean; // Only for estimated_income that became actual income
}

export type TransactionType = Transaction['type'];
export type FilterType = TransactionType | 'all';