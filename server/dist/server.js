"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const group_routes_1 = __importDefault(require("./routes/group.routes"));
const expense_routes_1 = __importDefault(require("./routes/expense.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rute
app.use("/api/auth", auth_routes_1.default);
app.use("/api/groups", group_routes_1.default);
app.use("/api/expenses", expense_routes_1.default);
app.get("/", (req, res) => {
    res.send("BuddyBill Backend is running!");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
