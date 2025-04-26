import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Chart from "chart.js/auto";
import { useQuery } from "@tanstack/react-query";
import { type Transaction } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

type ExpenseCategory = {
  name: string;
  percentage: number;
  color: string;
};

export function ExpenseChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [timeframe, setTimeframe] = useState<string>("this-month");
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions/expense'],
  });
  
  const { data: categories } = useQuery({
    queryKey: ['/api/categories/expense'],
  });
  
  useEffect(() => {
    if (!transactions || !categories) return;
    
    // Create expense categories data
    const expenseByCategory: Record<number, number> = {};
    const categoryMap: Record<number, string> = {};
    const colorMap: Record<number, string> = {};
    
    // Map category IDs to names and colors
    categories.forEach((category: any) => {
      categoryMap[category.id] = category.name;
      colorMap[category.id] = category.color;
    });
    
    // Calculate total for each category
    transactions.forEach((transaction) => {
      if (transaction.categoryId) {
        expenseByCategory[transaction.categoryId] = (expenseByCategory[transaction.categoryId] || 0) + parseFloat(transaction.amount.toString());
      }
    });
    
    // Calculate total expenses
    const totalExpense = Object.values(expenseByCategory).reduce((sum, amount) => sum + amount, 0);
    
    // Calculate percentages and create data
    const categoryData: ExpenseCategory[] = Object.entries(expenseByCategory).map(([categoryId, amount]) => {
      const id = parseInt(categoryId);
      return {
        name: categoryMap[id] || 'Other',
        percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
        color: colorMap[id] || '#CBD5E1'
      };
    });
    
    // Sort by percentage (highest first)
    categoryData.sort((a, b) => b.percentage - a.percentage);
    
    setExpenseCategories(categoryData);
  }, [transactions, categories]);
  
  useEffect(() => {
    if (chartRef.current && expenseCategories.length > 0) {
      // Destroy previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      // Create new chart
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;
      
      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: expenseCategories.map(cat => cat.name),
          datasets: [{
            data: expenseCategories.map(cat => cat.percentage),
            backgroundColor: expenseCategories.map(cat => cat.color),
            borderWidth: 0,
            borderRadius: 4,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          cutout: '70%'
        }
      });
    }
    
    // Cleanup on component unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [expenseCategories]);
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-montserrat font-semibold text-neutral-dark">Expense Breakdown</h3>
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-montserrat font-semibold text-neutral-dark">Expense Breakdown</h3>
          <Select defaultValue={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="bg-neutral-light px-3 py-1 rounded-lg text-sm border-0 w-32">
              <SelectValue placeholder="This Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="3-months">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex h-64">
          <div className="w-1/2 h-full">
            <canvas ref={chartRef} />
          </div>
          <div className="w-1/2 pl-4 flex flex-col justify-center space-y-3">
            {expenseCategories.map((category, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm text-gray-700">{category.name}</span>
                <span className="ml-auto text-sm font-medium">{category.percentage}%</span>
              </div>
            ))}
            
            {expenseCategories.length === 0 && (
              <div className="text-center text-gray-500">
                No expense data available
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
