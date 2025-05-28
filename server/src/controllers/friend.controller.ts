import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  userId?: string;
}

export const sendFriendRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  const { receiverId } = req.body;
  const initiatorId = req.userId;

  try {
    if (!initiatorId) {
      res.status(400).json({ message: "User ID is missing" });
      return;
    }

    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiver) {
      res.status(400).json({ message: "Invalid receiver ID" });
      return;
    }

    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { initiatorId: initiatorId, receiverId: receiverId },
          { initiatorId: receiverId, receiverId: initiatorId },
        ],
      },
    });

    if (existingFriendship) {
      res.status(400).json({ message: "Friend request already sent or friendship exists" });
      return;
    }

    await prisma.friendship.create({
      data: {
        initiatorId: initiatorId,
        receiverId: receiverId,
      },
    });

    res.status(201).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Error sending friend request:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Failed to send friend request", error: errorMessage });
  }
};

export const acceptFriendRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const friendship = await prisma.friendship.update({
      where: { id },
      data: { status: "ACCEPTED" },
    });

    
    await prisma.notification.create({
      data: {
        userId: friendship.initiatorId,
        message: `Cererea ta de prietenie a fost acceptată!`,
        type: "FRIENDSHIP",
        isRead: false,
      },
    });
    await prisma.notification.create({
      data: {
        userId: friendship.receiverId,
        message: `Ai acceptat cererea de prietenie a lui ${friendship.initiatorId}.`,
        type: "FRIENDSHIP",
        isRead: false,
      },
    });

    res.json({ message: "Friend request accepted successfully" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Failed to accept friend request" });
  }
};

export const declineFriendRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.friendship.update({
      where: { id },
      data: { status: "DECLINED" },
    });

    res.json({ message: "Friend request declined successfully" });
  } catch (error) {
    console.error("Error declining friend request:", error);
    res.status(500).json({ message: "Failed to decline friend request" });
  }
};

export const getFriends = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  try {
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { initiatorId: userId, status: "ACCEPTED" },
          { receiverId: userId, status: "ACCEPTED" },
        ],
      },
      include: {
        initiator: true,
        receiver: true,
      },
    });

    const friends = friendships.map((friendship) =>
      friendship.initiatorId === userId ? friendship.receiver : friendship.initiator
    );

    res.json(friends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ message: "Failed to fetch friends" });
  }
};

export const getPendingFriendRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pendingRequests = await prisma.friendship.findMany({
      where: {
        receiverId: req.userId,
        status: "PENDING",
      },
      include: {
        initiator: true,
        receiver: true,
      },
    });

    res.json(pendingRequests);
  } catch (error) {
    console.error("Error fetching pending friend requests:", error);
    res.status(500).json({ message: "Failed to fetch friend requests" });
  }
};
