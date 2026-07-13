"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contentPage_controller_1 = require("./contentPage.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/:slug', contentPage_controller_1.getContentPage);
router.put('/:slug', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, contentPage_controller_1.updateContentPage);
exports.default = router;
