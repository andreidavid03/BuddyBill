
import express from "express";
import { markAsPaid, settlePayment, getPaymentsForTrip } from "../controllers/payment.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();


router.patch("/:expenseId/pay", verifyToken, markAsPaid);


router.post("/settle", verifyToken, settlePayment);


router.get("/trip/:tripId", verifyToken, getPaymentsForTrip);

export default router;