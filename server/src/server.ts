import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import expenseRoutes from "./routes/expense.routes";
import balanceRoutes from "./routes/balance.routes";
import transactionRoutes from "./routes/transaction.routes";
import paymentRoutes from "./routes/payment.routes";
import notificationRoutes from "./routes/notification.routes";
import tripRoutes from "./routes/trip.routes"; // Import trip routes
import statusRoutes from "./routes/status.routes"; // Import status routes

dotenv.config();
const app = express();

// Configure CORS
const corsOptions = {
  origin: "http://localhost:5173", // URL-ul clientului tău
  credentials: true, // Permite trimiterea cookie-urilor
  optionsSuccessStatus: 200, // Unele browsere au nevoie de asta pentru a funcționa corect
};

app.use(cors(corsOptions));
app.use(express.json());

// Rute
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/balances", balanceRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/trips", tripRoutes); // Use trip routes
app.use("/api/status", statusRoutes); // Use status routes

app.get("/", (req, res) => {
  res.send("BuddyBill Backend is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});