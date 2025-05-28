import express from "express";
import {
  getUserTransactions,
  getAllUserTransactions,
  getFilteredTransactions,
  getUnpaidTransactions,
} from "../controllers/transaction.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();


router.get("/", verifyToken, getAllUserTransactions);
router.get("/:groupId", verifyToken, getUserTransactions);
router.get("/:groupId/user/:userId", verifyToken, getFilteredTransactions);
router.get("/unpaid", verifyToken, getUnpaidTransactions);

export default router;
