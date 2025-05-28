import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  userId?: string;
  params: {
    expenseId?: string;
    tripId?: string;
  };
}

// Setează o cheltuială ca plătită (opțional)
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
      data: { isPaid: true },
    });

    res.json({ message: "Expense marked as paid", updatedExpense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Înregistrează o decontare (settlement) și notificări
export const settlePayment = async (req: AuthRequest, res: Response): Promise<void> => {
  const { fromUserId, toUserId, amount, tripId } = req.body;

  if (!fromUserId || !toUserId || !amount || !tripId) {
    res.status(400).json({ message: "Missing required fields for settlement." });
    return;
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    res.status(400).json({ message: "Amount must be a positive number." });
    return;
  }

  try {
    const settlementExpense = await prisma.expense.create({
      data: {
        tripId: tripId,
        description: `Settlement: ${fromUserId} paid ${toUserId} $${parsedAmount.toFixed(2)}`,
        amount: parsedAmount,
        userId: fromUserId,
        paidById: fromUserId,
        participants: {
          create: [{
            userId: toUserId,
            amount: -parsedAmount,
          }],
        },
      },
    });

    // 🔔 Notificări pentru ambii
    await prisma.notification.create({
      data: {
        userId: toUserId,
        message: `Ai primit $${parsedAmount.toFixed(2)} de la ${fromUserId} pentru trip-ul ${tripId}`,
        type: "SETTLEMENT",
        isRead: false,
      },
    });
    await prisma.notification.create({
      data: {
        userId: fromUserId,
        message: `Ai plătit $${parsedAmount.toFixed(2)} către ${toUserId} pentru trip-ul ${tripId}`,
        type: "SETTLEMENT",
        isRead: false,
      },
    });

    res.status(201).json(settlementExpense);
  } catch (error) {
    console.error("Error settling payment:", error);
    res.status(500).json({ message: "Error settling payment." });
  }
};

// Obține toate plățile (expenses și settlements) pentru un trip
export const getPaymentsForTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  const { tripId } = req.params;

  if (!tripId) {
    res.status(400).json({ message: "Trip ID is required." });
    return;
  }

  try {
    const payments = await prisma.expense.findMany({
      where: { tripId: tripId },
      include: {
        user: true,
        participants: { include: { user: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(payments);
  } catch (error) {
    console.error("Error fetching payments for trip:", error);
    res.status(500).json({ message: "Error fetching payments for trip." });
  }
};
