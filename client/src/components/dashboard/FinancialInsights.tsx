import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { type Transaction, type SavingsGoal } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPKR, calculatePercentage } from "@/lib/utils/format";

export function FinancialInsights() {
  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
  });
  
  const { data: savingsGoals, isLoading: savingsLoading } = useQuery<SavingsGoal[]>({
    queryKey: ['/api/savings-goals'],
  });
  
  const isLoading = transactionsLoading || savingsLoading;
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-montserrat font-semibold text-neutral-dark">Financial Insights</h3>
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate insights
  let incomeHigherThanUsual = false;
  let shoppingBudgetAlert = false;
  let savingsGoalProgress = false;
  
  if (transactions && transactions.length > 0) {
    // Check if income is higher than usual
    const incomeTransactions = transactions.filter(t => t.type === "income");
    const currentMonth = new Date().getMonth();
    const currentMonthIncome = incomeTransactions
      .filter(t => new Date(t.date).getMonth() === currentMonth)
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
    
    const previousMonthsIncome = incomeTransactions
      .filter(t => new Date(t.date).getMonth() !== currentMonth)
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
    
    const averageMonthlyIncome = previousMonthsIncome / 3; // Assume 3 months of data
    
    incomeHigherThanUsual = currentMonthIncome > averageMonthlyIncome * 1.1; // 10% higher
    
    // Check shopping budget
    const shoppingTransactions = transactions.filter(t => 
      t.type === "expense" && t.categoryId === 6 // Assuming 6 is shopping category ID
    );
    
    const currentMonthShopping = shoppingTransactions
      .filter(t => new Date(t.date).getMonth() === currentMonth)
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
    
    shoppingBudgetAlert = currentMonthShopping > 5000; // Assuming 5000 is budget threshold
  }
  
  // Check savings goal progress
  if (savingsGoals && savingsGoals.length > 0) {
    const goal = savingsGoals[0];
    const progress = calculatePercentage(
      parseFloat(goal.current.toString()), 
      parseFloat(goal.target.toString())
    );
    savingsGoalProgress = progress > 60; // More than 60% complete
  }
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-montserrat font-semibold text-neutral-dark">Financial Insights</h3>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="space-y-4">
          {incomeHigherThanUsual && (
            <div className="bg-blue-50 rounded-lg p-3 flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-3 mt-1">
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <h4 className="font-medium text-neutral-dark">Income is higher than usual</h4>
                <p className="text-sm text-gray-600 mt-1">Your income this month is 12% higher than your average monthly income.</p>
              </div>
            </div>
          )}
          
          {shoppingBudgetAlert && (
            <div className="bg-yellow-50 rounded-lg p-3 flex items-start">
              <div className="bg-yellow-100 rounded-full p-2 mr-3 mt-1">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <h4 className="font-medium text-neutral-dark">Spending Alert</h4>
                <p className="text-sm text-gray-600 mt-1">You've spent 85% of your shopping budget for this month.</p>
              </div>
            </div>
          )}
          
          {savingsGoalProgress && (
            <div className="bg-green-50 rounded-lg p-3 flex items-start">
              <div className="bg-green-100 rounded-full p-2 mr-3 mt-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <h4 className="font-medium text-neutral-dark">Savings Goal Progress</h4>
                <p className="text-sm text-gray-600 mt-1">You're on track to reach your "New Phone" savings goal by August.</p>
              </div>
            </div>
          )}
          
          {!incomeHigherThanUsual && !shoppingBudgetAlert && !savingsGoalProgress && (
            <div className="bg-gray-50 rounded-lg p-3 flex items-start">
              <div className="bg-gray-100 rounded-full p-2 mr-3 mt-1">
                <CheckCircle className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <h4 className="font-medium text-neutral-dark">All is well</h4>
                <p className="text-sm text-gray-600 mt-1">You're staying within budget and on track with your financial goals.</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
