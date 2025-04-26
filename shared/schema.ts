import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema - keep from original file
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Transaction categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'income', 'expense', 'saving', 'extra'
  icon: text("icon").notNull(),
  color: text("color").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  type: true,
  icon: true,
  color: true,
});

// Transactions
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: numeric("amount").notNull(),
  type: text("type").notNull(), // 'income', 'expense', 'saving', 'extra'
  categoryId: integer("category_id"),
  description: text("description"),
  date: timestamp("date").notNull().defaultNow(),
  attachment: text("attachment"),
});

export const insertTransactionSchema = createInsertSchema(transactions)
  .pick({
    amount: true,
    type: true,
    categoryId: true,
    description: true,
    date: true,
    attachment: true,
  })
  .extend({
    amount: z.number().positive(),
    date: z.date().default(() => new Date()),
  });

// Savings goals
export const savingsGoals = pgTable("savings_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  target: numeric("target").notNull(),
  current: numeric("current").notNull().default("0"),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  deadline: timestamp("deadline"),
});

export const insertSavingsGoalSchema = createInsertSchema(savingsGoals)
  .pick({
    name: true,
    target: true,
    current: true,
    icon: true,
    color: true,
    deadline: true,
  })
  .extend({
    target: z.number().positive(),
    current: z.number().nonnegative(),
  });

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export type InsertSavingsGoal = z.infer<typeof insertSavingsGoalSchema>;
export type SavingsGoal = typeof savingsGoals.$inferSelect;

// Financial summary type
export type FinancialSummary = {
  balance: number;
  income: number;
  expense: number;
  savings: number;
  extraCash: number;
};
