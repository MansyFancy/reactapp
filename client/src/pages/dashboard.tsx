import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { FinancialSummary } from "@/components/dashboard/FinancialSummary";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SavingsGoal } from "@/components/dashboard/SavingsGoal";
import { SavingsGoalPlan } from "@/components/dashboard/SavingsGoalPlan";
import { FinancialInsights } from "@/components/dashboard/FinancialInsights";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AddTransactionModal } from "@/components/modals/AddTransactionModal";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-950 transition-all duration-200 opacity-100">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 pb-24 lg:pb-8 pt-4 md:pt-6">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          <Sidebar />
          
          <div className="flex-1 w-full animate-fadeIn">
            <FinancialSummary />
            
            {/* Mobile view: Show savings goals between summary and charts on small screens */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 mt-4">
              <SavingsGoal />
              <SavingsGoalPlan />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
              <ExpenseChart />
              <TrendChart />
            </div>
            
            <RecentTransactions />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
              <FinancialInsights />
              <QuickActions />
            </div>
          </div>
          
          {/* For desktop sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0 space-y-6">
            <SavingsGoal />
            <SavingsGoalPlan />
          </div>
        </div>
      </main>
      
      <MobileNavigation />
      <AddTransactionModal />
    </div>
  );
}
