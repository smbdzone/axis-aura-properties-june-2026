"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contact_controller_1 = require("./contact.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
// Public: anyone can send a contact message
router.post('/', contact_controller_1.submitContact);
// Super Admin only: view and manage received messages
router.get('/', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, contact_controller_1.getAllContacts);
router.delete('/:id', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, contact_controller_1.deleteContact);
router.post('/bulk-delete', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, contact_controller_1.bulkDeleteContacts);
exports.default = router;
