import { Wallet, Plus, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransactionContext } from "@/providers/TransactionProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Header() {
  const { openTransactionModal } = useTransactionContext();
  
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Wallet className="h-8 w-8 text-primary dark:text-purple-400 mr-2" />
          <h1 className="text-xl md:text-2xl font-montserrat font-bold text-neutral-dark dark:text-white">Money Tracker</h1>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button 
            className="bg-primary hover:bg-primary/90 text-white rounded-lg px-2 md:px-4 py-2 flex items-center"
            onClick={openTransactionModal}
          >
            <Plus className="h-5 w-5 md:mr-1" />
            <span className="font-medium hidden md:inline">Add Transaction</span>
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="rounded-full hidden md:flex">
            <Bell className="h-5 w-5 dark:text-gray-300" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-5 w-5 dark:text-gray-300" />
          </Button>
        </div>
      </div>
    </header>
  );
}
