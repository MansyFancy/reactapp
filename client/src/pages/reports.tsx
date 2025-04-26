import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { formatPKR, getPreviousMonths } from "@/lib/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import { AddTransactionModal } from "@/components/modals/AddTransactionModal";
import Chart from "chart.js/auto";
import { 
  CalendarDays, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  TrendingDown,
  PiggyBank, 
  Coins
} from "lucide-react";

export default function Reports() {
  const [period, setPeriod] = useState<string>("6-months");
  const [chartTab, setChartTab] = useState<string>("overview");
  
  const incomeChartRef = useRef<HTMLCanvasElement>(null);
  const expenseChartRef = useRef<HTMLCanvasElement>(null);
  const savingsChartRef = useRef<HTMLCanvasElement>(null);
  const cashflowChartRef = useRef<HTMLCanvasElement>(null);
  
  const incomeChartInstance = useRef<Chart | null>(null);
  const expenseChartInstance = useRef<Chart | null>(null);
  const savingsChartInstance = useRef<Chart | null>(null);
  const cashflowChartInstance = useRef<Chart | null>(null);
  
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['/api/transactions'],
  });
  
  const { data: financialSummary } = useQuery({
    queryKey: ['/api/summary'],
  });
  
  // Helper to get month count based on period selection
  const getMonthCount = () => {
    switch (period) {
      case "3-months": return 3;
      case "6-months": return 6;
      case "12-months": return 12;
      default: return 6;
    }
  };
  
  // Create and update charts when transactions data changes or period changes
  useEffect(() => {
    if (!transactions || !cashflowChartRef.current) return;
    
    // Determine number of months based on timeframe
    const monthCount = getMonthCount();
    
    // Get month labels
    const monthLabels = getPreviousMonths(monthCount).map(date => date.toLocaleDateString('en-US', { month: 'short' }));
    
    // Calculate data per month
    const now = new Date();
    const incomeData: number[] = Array(monthCount).fill(0);
    const expenseData: number[] = Array(monthCount).fill(0);
    const savingsData: number[] = Array(monthCount).fill(0);
    const extraCashData: number[] = Array(monthCount).fill(0);
    
    transactions.forEach((transaction: any) => {
      const date = new Date(transaction.date);
      const monthDiff = (now.getFullYear() - date.getFullYear()) * 12 + now.getMonth() - date.getMonth();
      
      if (monthDiff >= 0 && monthDiff < monthCount) {
        const amount = parseFloat(transaction.amount.toString());
        const index = monthCount - 1 - monthDiff;
        
        if (transaction.type === "income") {
          incomeData[index] += amount;
        } else if (transaction.type === "expense") {
          expenseData[index] += amount;
        } else if (transaction.type === "saving") {
          savingsData[index] += amount;
        } else if (transaction.type === "extra") {
          extraCashData[index] += amount;
        }
      }
    });
    
    // Calculate net cashflow
    const cashflowData = incomeData.map((income, i) => income - expenseData[i]);
    
    // Create or update cashflow chart
    if (cashflowChartRef.current) {
      if (cashflowChartInstance.current) {
        cashflowChartInstance.current.destroy();
      }
      
      const ctx = cashflowChartRef.current.getContext('2d');
      if (!ctx) return;
      
      cashflowChartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: monthLabels,
          datasets: [
            {
              label: 'Income',
              data: incomeData,
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.2,
              fill: true
            },
            {
              label: 'Expense',
              data: expenseData,
              borderColor: '#F43F5E',
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              tension: 0.2,
              fill: true
            },
            {
              label: 'Net Cashflow',
              data: cashflowData,
              borderColor: '#6366F1',
              backgroundColor: 'transparent',
              tension: 0.2,
              borderWidth: 2,
              borderDash: [5, 5]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true,
                boxWidth: 6
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: PKR ${context.raw}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return 'PKR ' + value.toLocaleString();
                }
              }
            }
          }
        }
      });
    }
    
    // Create or update income chart
    if (incomeChartRef.current) {
      if (incomeChartInstance.current) {
        incomeChartInstance.current.destroy();
      }
      
      const ctx = incomeChartRef.current.getContext('2d');
      if (!ctx) return;
      
      incomeChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: monthLabels,
          datasets: [
            {
              label: 'Income',
              data: incomeData,
              backgroundColor: '#10B981',
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `Income: PKR ${context.raw}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return 'PKR ' + value.toLocaleString();
                }
              }
            }
          }
        }
      });
    }
    
    // Create or update expense chart
    if (expenseChartRef.current) {
      if (expenseChartInstance.current) {
        expenseChartInstance.current.destroy();
      }
      
      const ctx = expenseChartRef.current.getContext('2d');
      if (!ctx) return;
      
      expenseChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: monthLabels,
          datasets: [
            {
              label: 'Expenses',
              data: expenseData,
              backgroundColor: '#F43F5E',
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `Expenses: PKR ${context.raw}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return 'PKR ' + value.toLocaleString();
                }
              }
            }
          }
        }
      });
    }
    
    // Create or update savings chart
    if (savingsChartRef.current) {
      if (savingsChartInstance.current) {
        savingsChartInstance.current.destroy();
      }
      
      const ctx = savingsChartRef.current.getContext('2d');
      if (!ctx) return;
      
      savingsChartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: monthLabels,
          datasets: [
            {
              label: 'Savings',
              data: savingsData,
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.2,
              fill: true
            },
            {
              label: 'Extra Cash',
              data: extraCashData,
              borderColor: '#8B5CF6',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              tension: 0.2,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true,
                boxWidth: 6
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: PKR ${context.raw}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return 'PKR ' + value.toLocaleString();
                }
              }
            }
          }
        }
      });
    }
    
    // Cleanup on component unmount
    return () => {
      if (cashflowChartInstance.current) {
        cashflowChartInstance.current.destroy();
      }
      if (incomeChartInstance.current) {
        incomeChartInstance.current.destroy();
      }
      if (expenseChartInstance.current) {
        expenseChartInstance.current.destroy();
      }
      if (savingsChartInstance.current) {
        savingsChartInstance.current.destroy();
      }
    };
  }, [transactions, period]);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pb-24 lg:pb-8 pt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <Sidebar />
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-montserrat font-bold">Financial Reports</h1>
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-2 text-gray-500" />
                <Select defaultValue={period} onValueChange={setPeriod}>
                  <SelectTrigger className="bg-white border px-3 py-1 rounded-lg text-sm w-40">
                    <SelectValue placeholder="Last 6 Months" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3-months">Last 3 Months</SelectItem>
                    <SelectItem value="6-months">Last 6 Months</SelectItem>
                    <SelectItem value="12-months">Last 12 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="bg-white">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 font-medium">Income</p>
                      <h3 className="font-montserrat text-xl font-bold mt-1 text-green-500">
                        {financialSummary ? formatPKR(financialSummary.income) : isLoading ? <Skeleton className="h-6 w-24" /> : "PKR 0"}
                      </h3>
                    </div>
                    <div className="bg-green-100 rounded-full p-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    <span className="inline-flex items-center text-green-500">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      12%
                    </span>
                    <span className="ml-1">vs last period</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 font-medium">Expenses</p>
                      <h3 className="font-montserrat text-xl font-bold mt-1 text-red-500">
                        {financialSummary ? formatPKR(financialSummary.expense) : isLoading ? <Skeleton className="h-6 w-24" /> : "PKR 0"}
                      </h3>
                    </div>
                    <div className="bg-red-100 rounded-full p-2">
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    <span className="inline-flex items-center text-red-500">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      8%
                    </span>
                    <span className="ml-1">vs last period</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 font-medium">Savings</p>
                      <h3 className="font-montserrat text-xl font-bold mt-1 text-blue-500">
                        {financialSummary ? formatPKR(financialSummary.savings) : isLoading ? <Skeleton className="h-6 w-24" /> : "PKR 0"}
                      </h3>
                    </div>
                    <div className="bg-blue-100 rounded-full p-2">
                      <PiggyBank className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    <span className="inline-flex items-center text-blue-500">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      5%
                    </span>
                    <span className="ml-1">vs last period</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 font-medium">Extra Cash</p>
                      <h3 className="font-montserrat text-xl font-bold mt-1 text-purple-600">
                        {financialSummary ? formatPKR(financialSummary.extraCash) : isLoading ? <Skeleton className="h-6 w-24" /> : "PKR 0"}
                      </h3>
                    </div>
                    <div className="bg-purple-100 rounded-full p-2">
                      <Coins className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    <span className="inline-flex items-center text-purple-600">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      2%
                    </span>
                    <span className="ml-1">vs last period</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts Tabs */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle>Financial Charts</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" onValueChange={setChartTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="income">Income</TabsTrigger>
                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                    <TabsTrigger value="savings">Savings & Extra</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview">
                    {isLoading ? (
                      <Skeleton className="h-80 w-full" />
                    ) : (
                      <div className="h-80">
                        <canvas ref={cashflowChartRef} />
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="income">
                    {isLoading ? (
                      <Skeleton className="h-80 w-full" />
                    ) : (
                      <div className="h-80">
                        <canvas ref={incomeChartRef} />
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="expenses">
                    {isLoading ? (
                      <Skeleton className="h-80 w-full" />
                    ) : (
                      <div className="h-80">
                        <canvas ref={expenseChartRef} />
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="savings">
                    {isLoading ? (
                      <Skeleton className="h-80 w-full" />
                    ) : (
                      <div className="h-80">
                        <canvas ref={savingsChartRef} />
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Key Metrics */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Key Financial Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Income to Expense Ratio</h3>
                    <p className="text-xl font-montserrat font-bold text-primary mt-1">
                      {financialSummary && financialSummary.expense > 0 ? 
                        `${(financialSummary.income / financialSummary.expense).toFixed(2)}` : 
                        isLoading ? <Skeleton className="h-6 w-16" /> : "N/A"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Higher is better (aim for {'>'} 1.5)
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Savings Rate</h3>
                    <p className="text-xl font-montserrat font-bold text-blue-500 mt-1">
                      {financialSummary && financialSummary.income > 0 ? 
                        `${((financialSummary.savings / financialSummary.income) * 100).toFixed(0)}%` : 
                        isLoading ? <Skeleton className="h-6 w-16" /> : "0%"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Aim for at least 20% of income
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Discretionary Spending</h3>
                    <p className="text-xl font-montserrat font-bold text-purple-500 mt-1">
                      {financialSummary && financialSummary.income > 0 ? 
                        `${((financialSummary.extraCash / financialSummary.income) * 100).toFixed(0)}%` : 
                        isLoading ? <Skeleton className="h-6 w-16" /> : "0%"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Keep under 10% for optimal saving
                    </p>
                  </div>
                </div>
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
