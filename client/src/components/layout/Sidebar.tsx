import { Link, useRoute } from "wouter";
import { 
  Home, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Wallet, 
  BarChart2,
  ShoppingBag,
  Utensils,
  Briefcase 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPKR } from "@/lib/utils/format";
import { useQuery } from "@tanstack/react-query";
import { type Transaction } from "@shared/schema";

export function Sidebar() {
  const [isHome] = useRoute("/");
  const [isIncome] = useRoute("/income");
  const [isExpenses] = useRoute("/expenses");
  const [isSavings] = useRoute("/savings");
  const [isExtraCash] = useRoute("/extra-cash");
  const [isReports] = useRoute("/reports");
  
  const { data: recentTransactions } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions/recent'],
  });

  return (
    <div className="hidden lg:block w-64 flex-shrink-0">
      {/* Navigation */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4">
        <div className="space-y-1">
          <Link href="/">
            <div className={cn(
              "w-full flex items-center space-x-2 rounded-lg p-3 font-medium cursor-pointer",
              isHome 
                ? "bg-primary bg-opacity-10 dark:bg-opacity-20 text-primary dark:text-purple-400" 
                : "hover:bg-neutral-100 dark:hover:bg-gray-800 text-neutral-dark dark:text-gray-200"
            )}>
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </div>
          </Link>
          
          <Link href="/income">
            <div className={cn(
              "w-full flex items-center space-x-2 rounded-lg p-3 font-medium cursor-pointer",
              isIncome 
                ? "bg-primary bg-opacity-10 dark:bg-opacity-20 text-primary dark:text-purple-400" 
                : "hover:bg-neutral-100 dark:hover:bg-gray-800 text-neutral-dark dark:text-gray-200"
            )}>
              <TrendingUp className="h-5 w-5" />
              <span>Income</span>
            </div>
          </Link>
          
          <Link href="/expenses">
            <div className={cn(
              "w-full flex items-center space-x-2 rounded-lg p-3 font-medium cursor-pointer",
              isExpenses 
                ? "bg-primary bg-opacity-10 dark:bg-opacity-20 text-primary dark:text-purple-400" 
                : "hover:bg-neutral-100 dark:hover:bg-gray-800 text-neutral-dark dark:text-gray-200"
            )}>
              <TrendingDown className="h-5 w-5" />
              <span>Expenses</span>
            </div>
          </Link>
          
          <Link href="/savings">
            <div className={cn(
              "w-full flex items-center space-x-2 rounded-lg p-3 font-medium cursor-pointer",
              isSavings 
                ? "bg-primary bg-opacity-10 dark:bg-opacity-20 text-primary dark:text-purple-400" 
                : "hover:bg-neutral-100 dark:hover:bg-gray-800 text-neutral-dark dark:text-gray-200"
            )}>
              <PiggyBank className="h-5 w-5" />
              <span>Savings</span>
            </div>
          </Link>
          
          <Link href="/extra-cash">
            <div className={cn(
              "w-full flex items-center space-x-2 rounded-lg p-3 font-medium cursor-pointer",
              isExtraCash 
                ? "bg-primary bg-opacity-10 dark:bg-opacity-20 text-primary dark:text-purple-400" 
                : "hover:bg-neutral-100 dark:hover:bg-gray-800 text-neutral-dark dark:text-gray-200"
            )}>
              <Wallet className="h-5 w-5" />
              <span>Extra Cash</span>
            </div>
          </Link>
          
          <Link href="/reports">
            <div className={cn(
              "w-full flex items-center space-x-2 rounded-lg p-3 font-medium cursor-pointer",
              isReports 
                ? "bg-primary bg-opacity-10 dark:bg-opacity-20 text-primary dark:text-purple-400" 
                : "hover:bg-neutral-100 dark:hover:bg-gray-800 text-neutral-dark dark:text-gray-200"
            )}>
              <BarChart2 className="h-5 w-5" />
              <span>Reports</span>
            </div>
          </Link>
        </div>
        
        {recentTransactions && recentTransactions.length > 0 && (
          <div className="mt-8">
            <h3 className="font-montserrat font-semibold text-neutral-dark dark:text-gray-300 mb-2 px-3">Recent Categories</h3>
            <div className="space-y-1">
              {recentTransactions.slice(0, 3).map((transaction) => {
                const isIncome = transaction.type === "income";
                const isExpense = transaction.type === "expense";
                let icon;
                
                if (transaction.categoryId === 1) {
                  icon = <Briefcase className="h-4 w-4 text-green-500" />;
                } else if (transaction.categoryId === 6) {
                  icon = <ShoppingBag className="h-4 w-4 text-blue-500" />;
                } else {
                  icon = <Utensils className="h-4 w-4 text-purple-500" />;
                }
                
                return (
                  <div 
                    key={transaction.id}
                    className="w-full flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-gray-800 text-neutral-dark dark:text-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-center">
                      <div className={cn(
                        "rounded-full p-1.5 mr-2",
                        isIncome ? "bg-green-100 dark:bg-green-900" : isExpense ? "bg-red-100 dark:bg-red-900" : "bg-blue-100 dark:bg-blue-900"
                      )}>
                        {icon}
                      </div>
                      <span>{transaction.description}</span>
                    </div>
                    <span className={cn(
                      "font-medium",
                      isIncome ? "text-success dark:text-green-400" : isExpense ? "text-error dark:text-red-400" : "text-info dark:text-blue-400"
                    )}>
                      {isIncome ? "+" : "-"}{formatPKR(Number(transaction.amount))}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* SavingsGoal will be included separately */}
    </div>
  );
}
