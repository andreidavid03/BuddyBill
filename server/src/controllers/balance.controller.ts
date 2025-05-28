import { Request, Response } from "express";
import { PrismaClient, Expense, ExpenseParticipant } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  userId?: string;
  params: {
    groupId: string; 
  };
}


interface SuggestedTransaction {
  from: string; 
  to: string;   
  amount: number; 
}


interface ExpenseWithRelationsForBalance extends Expense {
  user: { id: string; name: string | null; email: string }; 
  participants: ExpenseParticipant[];
}


export const calculateBalances = async (req: AuthRequest, res: Response): Promise<void> => {
  const { groupId: tripId } = req.params; 

  try {
    
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { users: true }, 
    });

    if (!trip) {
      res.status(404).json({ message: "Trip not found" });
      return;
    }

    const allTripUsers = trip.users; 

    
    const expenses = await prisma.expense.findMany({
      where: {
        tripId: tripId,
      },
      include: {
        user: true, 
        participants: true,
      },
    }) as ExpenseWithRelationsForBalance[];

    
    const userBalances: { [key: string]: number } = {};
    allTripUsers.forEach(user => {
      userBalances[user.id] = 0;
    });

    expenses.forEach(expense => {
      const payerId = expense.userId; 
      const expenseAmount = expense.amount;

      
      
      if (userBalances[payerId] !== undefined) {
        userBalances[payerId] += expenseAmount;
      }

      
      expense.participants.forEach(participant => {
        if (userBalances[participant.userId] !== undefined) {
          
          
          
          
          userBalances[participant.userId] -= participant.amount;
        }
      });
    });

    
    const debtors: { userId: string; amount: number }[] = [];
    const creditors: { userId: string; amount: number }[] = [];

    for (const userId in userBalances) {
      const balance = userBalances[userId];
      if (balance < -0.01) { 
        debtors.push({ userId, amount: Math.abs(balance) });
      } else if (balance > 0.01) { 
        creditors.push({ userId, amount: balance });
      }
    }

    
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

      if (debtor.amount < 0.01) { 
        debtors.shift();
      }
      if (creditor.amount < 0.01) { 
        creditors.shift();
      }
    }

    res.json({
      tripBalances: userBalances, 
      suggestedTransactions: suggestedTransactions,
    });
  } catch (error) {
    console.error("Error calculating balances:", error);
    res.status(500).json({ message: "Error calculating balances" });
  }
};