/*
  Warnings:

  - Added the required column `userId` to the `ExpenseParticipant` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExpenseParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expenseId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "ExpenseParticipant_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ExpenseParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ExpenseParticipant" ("amount", "expenseId", "id") SELECT "amount", "expenseId", "id" FROM "ExpenseParticipant";
DROP TABLE "ExpenseParticipant";
ALTER TABLE "new_ExpenseParticipant" RENAME TO "ExpenseParticipant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
