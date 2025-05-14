"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpenses = exports.addExpense = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Adăugare cheltuială
const addExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, description, groupId } = req.body;
    const userId = req.userId;
    try {
        const group = yield prisma.group.findUnique({
            where: { id: groupId },
            include: { members: true },
        });
        if (!group) {
            res.status(404).json({ message: "Group not found" });
            return;
        }
        const isMember = group.members.some(member => member.id === userId);
        if (!isMember) {
            res.status(403).json({ message: "Not a member of this group" });
            return;
        }
        const expense = yield prisma.expense.create({
            data: {
                amount,
                description,
                groupId,
            },
        });
        res.status(201).json({ message: "Expense added", expense });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.addExpense = addExpense;
// Listare cheltuieli
const getExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupId } = req.params;
    try {
        const expenses = yield prisma.expense.findMany({
            where: { groupId },
        });
        res.json(expenses);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getExpenses = getExpenses;
