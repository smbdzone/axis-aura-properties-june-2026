"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const submitApplication_controller_1 = require("./submitApplication.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
// Public: anyone can submit a job application
router.post('/', submitApplication_controller_1.upload, submitApplication_controller_1.submitApplication);
// Super Admin only: view and manage received applications
router.get('/', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, submitApplication_controller_1.getApplications);
router.delete('/:id', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, submitApplication_controller_1.deleteApplication);
router.post('/bulk-delete', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, submitApplication_controller_1.bulkDeleteApplications);
exports.default = router;
