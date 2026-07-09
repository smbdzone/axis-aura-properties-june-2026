"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkDeleteNewsletterSubscribers = exports.deleteNewsletterSubscriber = exports.getNewsletterSubscribers = exports.subscribeNewsletter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const email_model_1 = __importDefault(require("../../models/email.model"));
const subscribeNewsletter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ message: 'Please provide an email.' });
            return;
        }
        // Check if email already subscribed
        const existingSubscription = yield email_model_1.default.findOne({ email });
        if (existingSubscription) {
            res.status(400).json({ message: 'This email is already subscribed.' });
            return;
        }
        const newSubscription = new email_model_1.default({ email });
        yield newSubscription.save();
        const transporter = nodemailer_1.default.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const senderMailPromise = transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Newsletter subscription confirmed - Suits and Sand',
            text: `Hi,

Thanks for subscribing to the Suits and Sand newsletter.

You will receive the latest updates on listings, insights, and company news.

Best regards,
Suits and Sand`,
        });
        const receiverMailPromise = transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO || process.env.EMAIL_USER,
            subject: 'New Newsletter Subscription',
            text: `A new user subscribed to the newsletter.

Subscriber email: ${email}`,
        });
        yield Promise.all([senderMailPromise, receiverMailPromise]);
        res.status(201).json({ message: 'Subscribed successfully', subscription: newSubscription });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.subscribeNewsletter = subscribeNewsletter;
const getNewsletterSubscribers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscribers = yield email_model_1.default.find({}, { email: 1, date: 1 }).lean();
        const formattedSubscribers = subscribers.map(sub => ({
            id: String(sub._id),
            email: sub.email,
            date: new Date(sub.date).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }),
        }));
        res.status(200).json(formattedSubscribers);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getNewsletterSubscribers = getNewsletterSubscribers;
const deleteNewsletterSubscriber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield email_model_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            res.status(404).json({ message: 'Subscriber not found' });
            return;
        }
        res.status(200).json({ message: 'Subscriber deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteNewsletterSubscriber = deleteNewsletterSubscriber;
const bulkDeleteNewsletterSubscribers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const ids = Array.isArray((_a = req.body) === null || _a === void 0 ? void 0 : _a.ids) ? req.body.ids : [];
        if (!ids.length) {
            res.status(400).json({ message: 'No subscriber ids provided' });
            return;
        }
        yield email_model_1.default.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: 'Subscribers deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.bulkDeleteNewsletterSubscribers = bulkDeleteNewsletterSubscribers;
