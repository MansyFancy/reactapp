import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { formatPKR, formatDate } from "@/lib/utils/format";
import { Search, Filter, Plus, Wallet, Gift, Coins } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AddTransactionModal } from "@/components/modals/AddTransactionModal";
import { useTransactionContext } from "@/providers/TransactionProvider";

export default function ExtraCash() {
  const { openTransactionModal, setTransactionType } = useTransactionContext();
  
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['/api/transactions/extra'],
  });
  
  const { data: financialSummary } = useQuery({
    queryKey: ['/api/summary'],
  });
  
  const handleAddExtraCash = () => {
    setTransactionType('extra');
    openTransactionModal();
  };
  
  // Helper to get an appropriate icon based on category ID
  const getCategoryIcon = (categoryId: number) => {
    switch (categoryId) {
      case 15: return <Wallet className="h-5 w-5 text-purple-500" />;
      case 16: return <Gift className="h-5 w-5 text-purple-500" />;
      default: return <Coins className="h-5 w-5 text-purple-500" />;
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pb-24 lg:pb-8 pt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <Sidebar />
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-montserrat font-bold">Extra Cash</h1>
              <Button 
                className="bg-purple-500 text-white rounded-lg px-4 py-2 flex items-center"
                onClick={handleAddExtraCash}
              >
                <Plus className="h-5 w-5 mr-1" />
                <span className="font-medium">Add Extra Cash</span>
              </Button>
            </div>
            
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle>Extra Cash Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-400 text-white p-5 rounded-xl">
                    <h3 className="text-white text-opacity-80 font-medium">Available Extra Cash</h3>
                    <p className="text-3xl font-montserrat font-bold mt-2">
                      {financialSummary ? formatPKR(financialSummary.extraCash) : "PKR 0"}
                    </p>
                    <p className="text-sm mt-4 text-white text-opacity-80">Free to spend as you wish</p>
                  </div>
                  
                  <div className="bg-white border p-5 rounded-xl">
                    <div className="flex justify-between">
                      <h3 className="text-gray-500 font-medium">Free Spending</h3>
                      <Wallet className="h-5 w-5 text-purple-500" />
                    </div>
                    <p className="text-xl font-montserrat font-bold mt-2 text-purple-500">
                      {isLoading ? <Skeleton className="h-8 w-24" /> : formatPKR(7500)}
                    </p>
                    <p className="text-xs mt-4 text-gray-500">For personal enjoyment</p>
                  </div>
                  
                  <div className="bg-white border p-5 rounded-xl">
                    <div className="flex justify-between">
                      <h3 className="text-gray-500 font-medium">Gifts & Special</h3>
                      <Gift className="h-5 w-5 text-purple-500" />
                    </div>
                    <p className="text-xl font-montserrat font-bold mt-2 text-purple-500">
                      {isLoading ? <Skeleton className="h-8 w-24" /> : formatPKR(5000)}
                    </p>
                    <p className="text-xs mt-4 text-gray-500">For friends & celebrations</p>
                  </div>
                </div>
                
                <div className="mt-6 bg-purple-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-700">How to use Extra Cash?</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Extra cash is money that's not allocated to your necessities, bills, or savings. 
                        It's for discretionary spending - your fun money!
                      </p>
                    </div>
                    <Coins className="h-10 w-10 text-purple-200" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Extra Cash Transactions</CardTitle>
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
                          <div className="bg-purple-100 rounded-full p-2 mr-3">
                            {getCategoryIcon(transaction.categoryId)}
                          </div>
                          <div>
                            <h4 className="font-medium text-neutral-dark">{transaction.description}</h4>
                            <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-montserrat font-semibold text-purple-500">
                            {formatPKR(transaction.amount)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {transaction.categoryId === 15 ? "Pocket Money" : "Gifts"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No extra cash transactions found</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={handleAddExtraCash}
                    >
                      Add Extra Cash
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
