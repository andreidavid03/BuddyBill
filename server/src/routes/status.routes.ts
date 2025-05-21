import express from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { getStatus } from "../controllers/status.controller";

const router = express.Router();

router.get("/", verifyToken, getStatus);

export default router;