import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  userId?: string;
  params: {
    notificationId: string; // Marcat ca obligatoriu
  };
}

export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const markNotificationAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  const { notificationId } = req.params;

  try {
    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }, // acum Prisma știe că există acest câmp
    });

    res.json({ message: "Notification marked as read", updated });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Notification not found" });
  }
};