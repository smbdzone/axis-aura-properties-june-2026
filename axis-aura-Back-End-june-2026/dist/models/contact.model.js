"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ContactSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
});
const ContactModel = mongoose_1.models.Contact || (0, mongoose_1.model)("Contact", ContactSchema);
exports.default = ContactModel;
