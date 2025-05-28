import express from "express";
import { register, login, refreshToken, getAllUsers, getCurrentUser } from "../controllers/auth.controller";
import { verifyToken, verifyRefreshToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", verifyRefreshToken, refreshToken);
router.get("/users", verifyToken, getAllUsers);
router.get("/me", verifyToken, getCurrentUser);

export default router;
