import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Transaction, TransactionType } from "@/lib/types";

export function useTransactions() {
  const queryClient = useQueryClient();

  const transactionsQuery = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
  });

  const categoriesQuery = useQuery({
    queryKey: ['/api/categories'],
  });

  const summaryQuery = useQuery({
    queryKey: ['/api/summary'],
  });

  const addTransactionMutation = useMutation({
    mutationFn: async (transaction: Omit<Transaction, 'id' | 'userId'>) => {
      const res = await apiRequest('POST', '/api/transactions', transaction);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/summary'] });
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: async ({ id, ...transaction }: Partial<Transaction> & { id: number }) => {
      const res = await apiRequest('PUT', `/api/transactions/${id}`, transaction);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/summary'] });
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/transactions/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/summary'] });
    },
  });

  const getTransactionsByType = (type: TransactionType) => {
    if (!transactionsQuery.data) return [];
    return transactionsQuery.data.filter(transaction => transaction.type === type);
  };

  return {
    transactions: transactionsQuery.data || [],
    categories: categoriesQuery.data || [],
    summary: summaryQuery.data,
    isLoading: transactionsQuery.isLoading || categoriesQuery.isLoading || summaryQuery.isLoading,
    addTransaction: addTransactionMutation.mutate,
    updateTransaction: updateTransactionMutation.mutate,
    deleteTransaction: deleteTransactionMutation.mutate,
    getTransactionsByType,
  };
}

export function useSavingsGoals() {
  const queryClient = useQueryClient();

  const savingsGoalsQuery = useQuery({
    queryKey: ['/api/savings-goals'],
  });

  const addSavingsGoalMutation = useMutation({
    mutationFn: async (goal: Omit<any, 'id' | 'userId'>) => {
      const res = await apiRequest('POST', '/api/savings-goals', goal);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/savings-goals'] });
    },
  });

  const updateSavingsGoalMutation = useMutation({
    mutationFn: async ({ id, ...goal }: Partial<any> & { id: number }) => {
      const res = await apiRequest('PUT', `/api/savings-goals/${id}`, goal);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/savings-goals'] });
    },
  });

  const deleteSavingsGoalMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/savings-goals/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/savings-goals'] });
    },
  });

  return {
    savingsGoals: savingsGoalsQuery.data || [],
    isLoading: savingsGoalsQuery.isLoading,
    addSavingsGoal: addSavingsGoalMutation.mutate,
    updateSavingsGoal: updateSavingsGoalMutation.mutate,
    deleteSavingsGoal: deleteSavingsGoalMutation.mutate,
  };
}
