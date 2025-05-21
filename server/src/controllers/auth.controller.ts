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

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Verifică dacă utilizatorul există
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    // Verifică dacă parola este corectă
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    // Generează token-ul JWT
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Returnează token-ul JWT în răspuns
    res.json({ token, refreshToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Validare simplă a datelor de intrare
  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  // Verifică dacă adresa de email este validă
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Invalid email address" });
    return;
  }

  // Verifică dacă parola respectă anumite criterii de complexitate
  if (password.length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters long" });
    return;
  }

  try {
    // Verifică dacă utilizatorul există deja
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Generează salt-ul și hash-ul parolei
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creează utilizatorul în baza de date
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Generează token-ul JWT
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Returnează token-ul JWT în răspuns
    res.status(201).json({ token, refreshToken });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token is required" });
    return;
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };

    // Generate a new JWT token
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