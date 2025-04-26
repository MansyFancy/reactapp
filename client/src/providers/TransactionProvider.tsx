import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Transaction, type InsertTransaction, type SavingsGoal, type Category } from "@shared/schema";
import { useLocation } from "wouter";

type TransactionContextType = {
  transactionModalOpen: boolean;
  openTransactionModal: () => void;
  closeTransactionModal: () => void;
  transactionType: 'income' | 'expense' | 'saving' | 'extra';
  setTransactionType: (type: 'income' | 'expense' | 'saving' | 'extra') => void;
  addTransaction: (transaction: InsertTransaction) => Promise<void>;
  isAddingTransaction: boolean;
};

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense' | 'saving' | 'extra'>('income');
  const [location] = useLocation();
  const { toast } = useToast();
  
  // Set transaction type based on current page
  useEffect(() => {
    switch (location) {
      case '/income':
        setTransactionType('income');
        break;
      case '/expenses':
        setTransactionType('expense');
        break;
      case '/savings':
        setTransactionType('saving');
        break;
      case '/extra-cash':
        setTransactionType('extra');
        break;
      default:
        // Keep current type on other pages
        break;
    }
  }, [location]);

  const { mutateAsync: addTransactionMutation, isPending: isAddingTransaction } = useMutation({
    mutationFn: async (transaction: InsertTransaction) => {
      const res = await apiRequest("POST", "/api/transactions", transaction);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Transaction added",
        description: "Your transaction has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/summary'] });
      closeTransactionModal();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add transaction: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const openTransactionModal = () => setTransactionModalOpen(true);
  const closeTransactionModal = () => setTransactionModalOpen(false);

  const addTransaction = async (transaction: InsertTransaction) => {
    await addTransactionMutation(transaction);
  };

  return (
    <TransactionContext.Provider
      value={{
        transactionModalOpen,
        openTransactionModal,
        closeTransactionModal,
        transactionType,
        setTransactionType,
        addTransaction,
        isAddingTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactionContext() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransactionContext must be used within a TransactionProvider");
  }
  return context;
}
