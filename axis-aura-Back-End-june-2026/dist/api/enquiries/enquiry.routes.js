"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enquiry_controller_1 = require("./enquiry.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
// Public: anyone can submit an enquiry and read the available options
router.post('/', enquiry_controller_1.submitEnquiries);
router.get('/options', enquiry_controller_1.getEnquiryOptions);
// Super Admin only: view and manage received enquiries
router.get('/', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, enquiry_controller_1.getAllEnquiries);
router.delete('/:id', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, enquiry_controller_1.deleteEnquiry);
router.post('/bulk-delete', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, enquiry_controller_1.bulkDeleteEnquiries);
exports.default = router;
