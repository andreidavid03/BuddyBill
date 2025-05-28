import { Request, Response } from "express";
import { PrismaClient, Expense, ExpenseParticipant } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  userId?: string;
  params: {
    groupId: string; // This is actually tripId from the route
  };
}

// Interfață pentru o tranzacție sugerată
interface SuggestedTransaction {
  from: string; // ID-ul utilizatorului care plătește
  to: string;   // ID-ul utilizatorului care primește
  amount: number; // Suma tranzacției
}

// This interface is important for clarity
interface ExpenseWithRelationsForBalance extends Expense {
  user: { id: string; name: string | null; email: string }; // Payer of the expense
  participants: ExpenseParticipant[];
}

// Calculare balanțe într-un grup (trip) și generare tranzacții de decontare
export const calculateBalances = async (req: AuthRequest, res: Response): Promise<void> => {
  const { groupId: tripId } = req.params; // Renamed for clarity, it's the tripId

  try {
    // 1. Obține toți utilizatorii din trip
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { users: true }, // Include toți utilizatorii asociați cu trip-ul
    });

    if (!trip) {
      res.status(404).json({ message: "Trip not found" });
      return;
    }

    const allTripUsers = trip.users; // Get all users associated with the trip

    // 2. Obține toate cheltuielile pentru trip, incluzând plătitorul și participanții
    const expenses = await prisma.expense.findMany({
      where: {
        tripId: tripId,
      },
      include: {
        user: true, // The payer of the expense
        participants: true,
      },
    }) as ExpenseWithRelationsForBalance[];

    // Initialize balances for all users in the trip
    const userBalances: { [key: string]: number } = {};
    allTripUsers.forEach(user => {
      userBalances[user.id] = 0;
    });

    expenses.forEach(expense => {
      const payerId = expense.userId; // The one who paid the expense
      const expenseAmount = expense.amount;

      // Add the full expense amount to the payer's balance (they paid this much)
      // This increases their net balance, meaning others owe them more, or they owe others less.
      if (userBalances[payerId] !== undefined) {
        userBalances[payerId] += expenseAmount;
      }

      // Distribute the expense among participants
      expense.participants.forEach(participant => {
        if (userBalances[participant.userId] !== undefined) {
          // Subtract the participant's share from their balance.
          // If participant.amount is positive (regular expense), it means they owe that amount.
          // If participant.amount is negative (from a settlement, meaning they *received* money),
          // subtracting a negative effectively *adds* to their balance.
          userBalances[participant.userId] -= participant.amount;
        }
      });
    });

    // Now, calculate suggested transactions based on final balances
    const debtors: { userId: string; amount: number }[] = [];
    const creditors: { userId: string; amount: number }[] = [];

    for (const userId in userBalances) {
      const balance = userBalances[userId];
      if (balance < -0.01) { // Datorează bani (negative balance)
        debtors.push({ userId, amount: Math.abs(balance) });
      } else if (balance > 0.01) { // I se datorează bani (positive balance)
        creditors.push({ userId, amount: balance });
      }
    }

    // Sort for optimization (largest debt/credit first)
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const suggestedTransactions: SuggestedTransaction[] = [];

    while (debtors.length > 0 && creditors.length > 0) {
      const debtor = debtors[0];
      const creditor = creditors[0];

      const settlementAmount = Math.min(debtor.amount, creditor.amount);

      suggestedTransactions.push({
        from: debtor.userId,
        to: creditor.userId,
        amount: parseFloat(settlementAmount.toFixed(2)),
      });

      debtor.amount -= settlementAmount;
      creditor.amount -= settlementAmount;

      if (debtor.amount < 0.01) { // Aproape de zero
        debtors.shift();
      }
      if (creditor.amount < 0.01) { // Aproape de zero
        creditors.shift();
      }
    }

    res.json({
      tripBalances: userBalances, // You might want to return the individual balances for debugging/display
      suggestedTransactions: suggestedTransactions,
    });
  } catch (error) {
    console.error("Error calculating balances:", error);
    res.status(500).json({ message: "Error calculating balances" });
  }
};