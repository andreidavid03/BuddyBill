// server/src/routes/payment.routes.ts
import express from "express";
import { markAsPaid, settlePayment, getPaymentsForTrip } from "../controllers/payment.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();

// Ruta pentru a marca o cheltuială ca plătită (dacă o mai folosești, de ex. în vizualizarea detaliată a unei cheltuieli)
router.patch("/:expenseId/pay", verifyToken, markAsPaid);

// Ruta pentru a înregistra o decontare (settlement) între doi utilizatori într-un trip
router.post("/settle", verifyToken, settlePayment);

// Ruta nouă pentru a obține plățile pentru un trip (utile pentru a filtra tranzacțiile sugerate)
router.get("/trip/:tripId", verifyToken, getPaymentsForTrip);

export default router;