import { Router } from "express";
// Poți păstra importurile, dar rutele care nu sunt necesare vor fi eliminate
// import { createExpense, getExpensesForTrip } from "../controllers/expense.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

// Rutele de mai jos sunt acum gestionate sub "/trips/:id/expenses" în trip.routes.ts
// router.post("/trips/:tripId/expenses", verifyToken, createExpense);
// router.get("/trips/:tripId/expenses", verifyToken, getExpensesForTrip);

// Păstrează doar rutele specifice pentru "expenses" care NU sunt legate de un trip specific,
// sau lasă acest fișier gol dacă toate rutele de cheltuieli sunt legate de trip-uri.
// Exemplu (dacă ai nevoie de ele):
// router.get("/", verifyToken, getAllExpenses); // O rută pentru a obține toate cheltuielile din toate trip-urile
// router.get("/:expenseId", verifyToken, getExpenseById); // O rută pentru a obține o cheltuială individuală

export default router;
