import express from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { deleteExpense, updateExpense } from "../controllers/expense.controller";

const router = express.Router();

router.delete("/:expenseId", verifyToken, deleteExpense);
router.patch("/:expenseId", verifyToken, updateExpense);

export default router;
