// server/src/controllers/trip.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createExpense } from "./expense.controller"; // Importă funcția createExpense

const prisma = new PrismaClient();

// Extinde Request pentru a include userId
interface AuthRequest extends Request {
  userId?: string;
}

export const getAllTrips = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId; // Obține userId-ul din token

  try {
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    // Găsește toate trip-urile unde utilizatorul este fie creator (userId), fie participant
    const trips = await prisma.trip.findMany({
      where: {
        OR: [
          { userId: userId }, // Utilizatorul este creatorul trip-ului
          { users: { some: { id: userId } } }, // Utilizatorul este participant în trip
        ],
      },
      include: {
        users: { // Include participanții trip-ului pentru afișare
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });
    res.json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ message: "Error fetching trips" });
  }
};

export const getTripById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const currentUserId = req.userId;

  try {
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        users: true,
        expenses: {
          include: {
            user: true, // Payer of the expense
            participants: {
              include: {
                user: true // Participant details
              }
            }
          },
          orderBy: { createdAt: "desc" }
        },
        user: true, // The owner of the trip
      },
    });
    if (!trip) {
      res.status(404).json({ message: "Trip not found" });
      return;
    }

    // Asigură-te că utilizatorul curent are acces la acest trip (este owner sau participant)
    const isOwnerOrParticipant = trip.userId === currentUserId || trip.users.some(u => u.id === currentUserId);
    if (!isOwnerOrParticipant) {
      res.status(403).json({ message: "Access denied to this trip." });
      return;
    }

    res.json(trip);
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({ message: "Error fetching trip" });
  }
};

export const createTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name } = req.body;
  const userId = req.userId; // Preia userId din tokenul de autentificare

  if (!name || !userId) {
    res.status(400).json({ message: "Trip name and user ID are required" });
    return;
  }

  try {
    const newTrip = await prisma.trip.create({
      data: {
        name,
        userId, // Setează creatorul trip-ului
        users: { // Adaugă creatorul trip-ului ca participant implicit
          connect: { id: userId }
        }
      },
    });
    res.status(201).json(newTrip);
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({ message: "Error creating trip" });
  }
};

export const updateTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name } = req.body;
  const currentUserId = req.userId;

  if (!name) {
    res.status(400).json({ message: "Trip name is required" });
    return;
  }

  try {
    // Verifică dacă utilizatorul curent este proprietarul trip-ului
    const trip = await prisma.trip.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!trip) {
      res.status(404).json({ message: "Trip not found" });
      return;
    }

    if (trip.userId !== currentUserId) {
      res.status(403).json({ message: "Unauthorized to update this trip." });
      return;
    }

    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: { name },
    });
    res.json(updatedTrip);
  } catch (error) {
    console.error("Error updating trip:", error);
    res.status(500).json({ message: "Error updating trip" });
  }
};

export const deleteTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const currentUserId = req.userId;

  try {
    // Verifică dacă utilizatorul curent este proprietarul trip-ului
    const trip = await prisma.trip.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!trip) {
      res.status(404).json({ message: "Trip not found" });
      return;
    }

    if (trip.userId !== currentUserId) {
      res.status(403).json({ message: "Unauthorized to delete this trip." });
      return;
    }

    // Șterge întâi relațiile dependente (expenses, payments, notifications legate de expenses)
    // Prisma va gestiona onDelete: Cascade dacă este configurat corect în schema.
    // Dacă nu, va trebui să ștergi manual:
    // await prisma.expense.deleteMany({ where: { tripId: id } });
    // await prisma.payment.deleteMany({ where: { tripId: id } });
    // etc.
    // Sau folosește tranzacții pentru a te asigura că totul se șterge Atomic
    await prisma.trip.delete({ where: { id } });
    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    res.status(500).json({ message: "Error deleting trip" });
  }
};

