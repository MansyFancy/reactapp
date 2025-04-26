import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { formatPKR, formatDate } from "@/lib/utils/format";
import { Search, Filter, Plus, Briefcase, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AddTransactionModal } from "@/components/modals/AddTransactionModal";
import { useTransactionContext } from "@/providers/TransactionProvider";
import { cn } from "@/lib/utils";

export default function Income() {
  const { openTransactionModal, setTransactionType } = useTransactionContext();
  
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['/api/transactions/income'],
  });
  
  const handleAddIncome = () => {
    setTransactionType('income');
    openTransactionModal();
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pb-24 lg:pb-8 pt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <Sidebar />
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-montserrat font-bold">Income</h1>
              <Button 
                className="bg-primary text-white rounded-lg px-4 py-2 flex items-center"
                onClick={handleAddIncome}
              >
                <Plus className="h-5 w-5 mr-1" />
                <span className="font-medium">Add Income</span>
              </Button>
            </div>
            
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle>Income Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">This Month</h3>
                    <p className="text-xl font-montserrat font-bold text-green-500 mt-1">
                      {isLoading ? <Skeleton className="h-6 w-24" /> : formatPKR(45000)}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Last Month</h3>
                    <p className="text-xl font-montserrat font-bold text-green-500 mt-1">
                      {isLoading ? <Skeleton className="h-6 w-24" /> : formatPKR(43000)}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">This Year</h3>
                    <p className="text-xl font-montserrat font-bold text-green-500 mt-1">
                      {isLoading ? <Skeleton className="h-6 w-24" /> : formatPKR(180000)}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Average</h3>
                    <p className="text-xl font-montserrat font-bold text-green-500 mt-1">
                      {isLoading ? <Skeleton className="h-6 w-24" /> : formatPKR(42000)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Income Transactions</CardTitle>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Input 
                      type="text" 
                      placeholder="Search..." 
                      className="bg-neutral-light pl-8 pr-3 py-1 rounded-lg text-sm border-0 w-32 focus:w-40 transition-all focus:outline-none"
                    />
                    <Search className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                  </div>
                  <Button variant="ghost" className="bg-neutral-light px-3 py-1 rounded-lg text-sm hover:bg-neutral flex items-center">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((index) => (
                      <Skeleton key={index} className="h-16 w-full" />
                    ))}
                  </div>
                ) : transactions && transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.map((transaction: any) => (
                      <div 
                        key={transaction.id}
                        className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center">
                          <div className="bg-green-100 rounded-full p-2 mr-3">
                            {transaction.categoryId === 1 ? (
                              <Briefcase className="h-5 w-5 text-green-500" />
                            ) : (
                              <TrendingUp className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-neutral-dark">{transaction.description}</h4>
                            <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-montserrat font-semibold text-green-500">
                            +{formatPKR(transaction.amount)}
                          </p>
                          <p className="text-xs text-gray-500">Bank Transfer</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No income transactions found</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={handleAddIncome}
                    >
                      Add Income
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
