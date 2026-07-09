"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const newsletter_controller_1 = require("./newsletter.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public: anyone can subscribe to the newsletter
router.post('/', newsletter_controller_1.subscribeNewsletter);
// Super Admin only: view and manage subscribers
router.get('/', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, newsletter_controller_1.getNewsletterSubscribers);
router.delete('/:id', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, newsletter_controller_1.deleteNewsletterSubscriber);
router.post('/bulk-delete', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, newsletter_controller_1.bulkDeleteNewsletterSubscribers);
exports.default = router;