export const getTripExpenses = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const currentUserId = req.userId;

  try {
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: { users: true } // Verifică dacă utilizatorul este membru al trip-ului
    });

    if (!trip) {
      res.status(404).json({ message: "Trip not found" });
      return;
    }

    const isMember = trip.users.some(u => u.id === currentUserId) || trip.userId === currentUserId;
    if (!isMember) {
      res.status(403).json({ message: "Access denied to this trip's expenses." });
      return;
    }

    const expenses = await prisma.expense.findMany({
      where: { tripId: id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        participants: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Error fetching expenses" });
  }
};

// Exportă direct funcția createExpense din expense.controller
export { createExpense as createTripExpense };


// Fix pentru getTripUsers: Asigură-te că utilizatorul autentificat face parte din trip.
export const getTripUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const currentUserId = req.userId;

  try {
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: { users: true },
    });
    if (!trip) {
      res.status(404).json({ message: "Trip not found" });
      return;
    }

    // Verifică dacă utilizatorul curent este membru al trip-ului
    const isMember = trip.users.some(u => u.id === currentUserId) || trip.userId === currentUserId;
    if (!isMember) {
      res.status(403).json({ message: "Access denied to this trip's users." });
      return;
    }

    res.json(trip.users);
  } catch (error) {
    console.error("Error fetching trip users:", error);
    res.status(500).json({ message: "Error fetching trip users" });
  }
};

export const addExistingFriendToTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params; // tripId
  const { userId: friendIdToAdd } = req.body; // ID-ul prietenului de adăugat
  const currentUserId = req.userId; // ID-ul utilizatorului autentificat

  if (!friendIdToAdd) {
    res.status(400).json({ message: "Friend ID is required" });
    return;
  }

  try {
    // Verifică dacă trip-ul există și dacă utilizatorul curent este membru sau proprietar
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: { users: true }, // Include userii existenți pentru verificare
    });

    if (!trip) {
      res.status(404).json({ message: "Trip not found" });
      return;
    }

    const isMemberOrOwner = trip.users.some(u => u.id === currentUserId) || trip.userId === currentUserId;
    if (!isMemberOrOwner) {
      res.status(403).json({ message: "Unauthorized to add users to this trip." });
      return;
    }

    // Verifică dacă prietenul de adăugat există
    const userToAdd = await prisma.user.findUnique({ where: { id: friendIdToAdd } });
    if (!userToAdd) {
      res.status(404).json({ message: "User to add not found" });
      return;
    }

    // Verifică dacă prietenul este deja în trip
    if (trip.users.some(u => u.id === friendIdToAdd)) {
      res.status(400).json({ message: "User is already a member of this trip." });
      return;
    }

    // Adaugă utilizatorul la trip
    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: {
        users: {
          connect: { id: friendIdToAdd },
        },
      },
      include: { users: true },
    });

    res.json({ message: "Friend added to trip successfully", trip: updatedTrip });
  } catch (error) {
    console.error("Error adding friend to trip:", error);
    res.status(500).json({ message: "Error adding friend to trip" });
  }
};

// Functie noua: elimina un user din trip
export const removeUserFromTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id: tripId, userId: userToRemoveId } = req.params;
  const currentUserId = req.userId;

  if (!userToRemoveId) {
    res.status(400).json({ message: "User ID to remove is required" });
    return;
  }

  try {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { users: true },
    });

    if (!trip) {
      res.status(404).json({ message: "Trip not found" });
      return;
    }

    // Doar proprietarul trip-ului poate elimina membri, sau membrul se poate auto-elimina
    const isOwner = trip.userId === currentUserId;
    const isSelfRemoval = userToRemoveId === currentUserId;

    if (!isOwner && !isSelfRemoval) {
      res.status(403).json({ message: "Unauthorized to remove this user from the trip." });
      return;
    }

    // Asigură-te că utilizatorul de eliminat este un membru al trip-ului
    const isMember = trip.users.some(u => u.id === userToRemoveId);
    if (!isMember) {
      res.status(400).json({ message: "User is not a member of this trip." });
      return;
    }

    // Nu permite proprietarului să se elimine singur dacă el este singurul membru.
    // Această logică ar putea fi mai complexă, dar pentru început, nu permite ca un trip să rămână fără owner.
    if (isSelfRemoval && trip.userId === currentUserId && trip.users.length === 1) {
      res.status(400).json({ message: "Cannot remove yourself if you are the only member and owner of the trip." });
      return;
    }

    // Elimina utilizatorul din trip
    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: {
        users: {
          disconnect: { id: userToRemoveId },
        },
      },
      include: { users: true },
    });

    res.json({ message: "User removed from trip successfully", trip: updatedTrip });
  } catch (error) {
    console.error("Error removing user from trip:", error);
    res.status(500).json({ message: "Error removing user from trip" });
  }
};