import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  userId?: string;
  params: {
    tripId?: string;
    userId?: string;
  };
}


export const getUserTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  const { tripId } = req.params;
  const userId = req.userId;

  try {
    const expenses = await prisma.expense.findMany({
      where: {
        tripId: tripId,
        userId: userId,
      },
      orderBy: { createdAt: "desc" },
    });

    const totalSpent = expenses.reduce((total, expense) => total + expense.amount, 0);

    res.json({ totalSpent, expenses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAllUserTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  try {
    const expenses = await prisma.expense.findMany({
      where: {
        userId: userId,
      },
      orderBy: { createdAt: "desc" },
    });

    const totalSpent = expenses.reduce((total, expense) => total + expense.amount, 0);

    res.json({ totalSpent, expenses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getFilteredTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  const { tripId, userId } = req.params;

  try {
    const expenses = await prisma.expense.findMany({
      where: {
        tripId: tripId,
        userId: userId,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getUnpaidTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  try {
    const unpaidExpenses = await prisma.expense.findMany({
      where: {
        isPaid: false,
        userId: userId,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(unpaidExpenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};