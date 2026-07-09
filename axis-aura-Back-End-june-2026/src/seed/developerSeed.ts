import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Developer from '../models/developer.model';

dotenv.config();

/**
 * NOTE ON LOGOS:
 * These use free placeholder logo URLs (placehold.co). Replace them later by
 * re-uploading each developer logo via the dashboard so they are stored as
 * Cloudinary URLs. The developer titles must match the `developer` field used
 * on the seeded properties so project counts are computed correctly.
 */

type SeedDeveloper = {
  title: string;
  logoUrl: string;
  description: string;
};

const logo = (label: string) =>
  `https://placehold.co/250x75/003049/ffffff?text=${encodeURIComponent(label)}`;

const developers: SeedDeveloper[] = [
  {
    title: 'Emaar',
    logoUrl: logo('EMAAR'),
    description:
      'Emaar Properties is one of the world\'s most valuable real estate developers, behind iconic Dubai landmarks such as Burj Khalifa, The Dubai Mall, and Downtown Dubai.',
  },
  {
    title: 'Nakheel',
    logoUrl: logo('NAKHEEL'),
    description:
      'Nakheel is a master developer renowned for transformative waterfront communities including Palm Jumeirah, The World Islands, and Jumeirah Village Circle.',
  },
  {
    title: 'Sobha',
    logoUrl: logo('SOBHA'),
    description:
      'Sobha Realty is a luxury developer celebrated for its backward-integrated model and meticulous craftsmanship, delivering premium communities like Sobha Hartland.',
  },
  {
    title: 'Damac',
    logoUrl: logo('DAMAC'),
    description:
      'DAMAC Properties is a leading luxury developer in the Middle East, known for branded residences and landmark projects across Dubai and the wider region.',
  },
  {
    title: 'Meraas',
    logoUrl: logo('MERAAS'),
    description:
      'Meraas is a Dubai-based developer shaping lifestyle destinations such as City Walk, Bluewaters, and Jumeirah Bay Island with a focus on design and experience.',
  },
  {
    title: 'DMCC',
    logoUrl: logo('DMCC'),
    description:
      'DMCC is the world\'s leading free zone and Government of Dubai Authority on commodities trade, home to the vibrant Jumeirah Lakes Towers business district.',
  },
  {
    title: 'Binghatti',
    logoUrl: logo('BINGHATTI'),
    description:
      'Binghatti Developers is an Emirati developer recognised for distinctive architecture and fast-tracked delivery across Dubai\'s key investment districts.',
  },
  {
    title: 'Meydan',
    logoUrl: logo('MEYDAN'),
    description:
      'Meydan is a visionary developer behind the Meydan district, blending world-class sporting, residential, and commercial destinations in the heart of Dubai.',
  },
];

async function run() {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.error('MONGO_URI is not configured in .env');
    process.exit(1);
  }

  await mongoose.connect(mongoURI);
  console.log('Connected to MongoDB for developer seeding.');

  let created = 0;
  let updated = 0;

  for (const developer of developers) {
    const result = await Developer.updateOne(
      { title: developer.title },
      { $set: developer },
      { upsert: true },
    );

    if (result.upsertedCount && result.upsertedCount > 0) {
      created += 1;
    } else if (result.modifiedCount && result.modifiedCount > 0) {
      updated += 1;
    }
  }

  console.log(
    `Developer seed complete. Created: ${created}, Updated: ${updated}, Total: ${developers.length}.`,
  );
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((error) => {
  console.error('Developer seeding failed:', error);
  process.exit(1);
});
