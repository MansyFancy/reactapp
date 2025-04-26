import { useState } from "react";
import { useTransactionContext } from "@/providers/TransactionProvider";
import { InsertTransaction } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useTransactionModal() {
  const { 
    transactionModalOpen, 
    openTransactionModal, 
    closeTransactionModal, 
    transactionType,
    setTransactionType,
    addTransaction,
    isAddingTransaction 
  } = useTransactionContext();
  
  const { toast } = useToast();
  
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [attachment, setAttachment] = useState<string | undefined>(undefined);
  
  const handleSubmit = async () => {
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    
    if (!categoryId) {
      toast({
        title: "Category required",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }
    
    const transaction: InsertTransaction = {
      amount,
      type: transactionType,
      categoryId,
      description: description || undefined,
      date,
      attachment,
    };
    
    await addTransaction(transaction);
    resetForm();
  };
  
  const resetForm = () => {
    setAmount(undefined);
    setCategoryId(undefined);
    setDescription('');
    setDate(new Date());
    setAttachment(undefined);
  };
  
  return {
    transactionModalOpen,
    openTransactionModal, 
    closeTransactionModal,
    transactionType,
    setTransactionType,
    amount,
    setAmount,
    categoryId,
    setCategoryId,
    description,
    setDescription,
    date,
    setDate,
    attachment,
    setAttachment,
    handleSubmit,
    isAddingTransaction,
    resetForm
  };
}
