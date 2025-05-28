// server/src/routes/trip.routes.ts
import express from "express";
import {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  getTripExpenses,
  createTripExpense,
  getTripUsers,
  addExistingFriendToTrip,
  removeUserFromTrip, // Adăugat
} from "../controllers/trip.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", verifyToken, getAllTrips);
router.get("/:id", verifyToken, getTripById);
router.post("/", verifyToken, createTrip);
router.put("/:id", verifyToken, updateTrip);
router.delete("/:id", verifyToken, deleteTrip);

router.get("/:id/expenses", verifyToken, getTripExpenses);
router.post("/:id/expenses", verifyToken, createTripExpense);

router.get("/:id/users", verifyToken, getTripUsers);
router.post("/:id/users", verifyToken, addExistingFriendToTrip);
router.delete("/:id/users/:userId", verifyToken, removeUserFromTrip); // Rută nouă pentru eliminare user

export default router;