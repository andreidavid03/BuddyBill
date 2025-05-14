import express from "express";
import { calculateBalances } from "../controllers/balance.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();

// Endpoint pentru calcularea balanțelor într-un grup
router.get("/:groupId", verifyToken, calculateBalances);

export default router;
