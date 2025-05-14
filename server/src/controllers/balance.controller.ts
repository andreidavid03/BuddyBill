import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  userId?: string;
}

// Calculare balanțe într-un grup
export const calculateBalances = async (req: AuthRequest, res: Response): Promise<void> => {
  const { groupId } = req.params;

  try {
    const expenses = await prisma.expense.findMany({
      where: { groupId },
    });

    if (expenses.length === 0) {
      res.json({ message: "No expenses found for this group", balances: [] });
      return;
    }

    const members = await prisma.group.findUnique({
      where: { id: groupId },
      include: { members: true },
    });

    if (!members) {
      res.status(404).json({ message: "Group not found" });
      return;
    }

    const balances: Record<string, number> = {};

    members.members.forEach(member => {
      balances[member.id] = 0;
    });

    expenses.forEach(expense => {
      const splitAmount = expense.amount / members.members.length;
      
      members.members.forEach(member => {
        if (member.id === expense.groupId) {
          balances[member.id] += expense.amount;
        }
        balances[member.id] -= splitAmount;
      });
    });

    res.json({ balances });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
