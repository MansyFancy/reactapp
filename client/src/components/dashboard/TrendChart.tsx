import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Chart from "chart.js/auto";
import { useQuery } from "@tanstack/react-query";
import { type Transaction } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { getPreviousMonths } from "@/lib/utils/format";

export function TrendChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [timeframe, setTimeframe] = useState<string>("6-months");
  
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
  });
  
  useEffect(() => {
    if (!transactions || !chartRef.current) return;
    
    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Determine number of months based on timeframe
    let monthCount = 6;
    if (timeframe === "3-months") monthCount = 3;
    if (timeframe === "12-months") monthCount = 12;
    
    // Get month labels
    const monthLabels = getPreviousMonths(monthCount).map(date => date.toLocaleDateString('en-US', { month: 'short' }));
    
    // Calculate income and expense data per month
    const now = new Date();
    const incomeData: number[] = Array(monthCount).fill(0);
    const expenseData: number[] = Array(monthCount).fill(0);
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthDiff = (now.getFullYear() - date.getFullYear()) * 12 + now.getMonth() - date.getMonth();
      
      if (monthDiff >= 0 && monthDiff < monthCount) {
        const amount = parseFloat(transaction.amount.toString());
        const index = monthCount - 1 - monthDiff;
        
        if (transaction.type === "income") {
          incomeData[index] += amount;
        } else if (transaction.type === "expense") {
          expenseData[index] += amount;
        }
      }
    });
    
    // Create chart
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: monthLabels,
        datasets: [
          {
            label: 'Income',
            data: incomeData,
            backgroundColor: '#10B981', // green
            borderRadius: 4,
            barPercentage: 0.5,
            categoryPercentage: 0.7
          },
          {
            label: 'Expense',
            data: expenseData,
            backgroundColor: '#F43F5E', // red
            borderRadius: 4,
            barPercentage: 0.5,
            categoryPercentage: 0.7
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
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
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
    
    // Cleanup on component unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [transactions, timeframe]);
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-montserrat font-semibold text-neutral-dark">Income vs Expense</h3>
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
          <h3 className="font-montserrat font-semibold text-neutral-dark">Income vs Expense</h3>
          <Select defaultValue={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="bg-neutral-light px-3 py-1 rounded-lg text-sm border-0 w-32">
              <SelectValue placeholder="Last 6 Months" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3-months">Last 3 Months</SelectItem>
              <SelectItem value="6-months">Last 6 Months</SelectItem>
              <SelectItem value="12-months">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="h-64">
          <canvas ref={chartRef} />
        </div>
      </CardContent>
    </Card>
  );
}
