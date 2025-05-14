import express from "express";
import { markAsPaid } from "../controllers/payment.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();

// Setare cheltuială ca plătită
router.patch("/:expenseId/pay", verifyToken, markAsPaid);

export default router;
