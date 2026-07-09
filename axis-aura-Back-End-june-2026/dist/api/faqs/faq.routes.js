"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const faq_controller_1 = require("./faq.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
// Public: anyone can read FAQs (shown on the public site)
router.get('/', faq_controller_1.getFaqs);
// Super Admin only: manage FAQs from the dashboard
router.post('/', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, faq_controller_1.createFaq);
router.post('/bulk', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, faq_controller_1.createFaqsBulk);
router.put('/:id', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, faq_controller_1.updateFaq);
router.delete('/:id', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, faq_controller_1.deleteFaq);
exports.default = router;
