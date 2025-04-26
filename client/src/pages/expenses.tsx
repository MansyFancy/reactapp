import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { formatPKR, formatDate } from "@/lib/utils/format";
import { Search, Filter, Plus, ShoppingBag, Utensils, FileText, Car } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AddTransactionModal } from "@/components/modals/AddTransactionModal";
import { useTransactionContext } from "@/providers/TransactionProvider";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";

export default function Expenses() {
  const { openTransactionModal, setTransactionType } = useTransactionContext();
  
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['/api/transactions/expense'],
  });
  
  const handleAddExpense = () => {
    setTransactionType('expense');
    openTransactionModal();
  };
  
  // Helper to get an appropriate icon based on category ID
  const getCategoryIcon = (categoryId: number) => {
    switch (categoryId) {
      case 6: return <ShoppingBag className="h-5 w-5 text-red-500" />;
      case 7: return <Utensils className="h-5 w-5 text-red-500" />;
      case 8: return <FileText className="h-5 w-5 text-red-500" />;
      case 9: return <Car className="h-5 w-5 text-red-500" />;
      default: return <ShoppingBag className="h-5 w-5 text-red-500" />;
    }
  };
  
  return (
    <div className="min-h-screen bg-background dark:bg-gray-950 transition-all duration-200 opacity-100">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 pb-24 lg:pb-8 pt-4 md:pt-6">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          <Sidebar />
          
          <div className="flex-1 w-full animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl font-montserrat font-bold dark:text-white">Expenses</h1>
              <Button 
                className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 flex items-center w-full sm:w-auto justify-center"
                onClick={handleAddExpense}
              >
                <Plus className="h-5 w-5 mr-1" />
                <span className="font-medium">Add Expense</span>
              </Button>
            </div>
            
            <Card className="mb-6 dark:bg-gray-900 dark:border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="dark:text-white">Expense Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">This Month</h3>
                    <p className="text-xl font-montserrat font-bold text-red-500 dark:text-red-400 mt-1">
                      {isLoading ? <Skeleton className="h-6 w-24 dark:bg-gray-700" /> : formatPKR(24200)}
                    </p>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Month</h3>
                    <p className="text-xl font-montserrat font-bold text-red-500 dark:text-red-400 mt-1">
                      {isLoading ? <Skeleton className="h-6 w-24 dark:bg-gray-700" /> : formatPKR(22000)}
                    </p>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">This Year</h3>
                    <p className="text-xl font-montserrat font-bold text-red-500 dark:text-red-400 mt-1">
                      {isLoading ? <Skeleton className="h-6 w-24 dark:bg-gray-700" /> : formatPKR(90000)}
                    </p>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average</h3>
                    <p className="text-xl font-montserrat font-bold text-red-500 dark:text-red-400 mt-1">
                      {isLoading ? <Skeleton className="h-6 w-24 dark:bg-gray-700" /> : formatPKR(23000)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mb-6">
              <ExpenseChart />
            </div>
            
            <Card className="dark:bg-gray-900 dark:border-gray-800">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2">
                <CardTitle className="dark:text-white mb-4 sm:mb-0">Expense Transactions</CardTitle>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Input 
                      type="text" 
                      placeholder="Search..." 
                      className="bg-neutral-light dark:bg-gray-800 dark:text-white pl-8 pr-3 py-1 rounded-lg text-sm border-0 w-full sm:w-32 focus:w-full sm:focus:w-40 transition-all focus:outline-none"
                    />
                    <Search className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                  </div>
                  <Button 
                    variant="ghost" 
                    className="bg-neutral-light dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 px-3 py-1 rounded-lg text-sm hover:bg-neutral flex items-center flex-1 sm:flex-initial justify-center"
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((index) => (
                      <Skeleton key={index} className="h-16 w-full dark:bg-gray-800" />
                    ))}
                  </div>
                ) : transactions && transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.map((transaction: any) => (
                      <div 
                        key={transaction.id}
                        className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                      >
                        <div className="flex items-center">
                          <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-2 mr-3">
                            {getCategoryIcon(transaction.categoryId)}
                          </div>
                          <div>
                            <h4 className="font-medium text-neutral-dark dark:text-white">{transaction.description}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(transaction.date)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-montserrat font-semibold text-red-500 dark:text-red-400">
                            -{formatPKR(transaction.amount)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {transaction.categoryId === 6 ? "Debit Card" : 
                             transaction.categoryId === 7 ? "Cash" : "Online Payment"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No expense transactions found</p>
                    <Button 
                      variant="outline" 
                      className="mt-2 dark:border-gray-700 dark:text-gray-300"
                      onClick={handleAddExpense}
                    >
                      Add Expense
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <MobileNavigation />
      <AddTransactionModal />
    </div>
  );
}
