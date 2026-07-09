"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jobSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true, maxlength: 80 },
    description: { type: String, required: true },
    remunerationType: { type: String, enum: ['commission', 'salary'], required: true },
    commission: { type: String },
    salary: { type: String },
    salaryPeriod: { type: String, enum: ['day', 'month', 'annual'] },
    imageUrl: { type: String },
    level: {
        type: String,
        enum: ['Entry', 'Mid Level', 'Senior', 'Expert'],
        default: 'Entry',
    },
}, {
    timestamps: true
});
exports.Job = mongoose_1.default.model('Job', jobSchema);
