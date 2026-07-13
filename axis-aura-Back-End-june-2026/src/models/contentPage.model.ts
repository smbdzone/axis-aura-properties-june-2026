import mongoose from 'mongoose';

const contentSectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    paragraphs: [{ type: String, trim: true }],
    bullets: [{ type: String, trim: true }],
  },
  { _id: false }
);

const contentPageSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

export const ContentPage = mongoose.model('ContentPage', contentPageSchema);
