import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshsupersecretkey123";

interface AuthRequest extends Request {
  userId?: string;
}

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
};

const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Invalid email address" });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters long" });
    return;
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.status(201).json({ token, refreshToken });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.json({ token, refreshToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token is required" });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };
    const token = generateToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);
    res.json({ token, refreshToken: newRefreshToken });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
