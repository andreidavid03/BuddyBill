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
exports.getGroups = exports.createGroup = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Creare grup
const createGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const userId = req.userId;
    try {
        const group = yield prisma.group.create({
            data: {
                name,
                members: {
                    connect: { id: userId },
                },
            },
        });
        res.status(201).json({ message: "Group created", group });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.createGroup = createGroup;
// Listare grupuri
const getGroups = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const groups = yield prisma.group.findMany({
            where: {
                members: {
                    some: { id: userId },
                },
            },
        });
        res.json(groups);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getGroups = getGroups;
