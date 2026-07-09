import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
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

export const Job = mongoose.model('Job', jobSchema);
