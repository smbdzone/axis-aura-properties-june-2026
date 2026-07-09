"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Faq = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const faqSchema = new mongoose_1.default.Schema({
    question: {
        type: String,
        required: true,
        trim: true,
    },
    answer: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        trim: true,
        default: 'General',
    },
}, {
    timestamps: true,
});
exports.Faq = mongoose_1.default.model('Faq', faqSchema);
