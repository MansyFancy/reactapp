export interface Transaction {
  id: number;
  amount: number;
  categoryId: number;
  description?: string;
  date: string;
  type: TransactionType;
  userId: number;
}

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export interface SavingsGoal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  userId: number;
  icon: string;
  color: string;
}

export interface TransactionWithCategory extends Transaction {
  category: Category;
}

export type TransactionType = 'income' | 'expense' | 'savings' | 'extra';

export interface FinancialSummary {
  balance: number;
  income: number;
  expense: number;
  savings: number;
  extraCash: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderWidth?: number;
    borderRadius?: number;
    borderColor?: string[];
  }[];
}

export interface ExpenseCategoryData {
  name: string;
  percentage: number;
  color: string;
}
