import express from "express";
import { calculateBalances } from "../controllers/balance.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();


router.get("/:groupId", verifyToken, calculateBalances);

export default router;
