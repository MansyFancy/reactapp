import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { type SavingsGoal as SavingsGoalType } from "@shared/schema";
import { formatPKR, calculatePercentage } from "@/lib/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export function SavingsGoal() {
  const { data: savingsGoals, isLoading } = useQuery<SavingsGoalType[]>({
    queryKey: ['/api/savings-goals'],
  });
  
  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-montserrat font-semibold text-neutral-dark">Savings Goal</h3>
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-28 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  if (!savingsGoals || savingsGoals.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-montserrat font-semibold text-neutral-dark">Savings Goal</h3>
            <Button variant="link" className="text-primary hover:text-primary-dark text-sm p-0">
              Add Goal
            </Button>
          </div>
          <div className="bg-neutral-light rounded-lg p-4 text-center text-gray-500">
            No savings goals yet
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Display the first savings goal
  const goal = savingsGoals[0];
  const current = parseFloat(goal.current.toString());
  const target = parseFloat(goal.target.toString());
  const progressPercentage = calculatePercentage(current, target);
  
  return (
    <Card className="mt-6">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-montserrat font-semibold text-neutral-dark">Savings Goal</h3>
          <Button variant="link" className="text-primary hover:text-primary-dark text-sm p-0">
            View All
          </Button>
        </div>
        
        <div className="bg-neutral-light rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 bg-opacity-10 rounded-full p-3">
              <Smartphone className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-montserrat font-semibold">{goal.name}</h4>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                <div 
                  className="h-2 bg-blue-500 rounded-full" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-sm">
                <span className="text-gray-600">
                  {formatPKR(current)} / {formatPKR(target)}
                </span>
                <span className="text-blue-500 font-medium">{progressPercentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
