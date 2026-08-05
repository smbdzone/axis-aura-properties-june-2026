import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string; // bcrypt hash — never store or accept plaintext
  role: string;
  status: 'active' | 'inactive';
  profilePicture?: string;
  permissions: Record<
    | 'dashboard'
    | 'properties'
    | 'newsAndRegulations'
    | 'developers'
    | 'careers'
    | 'jobApplications'
    | 'comments'
    | 'faqs'
    | 'manageUsers',
    { view: boolean; edit: boolean }
  >;
}

const AccessSchema = new Schema(
  {
    view: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
  },
  { _id: false }
);

const UserSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: true }, // bcrypt hash
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
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
