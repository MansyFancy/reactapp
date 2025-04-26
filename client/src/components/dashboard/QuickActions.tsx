import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  MinusCircle, 
  PiggyBank, 
  Copy, 
  BarChart2 
} from "lucide-react";
import { useTransactionContext } from "@/providers/TransactionProvider";
import { useLocation } from "wouter";

export function QuickActions() {
  const { openTransactionModal, setTransactionType } = useTransactionContext();
  const [, setLocation] = useLocation();
  
  const handleAddIncome = () => {
    setTransactionType('income');
    openTransactionModal();
  };
  
  const handleAddExpense = () => {
    setTransactionType('expense');
    openTransactionModal();
  };
  
  const handleAddSavings = () => {
    setTransactionType('saving');
    openTransactionModal();
  };
  
  const handleCreateBudget = () => {
    // Navigate to budget page (placeholder)
    setLocation('/reports');
  };
  
  const handleViewReports = () => {
    setLocation('/reports');
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-montserrat font-semibold text-neutral-dark">Quick Actions</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="ghost"
            className="bg-primary bg-opacity-10 hover:bg-opacity-20 rounded-lg p-3 flex flex-col items-center justify-center transition-all h-auto"
            onClick={handleAddIncome}
          >
            <div className="bg-primary bg-opacity-20 rounded-full p-2 mb-2">
              <PlusCircle className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary">Add Income</span>
          </Button>
          
          <Button
            variant="ghost"
            className="bg-red-500 bg-opacity-10 hover:bg-opacity-20 rounded-lg p-3 flex flex-col items-center justify-center transition-all h-auto"
            onClick={handleAddExpense}
          >
            <div className="bg-red-500 bg-opacity-20 rounded-full p-2 mb-2">
              <MinusCircle className="h-5 w-5 text-red-500" />
            </div>
            <span className="text-sm font-medium text-red-500">Add Expense</span>
          </Button>
          
          <Button
            variant="ghost"
            className="bg-blue-500 bg-opacity-10 hover:bg-opacity-20 rounded-lg p-3 flex flex-col items-center justify-center transition-all h-auto"
            onClick={handleAddSavings}
          >
            <div className="bg-blue-500 bg-opacity-20 rounded-full p-2 mb-2">
              <PiggyBank className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-blue-500">Add to Savings</span>
          </Button>
          
          <Button
            variant="ghost"
            className="bg-purple-500 bg-opacity-10 hover:bg-opacity-20 rounded-lg p-3 flex flex-col items-center justify-center transition-all h-auto"
            onClick={handleCreateBudget}
          >
            <div className="bg-purple-500 bg-opacity-20 rounded-full p-2 mb-2">
              <Copy className="h-5 w-5 text-purple-500" />
            </div>
            <span className="text-sm font-medium text-purple-500">Create Budget</span>
          </Button>
          
          <Button
            variant="ghost"
            className="bg-green-500 bg-opacity-10 hover:bg-opacity-20 rounded-lg p-3 flex flex-col items-center justify-center transition-all h-auto col-span-2"
            onClick={handleViewReports}
          >
            <div className="bg-green-500 bg-opacity-20 rounded-full p-2 mb-2">
              <BarChart2 className="h-5 w-5 text-green-500" />
            </div>
            <span className="text-sm font-medium text-green-500">View Detailed Reports</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
