import { 
  categories, transactions, savingsGoals, 
  type User, type InsertUser, 
  type Category, type InsertCategory,
  type Transaction, type InsertTransaction,
  type SavingsGoal, type InsertSavingsGoal,
  type FinancialSummary
} from "@shared/schema";

export interface IStorage {
  // User methods (from original)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category methods
  getCategories(): Promise<Category[]>;
  getCategoriesByType(type: string): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Transaction methods
  getTransactions(): Promise<Transaction[]>;
  getRecentTransactions(limit: number): Promise<Transaction[]>;
  getTransactionsByType(type: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: number): Promise<boolean>;
  
  // Savings goals methods
  getSavingsGoals(): Promise<SavingsGoal[]>;
  getSavingsGoal(id: number): Promise<SavingsGoal | undefined>;
  createSavingsGoal(goal: InsertSavingsGoal): Promise<SavingsGoal>;
  updateSavingsGoal(id: number, goal: Partial<InsertSavingsGoal>): Promise<SavingsGoal | undefined>;
  deleteSavingsGoal(id: number): Promise<boolean>;
  
  // Financial summary
  getFinancialSummary(): Promise<FinancialSummary>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categoriesMap: Map<number, Category>;
  private transactionsMap: Map<number, Transaction>;
  private savingsGoalsMap: Map<number, SavingsGoal>;
  
  private userCurrentId: number;
  private categoryCurrentId: number;
  private transactionCurrentId: number;
  private savingsGoalCurrentId: number;

  constructor() {
    this.users = new Map();
    this.categoriesMap = new Map();
    this.transactionsMap = new Map();
    this.savingsGoalsMap = new Map();
    
    this.userCurrentId = 1;
    this.categoryCurrentId = 1;
    this.transactionCurrentId = 1;
    this.savingsGoalCurrentId = 1;
    
    // Initialize with default categories
    this.initializeDefaultCategories();
    // Initialize with sample transactions
    this.initializeSampleData();
  }

