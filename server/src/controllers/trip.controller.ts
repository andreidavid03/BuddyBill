import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  userId?: string;
  params: {
    id: string;
  };
}

export const getAllTrips = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  try {
    const trips = await prisma.trip.findMany({
      where: { userId: userId },
      include: {
        users: true,
      },
    });
    res.json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTripById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const trip = await prisma.trip.findUnique({
      where: { id: id },
      include: {
        users: true,
      },
    });

    if (!trip) {
      res.status(404).json({ message: "Trip not found" });
      return;
    }

    res.json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name } = req.body;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized: User ID is missing" });
    return;
  }

  try {
    const newTrip = await prisma.trip.create({
      data: {
        name,
        userId: userId,
      },
    });
    res.status(201).json(newTrip);
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({ message: "Failed to create trip" });
  }
};

export const updateTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const trip = await prisma.trip.update({
      where: { id: id },
      data: { name: name },
    });
    res.json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.trip.delete({
      where: { id: id },
    });
    res.json({ message: "Trip deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTripExpenses = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const expenses = await prisma.expense.findMany({
      where: { tripId: id },
    });
    res.json(expenses);
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};

export const createTripExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { description, amount, paymentType, paidById } = req.body;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized: User ID is missing" });
    return;
  }

  try {
    const expense = await prisma.expense.create({
      data: {
        tripId: id,
        description,
        amount,
        paymentType,
        userId: userId,
        paidById: paidById,
      },
    });
    res.status(201).json(expense);
  } catch (error) {
    console.error("Failed to create expense:", error);
    res.status(500).json({ message: "Failed to create expense" });
  }
};

export const getTripUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: id },
      include: {
        users: true,
      },
    });

    if (!trip) {
      res.status(404).json({ message: "Trip not found" });
      return;
    }

    res.json(trip.users);
  } catch (error) {
    console.error("Error fetching trip users:", error);
    res.status(500).json({ message: "Failed to fetch trip users" });
  }
};

export const addExistingFriendToTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params; // Trip ID
  const { userId } = req.body; // User ID to add to the trip

  try {
    // 1. Verify that the trip exists
    const trip = await prisma.trip.findUnique({
      where: { id: id },
    });

    if (!trip) {
      res.status(404).json({ message: "Trip not found" });
      return;
    }

    // 2. Verify that the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // 3. Associate the user with the trip
    await prisma.trip.update({
      where: { id: id },
      data: {
        users: {
          connect: { id: userId },
        },
      },
    });

    res.status(200).json({ message: "User added to trip successfully" });
  } catch (error) {
    console.error("Failed to add user to trip:", error);
    res.status(500).json({ message: "Failed to add user to trip" });
  }
};

export const getTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const trip = await prisma.trip.findUnique({
      where: {
        id: id,
      },
    });
    res.json(trip);
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({ message: "Failed to fetch trip" });
  }
};