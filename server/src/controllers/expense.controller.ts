import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  userId?: string;
}

export const deleteExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  const { expenseId } = req.params;

  try {
    const deleted = await prisma.expense.delete({
      where: { id: expenseId },
    });

    res.json({ message: "Expense deleted", deleted });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Expense not found" });
  }
};

export const updateExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  const { expenseId } = req.params;
  const { amount, description } = req.body;

  try {
    const updated = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        amount,
        description,
      },
    });

    res.json({ message: "Expense updated", updated });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Expense not found or invalid data" });
  }
};
