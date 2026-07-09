import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGO_URI || '';

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error(
      'If using mobile hotspot, add your current public IP in MongoDB Atlas Network Access (or temporarily allow 0.0.0.0/0).'
    );
    process.exit(1);
  }
};
