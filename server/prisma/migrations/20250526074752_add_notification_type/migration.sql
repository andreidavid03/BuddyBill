-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL DEFAULT 'GENERAL', -- AICI e cu DEFAULT
    "userId" TEXT NOT NULL,
    "expenseId" TEXT,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Notification_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

INSERT INTO "new_Notification" ("id", "message", "createdAt", "isRead", "userId", "expenseId", "type")
SELECT "id", "message", "createdAt", "isRead", "userId", "expenseId", 'GENERAL' -- aici punem default-ul la type!
FROM "Notification";

DROP TABLE "Notification";
ALTER TABLE "new_Notification" RENAME TO "Notification";

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
