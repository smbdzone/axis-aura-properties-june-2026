import mongoose, { Schema, Document } from "mongoose";

export interface IJobApplication extends Document {
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  position: string;
  experience?: string;
  coverLetter: string;
  resume?: string;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    fullName: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    position: { type: String, required: true },
    experience: { type: String },
    coverLetter: { type: String, default: "" },
    resume: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IJobApplication>("JobApplication", JobApplicationSchema);
