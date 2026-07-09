import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Article } from '../models/article.model';

dotenv.config();

/**
 * NOTE ON IMAGES:
 * These use free/open remote image URLs (Unsplash) as placeholders. Replace them
 * later by re-uploading each banner via the dashboard so they are stored as
 * Cloudinary URLs in the database.
 */

type SeedArticle = {
  title: string;
  slug: string;
  category: 'News' | 'Regulations' | 'Announcements' | 'Properties' | 'General News';
  status: 'active' | 'inactive';
  canonicalUrl: string;
  bannerUrl: string;
  description: string;
  imageAlt: string;
  seoTitle: string;
  seoDescription: string;
  seoImageUrl: string;
  articleSchemas: unknown[];
};

// Force a fixed landscape crop so banners/thumbnails fill their frames evenly.
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=entropy&w=1200&h=900&q=80`;

const richText = (paragraphs: string[]) =>
  paragraphs.map((p) => `<p>${p}</p>`).join('');

const articles: SeedArticle[] = [
  {
    title: 'Dubai Property Market Hits Record Highs in 2026',
    slug: 'dubai-property-market-record-highs-2026',
    category: 'General News',
    status: 'active',
    canonicalUrl: '',
    bannerUrl: img('1512453979798-5ea266f8880c'),
    description: richText([
      "Dubai's real estate sector continues its remarkable growth, with transaction volumes reaching record highs in the first half of 2026.",
      'Strong foreign investment, tax-free returns, and a steady stream of premium new launches have kept demand robust across both residential and commercial segments.',
      'Analysts point to sustained population growth and investor-friendly reforms as the key drivers behind the current cycle.',
    ]),
    imageAlt: 'Dubai skyline at sunset',
    seoTitle: 'Dubai Property Market Hits Record Highs in 2026',
    seoDescription:
      "An overview of Dubai's record-breaking real estate performance in 2026 and the factors driving demand.",
    seoImageUrl: img('1512453979798-5ea266f8880c'),
    articleSchemas: [],
  },
  {
    title: 'New Golden Visa Rules Expand Options for Property Investors',
    slug: 'golden-visa-rules-expand-property-investors',
    category: 'Regulations',
    status: 'active',
    canonicalUrl: '',
    bannerUrl: img('1554469384-e58fac16e23a'),
    description: richText([
      'The UAE has updated its Golden Visa framework, making long-term residency more accessible to property investors.',
      'Under the revised rules, qualifying real estate investments now unlock renewable 10-year residency for investors and their families, with simplified documentation.',
      'The move is expected to further strengthen international appetite for Dubai property.',
    ]),
    imageAlt: 'Modern Dubai residential towers',
    seoTitle: 'New Golden Visa Rules for Property Investors',
    seoDescription:
      "How the UAE's updated Golden Visa rules benefit real estate investors and their families.",
    seoImageUrl: img('1554469384-e58fac16e23a'),
    articleSchemas: [],
  },
  {
    title: 'RERA Introduces Stricter Escrow Compliance for Off-Plan Sales',
    slug: 'rera-stricter-escrow-compliance-off-plan',
    category: 'Regulations',
    status: 'active',
    canonicalUrl: '',
    bannerUrl: img('1486406146926-c627a92ad1ab'),
    description: richText([
      'The Real Estate Regulatory Agency (RERA) has rolled out stricter escrow account rules for off-plan property sales.',
      'The new benchmarks are designed to protect buyer funds, reduce project delays, and filter out under-capitalised developers.',
      'Buyers are advised to work only with fully verified developers to ensure their investments remain protected throughout construction.',
    ]),
    imageAlt: 'Construction cranes over a new development',
    seoTitle: 'RERA Tightens Escrow Rules for Off-Plan Sales',
    seoDescription:
      "What RERA's stricter escrow compliance means for off-plan buyers and developers in Dubai.",
    seoImageUrl: img('1486406146926-c627a92ad1ab'),
    articleSchemas: [],
  },
  {
    title: 'Palm Jumeirah Sees Surge in Ultra-Luxury Villa Demand',
    slug: 'palm-jumeirah-ultra-luxury-villa-demand',
    category: 'Properties',
    status: 'active',
    canonicalUrl: '',
    bannerUrl: img('1613490493576-7fde63acd811'),
    description: richText([
      'Ultra-luxury villas on Palm Jumeirah are commanding record prices as global high-net-worth buyers compete for a limited supply of beachfront homes.',
      'Branded residences and signature villas with private beach access remain the most sought-after assets in the segment.',
      'Experts expect the trend to continue as Dubai cements its position as a global hub for luxury living.',
    ]),
    imageAlt: 'Luxury beachfront villa with pool',
    seoTitle: 'Palm Jumeirah Ultra-Luxury Villa Demand Surges',
    seoDescription:
      'Why ultra-luxury villas on Palm Jumeirah are attracting record demand from global buyers.',
    seoImageUrl: img('1613490493576-7fde63acd811'),
    articleSchemas: [],
  },
  {
    title: 'Business Bay Emerges as a Top Commercial Investment Hotspot',
    slug: 'business-bay-top-commercial-investment-hotspot',
    category: 'Properties',
    status: 'active',
    canonicalUrl: '',
    bannerUrl: img('1497366216548-37526070297c'),
    description: richText([
      'Business Bay is fast becoming one of Dubai\'s most attractive commercial investment destinations, thanks to its central location and Grade-A office stock.',
      'Investors are drawn by strong rental yields, excellent connectivity, and proximity to Downtown Dubai.',
      'Demand for flexible, fitted office space is particularly strong among regional headquarters and growing enterprises.',
    ]),
    imageAlt: 'Modern office interior in Business Bay',
    seoTitle: 'Business Bay: Top Commercial Investment Hotspot',
    seoDescription:
      "An overview of Business Bay's rise as a leading commercial real estate destination in Dubai.",
    seoImageUrl: img('1497366216548-37526070297c'),
    articleSchemas: [],
  },
  {
    title: 'Axis Aura Launches New Portfolio of Handpicked Dubai Properties',
    slug: 'axis-aura-new-portfolio-handpicked-properties',
    category: 'General News',
    status: 'active',
    canonicalUrl: '',
    bannerUrl: img('1560518883-ce09059eeffa'),
    description: richText([
      'Axis Aura Real Estate has unveiled a curated portfolio of handpicked residential and commercial properties across Dubai\'s most sought-after communities.',
      'Each listing is backed by trusted developer partnerships, commission-free deals, and flexible payment plans.',
      'The launch reinforces Axis Aura\'s commitment to making premium Dubai real estate accessible to local and international buyers alike.',
    ]),
    imageAlt: 'Real estate agent presenting a property',
    seoTitle: 'Axis Aura Launches New Dubai Property Portfolio',
    seoDescription:
      'Axis Aura introduces a curated portfolio of premium Dubai properties with exclusive buyer benefits.',
    seoImageUrl: img('1560518883-ce09059eeffa'),
    articleSchemas: [],
  },
];

async function run() {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.error('MONGO_URI is not configured in .env');
    process.exit(1);
  }

  await mongoose.connect(mongoURI);
  console.log('Connected to MongoDB for article (News & Regulations) seeding.');

  let created = 0;
  let updated = 0;

  for (const article of articles) {
    const result = await Article.updateOne(
      { slug: article.slug },
      { $set: article },
      { upsert: true },
    );

    if (result.upsertedCount && result.upsertedCount > 0) {
      created += 1;
    } else if (result.modifiedCount && result.modifiedCount > 0) {
      updated += 1;
    }
  }

  console.log(
    `Article seed complete. Created: ${created}, Updated: ${updated}, Total: ${articles.length}.`,
  );
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((error) => {
  console.error('Article seeding failed:', error);
  process.exit(1);
});
