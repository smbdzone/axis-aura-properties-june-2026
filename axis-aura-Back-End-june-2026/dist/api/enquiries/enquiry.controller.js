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
exports.getEnquiryOptions = exports.bulkDeleteEnquiries = exports.deleteEnquiry = exports.getAllEnquiries = exports.submitEnquiries = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const enquire_model_1 = __importDefault(require("../../models/enquire.model"));
const enquiryBudgets = ['500k - 1M', '1M - 2M', '2M - 4M', '4M+'];
const enquiryTypes = ['Residential', 'Commercial'];
const submitEnquiries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, phone, email, budget, type } = req.body;
        // Validate required fields
        if (!firstName || !phone || !email || !budget || !type) {
            res.status(400).json({ message: 'Please provide all required fields.' });
            return;
        }
        const newEnquiry = new enquire_model_1.default({
            firstName,
            lastName,
            phone,
            email,
            budget,
            type,
        });
        yield newEnquiry.save();
        const fullName = `${firstName}${lastName ? ` ${lastName}` : ''}`;
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
                // 1) Confirmation email to the user
                const userMailPromise = transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'We have received your enquiry - AXIS AURA',
                    text: `Hi ${firstName},

Thank you for contacting AXIS AURA. We have received your enquiry and our team will contact you shortly.

Your submitted details:
- Name: ${fullName}
- Phone: ${phone}
- Email: ${email}
- Budget: ${budget}
- Type: ${type}

Best regards,
AXIS AURA`,
                });
                // 2) Notification email to admin with enquiry details
                const adminMailPromise = transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
                    subject: `New Enquiry Received: ${fullName}`,
                    text: `A new enquiry has been submitted.

Name: ${fullName}
Phone: ${phone}
Email: ${email}
Budget: ${budget}
Type: ${type}`,
                });
                yield Promise.all([userMailPromise, adminMailPromise]);
            }
        }
        catch (mailError) {
            console.error('Enquiry email notification failed:', mailError);
        }
        res.status(201).json(newEnquiry);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.submitEnquiries = submitEnquiries;
const getAllEnquiries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enquiries = yield enquire_model_1.default.find();
        res.json(enquiries);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getAllEnquiries = getAllEnquiries;
const deleteEnquiry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield enquire_model_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            res.status(404).json({ message: 'Enquiry not found' });
            return;
        }
        res.status(200).json({ message: 'Enquiry deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteEnquiry = deleteEnquiry;
const bulkDeleteEnquiries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const ids = Array.isArray((_a = req.body) === null || _a === void 0 ? void 0 : _a.ids) ? req.body.ids : [];
        if (!ids.length) {
            res.status(400).json({ message: 'No enquiry ids provided' });
            return;
        }
        yield enquire_model_1.default.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: 'Enquiries deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.bulkDeleteEnquiries = bulkDeleteEnquiries;
const getEnquiryOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({
            budgets: enquiryBudgets,
            types: enquiryTypes,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getEnquiryOptions = getEnquiryOptions;
