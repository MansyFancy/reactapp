import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smartphone, Home, Plane, Briefcase, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type SavingsGoal } from "@shared/schema";
import { formatPKR } from "@/lib/utils/format";
import { apiRequest } from "@/lib/queryClient";

export function SavingsGoalPlan() {
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState<number | undefined>();
  const [icon, setIcon] = useState("smartphone");
  const [color, setColor] = useState("#3B82F6");

  const queryClient = useQueryClient();

  const { data: savingsGoals, isLoading } = useQuery<SavingsGoal[]>({
    queryKey: ['/api/savings-goals'],
  });

  const addGoalMutation = useMutation({
    mutationFn: async (goal: any) => {
      return apiRequest('POST', '/api/savings-goals', goal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/savings-goals'] });
      setGoalModalOpen(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setName("");
    setTargetAmount(undefined);
    setIcon("smartphone");
    setColor("#3B82F6");
  };

  const handleSubmit = () => {
    if (!name || !targetAmount) return;
    
    addGoalMutation.mutate({
      name,
      target: targetAmount,
      current: 0,
      userId: 1,
      icon,
      color
    });
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "smartphone": return <Smartphone className="h-5 w-5" />;
      case "home": return <Home className="h-5 w-5" />;
      case "plane": return <Plane className="h-5 w-5" />;
      case "briefcase": return <Briefcase className="h-5 w-5" />;
      default: return <Smartphone className="h-5 w-5" />;
    }
  };

  return (
    <>
      <Card className="border-2 border-dashed border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <span>Savings Goal Plan</span>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800"
              onClick={() => setGoalModalOpen(true)}
            >
              <Plus className="h-4 w-4 text-purple-600 dark:text-purple-300" />
              <span className="sr-only">Add Savings Goal</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            {isLoading ? (
              <p className="text-muted-foreground">Loading savings goals...</p>
            ) : savingsGoals && savingsGoals.length > 0 ? (
              <div className="space-y-3">
                {savingsGoals.map((goal) => (
                  <div key={goal.id} className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="p-3 rounded-full"
                        style={{ backgroundColor: `${goal.color}20` }}
                      >
                        <div style={{ color: goal.color }}>
                          {getIconComponent(goal.icon)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-montserrat font-semibold">{goal.name}</h4>
                          <span className="text-xs text-purple-600 dark:text-purple-300 font-medium">
                            {Math.round((Number(goal.current) / Number(goal.target)) * 100)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${Math.round((Number(goal.current) / Number(goal.target)) * 100)}%`,
                              backgroundColor: goal.color 
                            }}
                          />
                        </div>
                        <div className="flex justify-between mt-1 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {formatPKR(Number(goal.current))} / {formatPKR(Number(goal.target))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p className="text-muted-foreground mb-3">No savings goals yet</p>
                <Button 
                  variant="outline" 
                  className="bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                  onClick={() => setGoalModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Savings Goal
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={goalModalOpen} onOpenChange={setGoalModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center font-montserrat font-bold text-xl">
              Create Savings Goal
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="goal-name">Goal Name</Label>
              <Input 
                id="goal-name"
                placeholder="e.g. New Phone, Vacation, etc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="target-amount">Target Amount (PKR)</Label>
              <Input 
                id="target-amount"
                type="number"
                placeholder="50000"
                value={targetAmount || ''}
                onChange={(e) => setTargetAmount(parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="goal-icon">Icon</Label>
              <Select defaultValue={icon} onValueChange={setIcon}>
                <SelectTrigger id="goal-icon" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smartphone">
                    <div className="flex items-center">
                      <Smartphone className="h-4 w-4 mr-2" />
                      <span>Smartphone</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="home">
                    <div className="flex items-center">
                      <Home className="h-4 w-4 mr-2" />
                      <span>Home</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="plane">
                    <div className="flex items-center">
                      <Plane className="h-4 w-4 mr-2" />
                      <span>Travel</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="briefcase">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      <span>Investment</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="goal-color">Color</Label>
              <div className="grid grid-cols-4 gap-2 mt-1">
                {["#3B82F6", "#8B5CF6", "#EC4899", "#F43F5E", "#EF4444", "#F59E0B", "#10B981", "#06B6D4"].map((c) => (
                  <div 
                    key={c} 
                    className={`h-8 w-full rounded-md cursor-pointer transition-all ${
                      color === c ? 'ring-2 ring-offset-2 ring-primary' : ''
                    }`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setGoalModalOpen(false)}
              disabled={addGoalMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={handleSubmit}
              disabled={!name || !targetAmount || addGoalMutation.isPending}
            >
              {addGoalMutation.isPending ? "Saving..." : "Save Goal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}