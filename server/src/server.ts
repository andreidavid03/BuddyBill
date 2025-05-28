// server/src/server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import expenseRoutes from "./routes/expense.routes"; // Păstrează dacă ai rute globale de expense
import balanceRoutes from "./routes/balance.routes";
import transactionRoutes from "./routes/transaction.routes";
import paymentRoutes from "./routes/payment.routes";
import notificationRoutes from "./routes/notification.routes";
import tripRoutes from "./routes/trip.routes";
import statusRoutes from "./routes/status.routes";
import friendRoutes from "./routes/friend.routes";

dotenv.config();
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/expenses", expenseRoutes); // Poți elimina asta dacă toate rutele de expenses sunt sub /trips/:id/expenses
app.use("/balances", balanceRoutes);
app.use("/transactions", transactionRoutes);
app.use("/payments", paymentRoutes);
app.use("/notifications", notificationRoutes);
app.use("/trips", tripRoutes);
app.use("/status", statusRoutes);
app.use("/friends", friendRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});