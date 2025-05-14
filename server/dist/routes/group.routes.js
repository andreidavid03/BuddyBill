"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const group_controller_1 = require("../controllers/group.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Aplicăm middleware-ul `verifyToken`
router.post("/create", auth_middleware_1.verifyToken, group_controller_1.createGroup);
router.get("/", auth_middleware_1.verifyToken, group_controller_1.getGroups);
exports.default = router;
