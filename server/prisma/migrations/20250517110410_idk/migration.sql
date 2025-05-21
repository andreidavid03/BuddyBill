/*
  Warnings:

  - You are about to drop the `Friend` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `friendId` on the `ExpenseParticipant` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Friend";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_TripUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TripUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Trip" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TripUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tripId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentType" TEXT,
    "paidById" TEXT NOT NULL,
    CONSTRAINT "Expense_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Expense" ("amount", "createdAt", "description", "id", "isPaid", "paidById", "paymentType", "tripId", "userId") SELECT "amount", "createdAt", "description", "id", "isPaid", "paidById", "paymentType", "tripId", "userId" FROM "Expense";
DROP TABLE "Expense";
ALTER TABLE "new_Expense" RENAME TO "Expense";
CREATE TABLE "new_ExpenseParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expenseId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    CONSTRAINT "ExpenseParticipant_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ExpenseParticipant" ("amount", "expenseId", "id") SELECT "amount", "expenseId", "id" FROM "ExpenseParticipant";
DROP TABLE "ExpenseParticipant";
ALTER TABLE "new_ExpenseParticipant" RENAME TO "ExpenseParticipant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_TripUsers_AB_unique" ON "_TripUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_TripUsers_B_index" ON "_TripUsers"("B");
