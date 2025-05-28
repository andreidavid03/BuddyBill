import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  userId?: string;
}

export const getStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    let totalYouAreOwed = 0;
    let totalYouOwe = 0;

    
    const expensesPaidByMe = await prisma.expense.findMany({
      where: {
        userId: userId,
        isPaid: false,
      },
      include: {
        participants: { include: { user: true } },
        user: true,
        trip: { select: { id: true, name: true } },
      },
    });

    expensesPaidByMe.forEach(expense => {
      expense.participants.forEach(p => {
        if (p.userId !== userId) totalYouAreOwed += p.amount;
      });
    });

    
    const expensesWhereIAmParticipant = await prisma.expense.findMany({
      where: {
        participants: { some: { userId: userId } },
        userId: { not: userId },
        isPaid: false,
      },
      include: {
        participants: { include: { user: true } },
        user: true,
        trip: { select: { id: true, name: true } },
      },
    });

    expensesWhereIAmParticipant.forEach(expense => {
      const myShare = expense.participants.find(p => p.userId === userId);
      if (myShare) totalYouOwe += myShare.amount;
    });

    const balance = totalYouAreOwed - totalYouOwe;

    
    const tripBalances: {
      tripId: string;
      tripName: string;
      totalAmount: number;
      yourDebt: number;
      yourCredit: number;
      balance: number;
    }[] = [];

    const allTrips = await prisma.trip.findMany({
      include: {
        expenses: {
          include: {
            participants: true,
            user: true,
          },
        },
      },
    });

    allTrips.forEach(trip => {
      let tripTotal = 0;
      let yourDebt = 0;
      let yourCredit = 0;

      trip.expenses.forEach(expense => {
        tripTotal += expense.amount;

        if (expense.userId === userId) {
          expense.participants.forEach(p => {
            if (p.userId !== userId) yourCredit += p.amount;
          });
        } else {
          const myShare = expense.participants.find(p => p.userId === userId);
          if (myShare) yourDebt += myShare.amount;
        }
      });

      if (yourDebt > 0 || yourCredit > 0) {
        tripBalances.push({
          tripId: trip.id,
          tripName: trip.name,
          totalAmount: tripTotal,
          yourDebt,
          yourCredit,
          balance: yourCredit - yourDebt,
        });
      }
    });

    
    const paymentsMade = await prisma.payment.findMany({
      where: { payerId: userId },
      include: { receiver: true, trip: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    const paymentsReceived = await prisma.payment.findMany({
      where: { receiverId: userId },
      include: { payer: true, trip: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      totalDue: totalYouOwe,
      totalOwed: totalYouAreOwed,
      balance: balance,
      tripBalances,
      paymentsMade,
      paymentsReceived,
    });

  } catch (error) {
    console.error("Error fetching status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
