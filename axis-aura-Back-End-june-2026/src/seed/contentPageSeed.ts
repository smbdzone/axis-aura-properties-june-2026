import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { seedContentPages } from '../utils/seedContentPages';

dotenv.config();

async function run() {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.error('MONGO_URI is not configured in .env');
    process.exit(1);
  }

  await mongoose.connect(mongoURI);
  console.log('MongoDB connected for content page seeding');

  await seedContentPages();

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((error) => {
  console.error('Content page seeding failed:', error);
  process.exit(1);
});
