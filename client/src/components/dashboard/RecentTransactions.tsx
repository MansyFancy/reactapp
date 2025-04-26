import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { type Transaction, type Category } from "@shared/schema";
import { formatPKR, formatDate } from "@/lib/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Briefcase, 
  ShoppingBag, 
  Utensils, 
  PiggyBank, 
  Zap 
} from "lucide-react";
import { cn } from "@/lib/utils";

export function RecentTransactions() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions/recent'],
  });
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  const getCategoryIcon = (categoryId: number | null) => {
    if (!categoryId || !categories) return <Briefcase />;
    
    const category = categories.find(c => c.id === categoryId);
    const iconName = category?.icon || "briefcase";
    
    switch (iconName) {
      case "briefcase": return <Briefcase />;
      case "shopping-bag": return <ShoppingBag />;
      case "utensils": return <Utensils />;
      case "piggy-bank": return <PiggyBank />;
      case "zap": return <Zap />;
      default: return <Briefcase />;
    }
  };
  
  const getCategoryColor = (categoryId: number | null) => {
    if (!categoryId || !categories) return "bg-green-100";
    
    const category = categories.find(c => c.id === categoryId);
    const type = category?.type || "income";
    
    switch (type) {
      case "income": return "bg-green-100";
      case "expense": return "bg-red-100";
      case "saving": return "bg-blue-100";
      case "extra": return "bg-purple-100";
      default: return "bg-gray-100";
    }
  };
  
  const getTextColor = (categoryId: number | null) => {
    if (!categoryId || !categories) return "text-green-500";
    
    const category = categories.find(c => c.id === categoryId);
    const type = category?.type || "income";
    
    switch (type) {
      case "income": return "text-green-500";
      case "expense": return "text-red-500";
      case "saving": return "text-blue-500";
      case "extra": return "text-purple-500";
      default: return "text-gray-500";
    }
  };
  
  const filteredTransactions = transactions?.filter(transaction => 
    transaction.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-montserrat font-semibold text-neutral-dark">Recent Transactions</h3>
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-40" />
            </div>
          </div>
          
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-montserrat font-semibold text-neutral-dark">Recent Transactions</h3>
          <div className="flex space-x-2">
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Search..." 
                className="bg-neutral-light pl-8 pr-3 py-1 rounded-lg text-sm border-0 w-32 focus:w-40 transition-all focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
            </div>
            <Button variant="ghost" className="bg-neutral-light px-3 py-1 rounded-lg text-sm hover:bg-neutral">Filter</Button>
          </div>
        </div>
        
        <div className="space-y-3">
          {filteredTransactions && filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center">
                  <div className={cn(
                    "rounded-full p-2 mr-3",
                    getCategoryColor(transaction.categoryId)
                  )}>
                    <div className={cn(
                      "h-5 w-5",
                      getTextColor(transaction.categoryId)
                    )}>
                      {getCategoryIcon(transaction.categoryId)}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-dark">{transaction.description}</h4>
                    <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "font-montserrat font-semibold",
                    transaction.type === "income" ? "text-green-500" : 
                    transaction.type === "expense" ? "text-red-500" :
                    transaction.type === "saving" ? "text-blue-500" : "text-purple-500"
                  )}>
                    {transaction.type === "income" ? "+" : "-"}{formatPKR(transaction.amount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {transaction.type === "income" ? "Bank Transfer" : 
                     transaction.type === "expense" ? "Debit Card" :
                     transaction.type === "saving" ? "Transfer to Savings" : "Cash"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-gray-500">
              No transactions found
            </div>
          )}
        </div>

        {filteredTransactions && filteredTransactions.length > 0 && (
          <div className="mt-4 text-center">
            <Button variant="link" className="text-primary font-medium hover:text-primary-dark">
              View All Transactions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
