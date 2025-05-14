"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expense_controller_1 = require("../controllers/expense.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Adăugare cheltuială
router.post("/add", auth_middleware_1.verifyToken, expense_controller_1.addExpense);
// Listare cheltuieli pentru un grup
router.get("/:groupId", auth_middleware_1.verifyToken, expense_controller_1.getExpenses);
exports.default = router;
