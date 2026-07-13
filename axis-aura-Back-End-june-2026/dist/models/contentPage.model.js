"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentPage = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const contentSectionSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true, trim: true },
    paragraphs: [{ type: String, trim: true }],
    bullets: [{ type: String, trim: true }],
}, { _id: false });
const contentPageSchema = new mongoose_1.default.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        enum: ['privacy-policy', 'terms-and-conditions'],
    },
    introText: {
        type: String,
        trim: true,
        default: '',
    },
    hero: {
        title: { type: String, trim: true, default: '' },
        image: { type: String, trim: true, default: '' },
        imageAlt: { type: String, trim: true, default: '' },
    },
    sections: {
        type: [contentSectionSchema],
        default: [],
    },
}, {
    timestamps: true,
});
exports.ContentPage = mongoose_1.default.model('ContentPage', contentPageSchema);
