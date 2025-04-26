import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema, insertSavingsGoalSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = express.Router();
  
  // Get financial summary
  apiRouter.get("/summary", async (req, res) => {
    try {
      const summary = await storage.getFinancialSummary();
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Failed to get financial summary" });
    }
  });
  
  // Categories routes
  apiRouter.get("/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to get categories" });
    }
  });
  
  apiRouter.get("/categories/:type", async (req, res) => {
    try {
      const type = req.params.type;
      const categories = await storage.getCategoriesByType(type);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to get categories by type" });
    }
  });
  
  // Transactions routes
  apiRouter.get("/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get transactions" });
    }
  });
  
  apiRouter.get("/transactions/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const transactions = await storage.getRecentTransactions(limit);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get recent transactions" });
    }
  });
  
  apiRouter.get("/transactions/:type", async (req, res) => {
    try {
      const type = req.params.type;
      const transactions = await storage.getTransactionsByType(type);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get transactions by type" });
    }
  });
  
  apiRouter.post("/transactions", async (req, res) => {
    try {
      const transaction = insertTransactionSchema.parse(req.body);
      const createdTransaction = await storage.createTransaction(transaction);
      res.status(201).json(createdTransaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid transaction data", errors: fromZodError(error) });
      } else {
        res.status(500).json({ message: "Failed to create transaction" });
      }
    }
  });
  
  apiRouter.put("/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const transaction = req.body;
      const updatedTransaction = await storage.updateTransaction(id, transaction);
      
      if (!updatedTransaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.json(updatedTransaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to update transaction" });
    }
  });
  
  apiRouter.delete("/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTransaction(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete transaction" });
    }
  });
  
  // Savings goals routes
  apiRouter.get("/savings-goals", async (req, res) => {
    try {
      const goals = await storage.getSavingsGoals();
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Failed to get savings goals" });
    }
  });
  
  apiRouter.get("/savings-goals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const goal = await storage.getSavingsGoal(id);
      
      if (!goal) {
        return res.status(404).json({ message: "Savings goal not found" });
      }
      
      res.json(goal);
    } catch (error) {
      res.status(500).json({ message: "Failed to get savings goal" });
    }
  });
  
  apiRouter.post("/savings-goals", async (req, res) => {
    try {
      const goal = insertSavingsGoalSchema.parse(req.body);
      const createdGoal = await storage.createSavingsGoal(goal);
      res.status(201).json(createdGoal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid savings goal data", errors: fromZodError(error) });
      } else {
        res.status(500).json({ message: "Failed to create savings goal" });
      }
    }
  });
  
  apiRouter.put("/savings-goals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const goal = req.body;
      const updatedGoal = await storage.updateSavingsGoal(id, goal);
      
      if (!updatedGoal) {
        return res.status(404).json({ message: "Savings goal not found" });
      }
      
      res.json(updatedGoal);
    } catch (error) {
      res.status(500).json({ message: "Failed to update savings goal" });
    }
  });
  
  apiRouter.delete("/savings-goals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteSavingsGoal(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Savings goal not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete savings goal" });
    }
  });
  
  // Register the API router with prefix
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
