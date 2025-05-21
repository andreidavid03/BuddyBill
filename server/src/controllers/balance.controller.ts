import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  userId?: string;
  params: {
    groupId: string;
  };
}

// Calculare balanțe într-un grup
export const calculateBalances = async (req: AuthRequest, res: Response): Promise<void> => {
  const { groupId } = req.params;
  const userId = req.userId;

  try {
    const expenses = await prisma.expense.findMany({
      where: {
        tripId: groupId, // Use tripId instead of groupId
      },
    });

    if (expenses.length === 0) {
      res.json({ message: "No expenses found for this group", balances: [] });
      return;
    }

    const trip = await prisma.trip.findUnique({
      where: { id: groupId },
      include: { user: true, expenses: true }, // Include user and expenses
    });

    if (!trip) {
      res.status(404).json({ message: "Trip not found" });
      return;
    }

    const balances: Record<string, number> = {};

    // Initialize balances for the trip creator
    balances[trip.userId] = 0;

    expenses.forEach(expense => {
      balances[trip.userId] -= expense.amount; // Subtract expense amount from trip creator's balance
    });

    res.json({ balances });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};