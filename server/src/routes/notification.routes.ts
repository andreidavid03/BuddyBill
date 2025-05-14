import express from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { markNotificationAsRead } from "../controllers/notification.controller";

const router = express.Router();

router.patch("/:notificationId/read", verifyToken, markNotificationAsRead);

export default router;
