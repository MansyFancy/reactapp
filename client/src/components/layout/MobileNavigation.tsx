import { Link, useLocation } from "wouter";
import { Home, BarChart2, PlusCircle, PiggyBank, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransactionContext } from "@/providers/TransactionProvider";
import { useTheme } from "@/providers/ThemeProvider";

export function MobileNavigation() {
  const [location] = useLocation();
  const { openTransactionModal } = useTransactionContext();
  const { theme } = useTheme();
  
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-10 border-t border-gray-200 dark:border-gray-800">
      <div className="flex justify-around py-2">
        <Link href="/">
          <div className="flex flex-col items-center p-2 text-neutral-dark dark:text-gray-300 cursor-pointer">
            <Home className={cn(
              "h-6 w-6",
              location === "/" ? "text-primary dark:text-purple-400" : "text-neutral-dark dark:text-gray-300"
            )} />
            <span className={cn(
              "text-xs mt-1 font-medium",
              location === "/" ? "text-primary dark:text-purple-400" : "text-neutral-dark dark:text-gray-300"
            )}>Home</span>
          </div>
        </Link>
        
        <Link href="/reports">
          <div className="flex flex-col items-center p-2 text-neutral-dark dark:text-gray-300 cursor-pointer">
            <BarChart2 className={cn(
              "h-6 w-6",
              location === "/reports" ? "text-primary dark:text-purple-400" : "text-neutral-dark dark:text-gray-300"
            )} />
            <span className={cn(
              "text-xs mt-1 font-medium",
              location === "/reports" ? "text-primary dark:text-purple-400" : "text-neutral-dark dark:text-gray-300"
            )}>Reports</span>
          </div>
        </Link>
        
        <button 
          className="flex flex-col items-center p-2 text-neutral-dark dark:text-gray-300"
          onClick={openTransactionModal}
        >
          <PlusCircle className="h-8 w-8 text-primary dark:text-purple-400 -mt-4" />
          <span className="text-xs mt-1 font-medium">Add</span>
        </button>
        
        <Link href="/savings">
          <div className="flex flex-col items-center p-2 text-neutral-dark dark:text-gray-300 cursor-pointer">
            <PiggyBank className={cn(
              "h-6 w-6",
              location === "/savings" ? "text-primary dark:text-purple-400" : "text-neutral-dark dark:text-gray-300"
            )} />
            <span className={cn(
              "text-xs mt-1 font-medium",
              location === "/savings" ? "text-primary dark:text-purple-400" : "text-neutral-dark dark:text-gray-300"
            )}>Savings</span>
          </div>
        </Link>
        
        <button className="flex flex-col items-center p-2 text-neutral-dark dark:text-gray-300">
          <User className="h-6 w-6" />
          <span className="text-xs mt-1 font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
}
