import express from "express";
import { verifyToken } from "../middleware/auth.middleware";
import {
  getNotifications,
  markNotificationAsRead,
} from "../controllers/notification.controller";

const router = express.Router();


router.get("/", verifyToken, getNotifications);


router.patch("/:notificationId/read", verifyToken, markNotificationAsRead);

export default router;