"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
router.post('/login', auth_controller_1.loginAdmin);
router.post('/bootstrap', auth_controller_1.bootstrapSuperAdmin);
router.post('/register', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, auth_controller_1.registerAdmin);
router.post('/logout', auth_controller_1.logoutAdmin);
router.get('/me', auth_controller_1.getAdminProfile);
exports.default = router;
