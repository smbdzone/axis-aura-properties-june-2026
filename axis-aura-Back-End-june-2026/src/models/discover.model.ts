import mongoose, { Schema, Document } from 'mongoose';

export interface IDiscover extends Document {
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  order?: number;
}

const DiscoverSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model<IDiscover>('Discover', DiscoverSchema);
