import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Upload, PlusCircle, Wallet, CreditCard, ArrowDown, ArrowUp, Banknote, PiggyBank, Gift } from "lucide-react";
import { useTransactionModal } from "@/hooks/useTransactionModal";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { useTheme } from "@/providers/ThemeProvider";

export function AddTransactionModal() {
  const {
    transactionModalOpen,
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
    isAddingTransaction
  } = useTransactionModal();
  
  const [location] = useLocation();
  const { theme } = useTheme();
  
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });
  
  // Filter categories by transaction type
  const filteredCategories = categories?.filter(
    (category: any) => category.type === transactionType
  );
  
  // Get title and icon based on transaction type
  const getTransactionTypeInfo = () => {
    switch (transactionType) {
      case 'income':
        return { 
          title: 'Add Income', 
          description: 'Record a new source of income',
          icon: <ArrowDown className="h-5 w-5 text-green-500" />
        };
      case 'expense':
        return { 
          title: 'Add Expense', 
          description: 'Record a new expense',
          icon: <ArrowUp className="h-5 w-5 text-red-500" />
        };
      case 'saving':
        return { 
          title: 'Add to Savings', 
          description: 'Add money to your savings goal',
          icon: <PiggyBank className="h-5 w-5 text-blue-500" />
        };
      case 'extra':
        return { 
          title: 'Add Extra Cash', 
          description: 'Record additional money received',
          icon: <Gift className="h-5 w-5 text-amber-500" />
        };
      default:
        return { 
          title: 'Add Transaction', 
          description: 'Record a new financial transaction',
          icon: <Wallet className="h-5 w-5 text-primary" />
        };
    }
  };
  
  const typeInfo = getTransactionTypeInfo();
  
  return (
    <Dialog open={transactionModalOpen} onOpenChange={closeTransactionModal}>
      <DialogContent className="sm:max-w-md dark:bg-gray-900 dark:border-gray-800">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {typeInfo.icon}
            <DialogTitle className="font-montserrat font-bold text-xl text-neutral-dark dark:text-white">
              {typeInfo.title}
            </DialogTitle>
          </div>
          <DialogDescription className="dark:text-gray-400">
            {typeInfo.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-4">
          <div className="flex space-x-2 mb-4">
            <Button
              type="button"
              className={cn(
                "flex-1 rounded-lg py-2 font-medium",
                transactionType === 'income' 
                  ? "bg-primary text-white dark:bg-purple-600" 
                  : "bg-neutral-light text-neutral-dark dark:bg-gray-800 dark:text-gray-300"
              )}
              onClick={() => setTransactionType('income')}
            >
              <ArrowDown className="h-4 w-4 mr-1" />
              Income
            </Button>
            <Button
              type="button"
              className={cn(
                "flex-1 rounded-lg py-2 font-medium",
                transactionType === 'expense' 
                  ? "bg-primary text-white dark:bg-purple-600" 
                  : "bg-neutral-light text-neutral-dark dark:bg-gray-800 dark:text-gray-300"
              )}
              onClick={() => setTransactionType('expense')}
            >
              <ArrowUp className="h-4 w-4 mr-1" />
              Expense
            </Button>
            <Button
              type="button"
              className={cn(
                "flex-1 rounded-lg py-2 font-medium",
                transactionType === 'saving' 
                  ? "bg-primary text-white dark:bg-purple-600" 
                  : "bg-neutral-light text-neutral-dark dark:bg-gray-800 dark:text-gray-300"
              )}
              onClick={() => setTransactionType('saving')}
            >
              <PiggyBank className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button
              type="button"
              className={cn(
                "flex-1 rounded-lg py-2 font-medium",
                transactionType === 'extra' 
                  ? "bg-primary text-white dark:bg-purple-600" 
                  : "bg-neutral-light text-neutral-dark dark:bg-gray-800 dark:text-gray-300"
              )}
              onClick={() => setTransactionType('extra')}
            >
              <Gift className="h-4 w-4 mr-1" />
              Extra
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (PKR)</Label>
              <Input 
                type="number" 
                placeholder="0.00" 
                className="w-full bg-neutral-light dark:bg-gray-800 dark:text-white rounded-lg p-3 border-0 focus:ring-2 focus:ring-primary dark:focus:ring-purple-500 focus:outline-none text-xl font-montserrat font-bold text-center"
                value={amount || ''}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
              />
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</Label>
              <Select
                value={categoryId?.toString() || ''}
                onValueChange={(value) => setCategoryId(parseInt(value))}
              >
                <SelectTrigger className="w-full bg-neutral-light dark:bg-gray-800 dark:text-white rounded-lg p-3 border-0 focus:ring-2 focus:ring-primary dark:focus:ring-purple-500 focus:outline-none">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {filteredCategories?.map((category: any) => (
                    <SelectItem 
                      key={category.id} 
                      value={category.id.toString()}
                      className="dark:text-gray-300 dark:focus:bg-gray-700"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</Label>
              <Input 
                type="date" 
                className="w-full bg-neutral-light dark:bg-gray-800 dark:text-white rounded-lg p-3 border-0 focus:ring-2 focus:ring-primary dark:focus:ring-purple-500 focus:outline-none"
                value={format(date, 'yyyy-MM-dd')}
                onChange={(e) => setDate(new Date(e.target.value))}
              />
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</Label>
              <Textarea 
                placeholder="Add note" 
                className="w-full bg-neutral-light dark:bg-gray-800 dark:text-white rounded-lg p-3 border-0 focus:ring-2 focus:ring-primary dark:focus:ring-purple-500 focus:outline-none resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attachment (Optional)</Label>
              <div className="w-full bg-neutral-light dark:bg-gray-800 rounded-lg p-3 border-2 border-dashed border-gray-300 dark:border-gray-700 text-center">
                <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload or drag and drop</p>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setAttachment(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={closeTransactionModal}
            disabled={isAddingTransaction}
            className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button 
            className={cn(
              "w-full rounded-lg py-3 font-medium text-white",
              transactionType === 'income' ? "bg-green-600 hover:bg-green-700" :
              transactionType === 'expense' ? "bg-red-600 hover:bg-red-700" :
              transactionType === 'saving' ? "bg-blue-600 hover:bg-blue-700" :
              transactionType === 'extra' ? "bg-amber-600 hover:bg-amber-700" :
              "bg-primary hover:bg-primary-dark"
            )}
            onClick={handleSubmit}
            disabled={isAddingTransaction}
          >
            {isAddingTransaction ? "Saving..." : `Save ${typeInfo.title.split(' ')[1]}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
