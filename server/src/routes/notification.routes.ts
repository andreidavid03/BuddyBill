import express from "express";
import { verifyToken } from "../middleware/auth.middleware";
import {
  getNotifications,
  markNotificationAsRead,
} from "../controllers/notification.controller";

const router = express.Router();

// Ruta pentru a obține toate notificările utilizatorului
router.get("/", verifyToken, getNotifications);

// Ruta pentru a marca o notificare ca citită
router.patch("/:notificationId/read", verifyToken, markNotificationAsRead);

export default router;