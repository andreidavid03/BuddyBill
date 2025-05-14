import express from "express";
import {
  getUserTransactions,
  getAllUserTransactions,
  getFilteredTransactions,
  getUnpaidTransactions,
} from "../controllers/transaction.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();

// ✅ Toate tranzacțiile unui utilizator în toate grupurile
router.get("/", verifyToken, getAllUserTransactions);

// ✅ Tranzacții per utilizator într-un grup
router.get("/:groupId", verifyToken, getUserTransactions);

// ✅ Filtrare tranzacții per utilizator într-un grup
router.get("/:groupId/user/:userId", verifyToken, getFilteredTransactions);

// ✅ Tranzacții neplătite per utilizator
router.get("/unpaid", verifyToken, getUnpaidTransactions);

export default router;
