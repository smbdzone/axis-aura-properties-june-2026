import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IContact extends Document {
  fullName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  date: Date;
}

const ContactSchema = new Schema<IContact>({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const ContactModel = models.Contact || model<IContact>("Contact", ContactSchema);

export default ContactModel;