  // User methods (from original)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categoriesMap.values());
  }
  
  async getCategoriesByType(type: string): Promise<Category[]> {
    return Array.from(this.categoriesMap.values()).filter(
      (category) => category.type === type
    );
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryCurrentId++;
    const category: Category = { ...insertCategory, id };
    this.categoriesMap.set(id, category);
    return category;
  }
  
  // Transaction methods
  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactionsMap.values());
  }
  
  async getRecentTransactions(limit: number): Promise<Transaction[]> {
    return Array.from(this.transactionsMap.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }
  
  async getTransactionsByType(type: string): Promise<Transaction[]> {
    return Array.from(this.transactionsMap.values()).filter(
      (transaction) => transaction.type === type
    );
  }
  
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionCurrentId++;
    const transaction: Transaction = { 
      ...insertTransaction, 
      id,
      userId: 1, // Default user ID
      amount: insertTransaction.amount.toString(), // Convert to string for storage
    };
    this.transactionsMap.set(id, transaction);
    return transaction;
  }
  
  async updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const existingTransaction = this.transactionsMap.get(id);
    if (!existingTransaction) return undefined;
    
    const updatedTransaction: Transaction = { 
      ...existingTransaction, 
      ...transaction,
      amount: transaction.amount ? transaction.amount.toString() : existingTransaction.amount,
    };
    
    this.transactionsMap.set(id, updatedTransaction);
    return updatedTransaction;
  }
  
  async deleteTransaction(id: number): Promise<boolean> {
    return this.transactionsMap.delete(id);
  }
  
  // Savings goals methods
  async getSavingsGoals(): Promise<SavingsGoal[]> {
    return Array.from(this.savingsGoalsMap.values());
  }
  
  async getSavingsGoal(id: number): Promise<SavingsGoal | undefined> {
    return this.savingsGoalsMap.get(id);
  }
  
  async createSavingsGoal(insertGoal: InsertSavingsGoal): Promise<SavingsGoal> {
    const id = this.savingsGoalCurrentId++;
    const goal: SavingsGoal = { 
      ...insertGoal, 
      id,
      userId: 1, // Default user ID 
      target: insertGoal.target.toString(),
      current: insertGoal.current.toString(),
    };
    this.savingsGoalsMap.set(id, goal);
    return goal;
  }
  
  async updateSavingsGoal(id: number, goal: Partial<InsertSavingsGoal>): Promise<SavingsGoal | undefined> {
    const existingGoal = this.savingsGoalsMap.get(id);
    if (!existingGoal) return undefined;
    
    const updatedGoal: SavingsGoal = {
      ...existingGoal,
      ...goal,
      target: goal.target ? goal.target.toString() : existingGoal.target,
      current: goal.current ? goal.current.toString() : existingGoal.current,
    };
    
    this.savingsGoalsMap.set(id, updatedGoal);
    return updatedGoal;
  }
  
  async deleteSavingsGoal(id: number): Promise<boolean> {
    return this.savingsGoalsMap.delete(id);
  }
  
  // Financial summary
  async getFinancialSummary(): Promise<FinancialSummary> {
    const transactions = Array.from(this.transactionsMap.values());
    
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
    
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
    
    const savings = transactions
      .filter(t => t.type === 'saving')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
    
    const extraCash = transactions
      .filter(t => t.type === 'extra')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
    
    const balance = income - expense;
    
    return {
      balance,
      income,
      expense,
      savings,
      extraCash
    };
  }
  
  // Initialize with default categories
  private initializeDefaultCategories() {
    // Income categories
    this.createCategory({ name: "Salary", type: "income", icon: "briefcase", color: "#10B981" });
    this.createCategory({ name: "Freelance", type: "income", icon: "code", color: "#3B82F6" });
    this.createCategory({ name: "Investments", type: "income", icon: "trending-up", color: "#8B5CF6" });
    this.createCategory({ name: "Gifts", type: "income", icon: "gift", color: "#EC4899" });
    this.createCategory({ name: "Other Income", type: "income", icon: "plus-circle", color: "#6366F1" });
    
    // Expense categories
    this.createCategory({ name: "Shopping", type: "expense", icon: "shopping-bag", color: "#EF4444" });
    this.createCategory({ name: "Food & Dining", type: "expense", icon: "utensils", color: "#8B5CF6" });
    this.createCategory({ name: "Bills & Utilities", type: "expense", icon: "file-text", color: "#F59E0B" });
    this.createCategory({ name: "Transportation", type: "expense", icon: "car", color: "#10B981" });
    this.createCategory({ name: "Entertainment", type: "expense", icon: "film", color: "#EC4899" });
    
    // Savings categories
    this.createCategory({ name: "Emergency Fund", type: "saving", icon: "shield", color: "#3B82F6" });
    this.createCategory({ name: "Vacation", type: "saving", icon: "plane", color: "#F59E0B" });
    this.createCategory({ name: "New Phone", type: "saving", icon: "smartphone", color: "#6366F1" });
    this.createCategory({ name: "Home", type: "saving", icon: "home", color: "#10B981" });
    
    // Extra cash categories
    this.createCategory({ name: "Pocket Money", type: "extra", icon: "wallet", color: "#8B5CF6" });
    this.createCategory({ name: "Gifts", type: "extra", icon: "gift", color: "#EC4899" });
  }
  
  // Initialize with sample data
  private initializeSampleData() {
    // Sample transactions
    this.createTransaction({ 
      amount: 45000, 
      type: "income", 
      categoryId: 1, 
      description: "Monthly salary", 
      date: new Date(2023, 4, 15) 
    });
    
    this.createTransaction({ 
      amount: 2500, 
      type: "expense", 
      categoryId: 6, 
      description: "Shopping Mall", 
      date: new Date(2023, 4, 14) 
    });
    
    this.createTransaction({ 
      amount: 1200, 
      type: "expense", 
      categoryId: 7, 
      description: "Food & Dining", 
      date: new Date(2023, 4, 12) 
    });
    
    this.createTransaction({ 
      amount: 10000, 
      type: "saving", 
      categoryId: 13, 
      description: "Savings Deposit", 
      date: new Date(2023, 4, 10) 
    });
    
    this.createTransaction({ 
      amount: 3850, 
      type: "expense", 
      categoryId: 8, 
      description: "Electricity Bill", 
      date: new Date(2023, 4, 8) 
    });
    
    // Sample savings goal
    this.createSavingsGoal({
      name: "New Phone",
      target: 50000,
      current: 32500,
      icon: "smartphone",
      color: "#3B82F6",
      deadline: new Date(2023, 7, 31)
    });
  }
}

export const storage = new MemStorage();
