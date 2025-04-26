import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { formatPKR, formatDate, calculatePercentage } from "@/lib/utils/format";
import { Search, Filter, Plus, PiggyBank, Shield, Plane, Smartphone, Home } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AddTransactionModal } from "@/components/modals/AddTransactionModal";
import { useTransactionContext } from "@/providers/TransactionProvider";
import { Progress } from "@/components/ui/progress";
import { type SavingsGoal } from "@shared/schema";

export default function Savings() {
  const { openTransactionModal, setTransactionType } = useTransactionContext();
  
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/transactions/saving'],
  });
  
  const { data: savingsGoals, isLoading: goalsLoading } = useQuery<SavingsGoal[]>({
    queryKey: ['/api/savings-goals'],
  });
  
  const isLoading = transactionsLoading || goalsLoading;
  
  const handleAddSavings = () => {
    setTransactionType('saving');
    openTransactionModal();
  };
  
  // Helper to get an appropriate icon based on category ID
  const getCategoryIcon = (categoryId: number) => {
    switch (categoryId) {
      case 11: return <Shield className="h-5 w-5 text-blue-500" />;
      case 12: return <Plane className="h-5 w-5 text-blue-500" />;
      case 13: return <Smartphone className="h-5 w-5 text-blue-500" />;
      case 14: return <Home className="h-5 w-5 text-blue-500" />;
      default: return <PiggyBank className="h-5 w-5 text-blue-500" />;
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
              <h1 className="text-2xl font-montserrat font-bold">Savings</h1>
              <Button 
                className="bg-blue-500 text-white rounded-lg px-4 py-2 flex items-center"
                onClick={handleAddSavings}
              >
                <Plus className="h-5 w-5 mr-1" />
                <span className="font-medium">Add to Savings</span>
              </Button>
            </div>
            
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle>Savings Goals</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((index) => (
                      <Skeleton key={index} className="h-28 w-full" />
                    ))}
                  </div>
                ) : savingsGoals && savingsGoals.length > 0 ? (
                  <div className="space-y-4">
                    {savingsGoals.map((goal) => {
                      const current = parseFloat(goal.current.toString());
                      const target = parseFloat(goal.target.toString());
                      const progressPercentage = calculatePercentage(current, target);
                      
                      return (
                        <div key={goal.id} className="bg-blue-50 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="bg-blue-500 bg-opacity-10 rounded-full p-3"
                              style={{ backgroundColor: `${goal.color}20` }}
                            >
                              {goal.icon === 'smartphone' ? (
                                <Smartphone className="h-5 w-5" style={{ color: goal.color }} />
                              ) : goal.icon === 'home' ? (
                                <Home className="h-5 w-5" style={{ color: goal.color }} />
                              ) : goal.icon === 'plane' ? (
                                <Plane className="h-5 w-5" style={{ color: goal.color }} />
                              ) : (
                                <Shield className="h-5 w-5" style={{ color: goal.color }} />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="font-montserrat font-semibold">{goal.name}</h4>
                                {goal.deadline && (
                                  <span className="text-xs text-gray-500">
                                    Due by {formatDate(goal.deadline)}
                                  </span>
                                )}
                              </div>
                              <Progress 
                                value={progressPercentage} 
                                className="h-2 mt-2"
                              />
                              <div className="flex justify-between mt-1 text-sm">
                                <span className="text-gray-600">
                                  {formatPKR(current)} / {formatPKR(target)}
                                </span>
                                <span className="text-blue-500 font-medium">{progressPercentage}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No savings goals found</p>
                    <Button variant="outline" className="mt-2">
                      Create Savings Goal
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Savings Transactions</CardTitle>
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
                          <div className="bg-blue-100 rounded-full p-2 mr-3">
                            {getCategoryIcon(transaction.categoryId)}
                          </div>
                          <div>
                            <h4 className="font-medium text-neutral-dark">{transaction.description}</h4>
                            <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-montserrat font-semibold text-blue-500">
                            {formatPKR(transaction.amount)}
                          </p>
                          <p className="text-xs text-gray-500">Transfer to Savings</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No savings transactions found</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={handleAddSavings}
                    >
                      Add to Savings
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
