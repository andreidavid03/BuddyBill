import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  userId?: string;
}

export const deleteGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  const { groupId } = req.params;

  try {
    await prisma.group.delete({
      where: { id: groupId },
    });

    res.json({ message: "Group deleted" });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Group not found" });
  }
};
