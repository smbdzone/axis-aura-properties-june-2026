import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Faq } from '../models/faq.model';

dotenv.config();

type SeedFaq = { question: string; answer: string; category: string };

const faqs: SeedFaq[] = [
  {
    category: 'Property Related',
    question: 'What makes Axis Aura Real Estate unique in Dubai’s property market?',
    answer:
      'We focus on offering a seamless experience through partnerships with top developers in Dubai. Our clients enjoy exclusive benefits like commission-free deals, developer-backed interest-free payment plans, guaranteed ROI during the construction phase (for upfront buyers), and premium properties with luxury amenities.',
  },
  {
    category: 'Property Related',
    question: 'Are the properties ready to move in or under construction?',
    answer:
      'We offer both ready-to-move-in and off-plan properties across Dubai. Our team will guide you based on your timeline, investment goals, and preferred payment structure.',
  },
  {
    category: 'Property Related',
    question: 'What types of properties do you offer?',
    answer:
      'Our portfolio includes apartments, villas, townhouses, penthouses, and commercial spaces in prime Dubai locations, sourced from trusted developers.',
  },
  {
    category: 'Property Related',
    question: 'How do I start the property purchase process?',
    answer:
      'Contact our team to book a consultation. We will shortlist properties matching your goals, arrange viewings, and support you through reservation, documentation, and handover.',
  },
  {
    category: 'Privacy Related',
    question: 'What is the guaranteed ROI offer, and how does it work?',
    answer:
      'Eligible upfront buyers on selected off-plan projects can receive guaranteed returns during the construction period, as outlined in the developer agreement. Terms vary by project—we explain all conditions before you commit.',
  },
  {
    category: 'Privacy Related',
    question: 'Do I pay any commission if I buy a property through Axis Aura Real Estate?',
    answer:
      'No. Buyers do not pay commission on properties purchased through Axis Aura Real Estate. Our developer partnerships allow us to offer this benefit directly to our clients.',
  },
  {
    category: 'Privacy Related',
    question: 'Do you help with legal or documentation processes for property purchases?',
    answer:
      'Yes. We coordinate with developers, banks, and legal partners to guide you through SPA signing, Oqood registration, NOCs, and final transfer at the Dubai Land Department.',
  },
  {
    category: 'Privacy Related',
    question: 'Are flexible payment plans available for all properties?',
    answer:
      'Most off-plan projects include developer-backed payment plans. Availability and terms depend on the specific property and developer—our advisors will outline every option for your shortlisted units.',
  },
  {
    category: 'International Related',
    question: 'Can international investors purchase properties through Axis Aura Real Estate?',
    answer:
      'Yes. Dubai allows foreign nationals to own freehold property in designated areas. We assist international clients with remote consultations, documentation, and end-to-end purchase support.',
  },
  {
    category: 'International Related',
    question: 'What support do international buyers get in Dubai’s property market?',
    answer:
      'International clients benefit from our dedicated overseas buyer support, multilingual advisors, virtual viewings, and streamlined remote documentation—alongside the same commission-free developer deals available to local buyers.',
  },
  {
    category: 'International Related',
    question: 'Can I purchase property remotely without visiting Dubai?',
    answer:
      'Yes. We support remote buyers with virtual tours, video consultations, digital documentation, and power-of-attorney arrangements where required, so you can complete your purchase from abroad.',
  },
  {
    category: 'International Related',
    question: 'What documents do international buyers need to complete a purchase?',
    answer:
      'Typically you will need a valid passport, proof of address, and Emirates ID if you are a UAE resident. Our team provides a tailored checklist based on your nationality and the developer’s requirements.',
  },
];

async function run() {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.error('MONGO_URI is not configured in .env');
    process.exit(1);
  }

  await mongoose.connect(mongoURI);
  console.log('Connected to MongoDB for FAQ seeding.');

  let created = 0;
  let updated = 0;

  for (const faq of faqs) {
    const result = await Faq.updateOne(
      { question: faq.question },
      { $set: { answer: faq.answer, category: faq.category } },
      { upsert: true },
    );

    if (result.upsertedCount && result.upsertedCount > 0) {
      created += 1;
    } else if (result.modifiedCount && result.modifiedCount > 0) {
      updated += 1;
    }
  }

  console.log(`FAQ seed complete. Created: ${created}, Updated: ${updated}, Total in seed: ${faqs.length}`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((error) => {
  console.error('FAQ seeding failed:', error);
  process.exit(1);
});
