import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, Coins,
  ArrowUpRight 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatPKR } from "@/lib/utils/format";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { type FinancialSummary as FinancialSummaryType } from "@shared/schema";

export function FinancialSummary() {
  const { data: summary, isLoading } = useQuery<FinancialSummaryType>({
    queryKey: ['/api/summary'],
  });
  
  if (isLoading) {
    return (
      <div className="mb-6">
        {/* Balance Card Skeleton */}
        <Skeleton className="h-[140px] w-full rounded-xl mb-4" />
        
        {/* Row 1 Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Skeleton className="h-[120px] rounded-xl" />
          <Skeleton className="h-[120px] rounded-xl" />
        </div>
        
        {/* Row 2 Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-[120px] rounded-xl" />
          <Skeleton className="h-[120px] rounded-xl" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="mb-6">
      {/* Balance Card - Full width */}
      <Card className="bg-gradient-to-r from-primary to-indigo-400 text-white border-0 w-full mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white text-opacity-80 font-medium">Total Balance</p>
              <h2 className="font-montserrat text-2xl md:text-3xl font-bold mt-1">
                {summary ? formatPKR(summary.balance) : "PKR 0"}
              </h2>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-2">
              <Wallet className="h-6 w-6" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="bg-white bg-opacity-20 rounded-full p-1">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <span className="ml-1 text-sm font-medium">+2.5% from last month</span>
          </div>
        </CardContent>
      </Card>

      {/* Row 1: Income and Expenses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Income Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Income</p>
                <h3 className="font-montserrat text-xl font-bold mt-1 text-green-500">
                  {summary ? formatPKR(summary.income) : "PKR 0"}
                </h3>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center text-green-500">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                12%
              </span>
              <span className="ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Expense Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Expenses</p>
                <h3 className="font-montserrat text-xl font-bold mt-1 text-red-500">
                  {summary ? formatPKR(summary.expense) : "PKR 0"}
                </h3>
              </div>
              <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-2">
                <TrendingDown className="h-5 w-5 text-red-500" />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center text-red-500">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                8%
              </span>
              <span className="ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Savings and Extra Cash */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Savings Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Savings</p>
                <h3 className="font-montserrat text-xl font-bold mt-1 text-blue-500">
                  {summary ? formatPKR(summary.savings) : "PKR 0"}
                </h3>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2">
                <PiggyBank className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center text-blue-500">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                5%
              </span>
              <span className="ml-1">vs target</span>
            </div>
          </CardContent>
        </Card>

        {/* Extra Cash Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Extra Cash</p>
                <h3 className="font-montserrat text-xl font-bold mt-1 text-purple-600">
                  {summary ? formatPKR(summary.extraCash) : "PKR 0"}
                </h3>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-2">
                <Coins className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center text-purple-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                Free
              </span>
              <span className="ml-1">to spend</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
