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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFaq = exports.updateFaq = exports.createFaqsBulk = exports.createFaq = exports.getFaqs = void 0;
const faq_model_1 = require("../../models/faq.model");
const getFaqs = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const faqs = yield faq_model_1.Faq.find().sort({ createdAt: 1 });
        res.json(faqs);
    }
    catch (error) {
        console.error('Error in getFaqs:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getFaqs = getFaqs;
const createFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { question, answer, category } = req.body;
        if (!question || !answer) {
            res.status(400).json({ message: 'Question and answer are required.' });
            return;
        }
        const faq = yield faq_model_1.Faq.create({
            question,
            answer,
            category: (category === null || category === void 0 ? void 0 : category.trim()) || 'General',
        });
        res.status(201).json(faq);
    }
    catch (error) {
        console.error('Error in createFaq:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createFaq = createFaq;
const createFaqsBulk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = req.body;
        if (!Array.isArray(items) || items.length === 0) {
            res.status(400).json({ message: 'Request body must be a non-empty array.' });
            return;
        }
        const invalidIndex = items.findIndex((item) => !item ||
            typeof item.question !== 'string' ||
            !item.question.trim() ||
            typeof item.answer !== 'string' ||
            !item.answer.trim());
        if (invalidIndex !== -1) {
            res.status(400).json({
                message: `Invalid FAQ item at index ${invalidIndex}. Each item needs question and answer.`,
            });
            return;
        }
        const payload = items.map((item) => ({
            question: item.question.trim(),
            answer: item.answer.trim(),
            category: typeof item.category === 'string' && item.category.trim()
                ? item.category.trim()
                : 'General',
        }));
        const createdFaqs = yield faq_model_1.Faq.insertMany(payload);
        res.status(201).json({
            message: `${createdFaqs.length} FAQs created successfully.`,
            data: createdFaqs,
        });
    }
    catch (error) {
        console.error('Error in createFaqsBulk:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createFaqsBulk = createFaqsBulk;
const updateFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { question, answer, category } = req.body;
        const updateData = { question, answer };
        if (typeof category === 'string') {
            updateData.category = category.trim() || 'General';
        }
        const updatedFaq = yield faq_model_1.Faq.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updatedFaq) {
            res.status(404).json({ message: 'FAQ not found' });
            return;
        }
        res.json(updatedFaq);
    }
    catch (error) {
        console.error('Error in updateFaq:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateFaq = updateFaq;
const deleteFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedFaq = yield faq_model_1.Faq.findByIdAndDelete(id);
        if (!deletedFaq) {
            res.status(404).json({ message: 'FAQ not found' });
            return;
        }
        res.status(200).json({ message: 'FAQ deleted successfully' });
    }
    catch (error) {
        console.error('Error in deleteFaq:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteFaq = deleteFaq;
