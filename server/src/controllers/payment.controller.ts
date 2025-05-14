import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  userId?: string;
}

// Setare cheltuială ca plătită
export const markAsPaid = async (req: AuthRequest, res: Response): Promise<void> => {
  const { expenseId } = req.params;

  try {
    const expense = await prisma.expense.findUnique({ where: { id: expenseId } });

    if (!expense) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data: { isPaid: true }
    });

    res.json({ message: "Expense marked as paid", updatedExpense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
