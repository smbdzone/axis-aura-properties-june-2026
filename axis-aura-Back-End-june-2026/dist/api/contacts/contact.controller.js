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
exports.bulkDeleteContacts = exports.deleteContact = exports.getAllContacts = exports.submitContact = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const contact_model_1 = __importDefault(require("../../models/contact.model"));
const submitContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, phone, subject, message } = req.body;
        if (!fullName || !email || !message) {
            res.status(400).json({ message: 'Please provide your name, email, and message.' });
            return;
        }
        const newContact = new contact_model_1.default({
            fullName,
            email,
            phone,
            subject,
            message,
        });
        yield newContact.save();
        // Best-effort email notifications; never block the submission on email failures
        try {
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                const transporter = nodemailer_1.default.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });
                const userMailPromise = transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'We have received your message - AXIS AURA',
                    text: `Hi ${fullName},

Thank you for reaching out to AXIS AURA. We have received your message and our team will get back to you shortly.

Your message:
${message}

Best regards,
AXIS AURA`,
                });
                const adminMailPromise = transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
                    subject: `New Contact Message: ${fullName}`,
                    text: `A new contact message has been submitted.

Name: ${fullName}
Email: ${email}
Phone: ${phone || '-'}
Subject: ${subject || '-'}
Message: ${message}`,
                });
                yield Promise.all([userMailPromise, adminMailPromise]);
            }
        }
        catch (mailError) {
            console.error('Contact email notification failed:', mailError);
        }
        res.status(201).json({ message: 'Message sent successfully', contact: newContact });
    }
    catch (error) {
        console.error('Submit Contact Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.submitContact = submitContact;
const getAllContacts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contacts = yield contact_model_1.default.find().sort({ date: -1 });
        res.json(contacts);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getAllContacts = getAllContacts;
const deleteContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield contact_model_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            res.status(404).json({ message: 'Contact message not found' });
            return;
        }
        res.status(200).json({ message: 'Contact message deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteContact = deleteContact;
const bulkDeleteContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const ids = Array.isArray((_a = req.body) === null || _a === void 0 ? void 0 : _a.ids) ? req.body.ids : [];
        if (!ids.length) {
            res.status(400).json({ message: 'No contact ids provided' });
            return;
        }
        yield contact_model_1.default.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: 'Contact messages deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.bulkDeleteContacts = bulkDeleteContacts;
