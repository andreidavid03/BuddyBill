import express from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { deleteGroup } from "../controllers/group.controller";

const router = express.Router();

router.delete("/:groupId", verifyToken, deleteGroup);

export default router;
