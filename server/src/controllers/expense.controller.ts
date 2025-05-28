import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Creare expense cu notificări
export const createExpense = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { description, amount, payerId, participants } = req.body;

  if (!id || id.trim() === "") {
    res.status(400).json({ message: "Trip ID is missing or empty." });
    return;
  }
  if (!description || description.trim() === "") {
    res.status(400).json({ message: "Description is missing or empty." });
    return;
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    res.status(400).json({ message: "Amount must be a positive number." });
    return;
  }

  if (!payerId || payerId.trim() === "") {
    res.status(400).json({ message: "Payer ID is missing or empty." });
    return;
  }

  if (!Array.isArray(participants) || participants.length === 0) {
    res.status(400).json({ message: "Participants are missing or empty." });
    return;
  }

  try {
    const expense = await prisma.expense.create({
      data: {
        tripId: id,
        description,
        amount: parsedAmount,
        userId: payerId,
        paidById: payerId,
        participants: {
          create: participants.map((userId: string) => ({
            userId,
            amount: parsedAmount / participants.length,
          })),
        },
      },
    });

    // 🔔 Trimite notificări participanților (exclus plătitorul)
    for (const participantId of participants) {
      if (participantId !== payerId) {
        await prisma.notification.create({
          data: {
            userId: participantId,
            message: `Nouă cheltuială: ${description} ($${parsedAmount})`,
            type: "EXPENSE",
            isRead: false,
          },
        });
      }
    }

    res.status(201).json(expense);
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ message: "Error creating expense" });
  }
};

// Obține toate expenses pentru trip
export const getExpensesForTrip = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const expenses = await prisma.expense.findMany({
      where: { tripId: id },
      include: {
        user: true,
        participants: {
          include: { user: true },
        },
      },
    });
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Error fetching expenses" });
  }
};

// Ștergere expense
export const deleteExpense = async (req: Request, res: Response): Promise<void> => {
  const { expenseId } = req.params;

  try {
    await prisma.expense.delete({
      where: { id: expenseId },
    });
    res.status(200).json({ message: "Expense deleted" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Error deleting expense" });
  }
};
