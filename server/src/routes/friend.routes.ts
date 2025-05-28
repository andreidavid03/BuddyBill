import express from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getFriends,
  getPendingFriendRequests,
} from "../controllers/friend.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/request", verifyToken, sendFriendRequest);
router.post("/:id/accept", verifyToken, acceptFriendRequest);
router.post("/:id/decline", verifyToken, declineFriendRequest);
router.get("/", verifyToken, getFriends);
router.get("/requests", verifyToken, getPendingFriendRequests);


export default router;