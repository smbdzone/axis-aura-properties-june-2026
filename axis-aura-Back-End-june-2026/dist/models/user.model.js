"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const AccessSchema = new mongoose_1.Schema({
    view: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
}, { _id: false });
const UserSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // plain text
    role: {
        type: String,
        enum: ['Super Admin', 'Maintenance', 'Marketing'],
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    profilePicture: { type: String },
    phone: { type: String },
    permissions: {
        dashboard: { type: AccessSchema, default: () => ({ view: false, edit: false }) },
        properties: { type: AccessSchema, default: () => ({ view: false, edit: false }) },
        newsAndRegulations: { type: AccessSchema, default: () => ({ view: false, edit: false }) },
        developers: { type: AccessSchema, default: () => ({ view: false, edit: false }) },
        careers: { type: AccessSchema, default: () => ({ view: false, edit: false }) },
        jobApplications: { type: AccessSchema, default: () => ({ view: false, edit: false }) },
        comments: { type: AccessSchema, default: () => ({ view: false, edit: false }) },
        faqs: { type: AccessSchema, default: () => ({ view: false, edit: false }) },
        manageUsers: { type: AccessSchema, default: () => ({ view: false, edit: false }) },
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model('User', UserSchema);
