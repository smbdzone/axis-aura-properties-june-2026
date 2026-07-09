import mongoose, { Schema, Document } from 'mongoose';

// -------------------------
// Interfaces
// -------------------------
interface Feature {
  id: string;
  icon: string;
  iconName: string;
  title: string;
  isSelected: boolean;
}

interface PaymentPlan {
  heading: string;
  subText: string;
}

interface PaymentPlanGroup {
  [planType: string]: PaymentPlan[];
}

interface FAQ {
  question: string;
  answer: string;
}

interface UnitVariant {
  variantName: string;
  image: string;
}

interface UnitImageData {
  image: string;
  variants?: UnitVariant[];
}

interface FloorData {
  defaultLayout: string;
  unitImages: Map<string, UnitImageData>;
  selectedUnitTypes: string[];
}

export interface IProperty extends Document {
  title: string;
  slug?: string;
  area: string;
  price: string;
  mainVideoUrl: string;
  developer: string;
  type: string;
  location?: string;
  layoutType?: string;
  images: string[];

  brochureFile?: string;
  paymentPlans: PaymentPlanGroup;
  faqs: FAQ[];
  quarter: string;
  year: string;

  amenities: Feature[];
  access: Feature[];
  views: Feature[];

  description: string;
  mapUrl?: string;
  longitude?: string;
  latitude?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  seoSchema?: string;
  canonicalUrl?: string;
  overview?: string;
  status?: 'active' | 'inactive';
  featured?: boolean;
  mostLuxurious?: boolean;

  numFloors: number;
  floors: Map<number, FloorData>;
}

// -------------------------
// Sub Schemas
// -------------------------
const FeatureSchema = new Schema<Feature>(
  {
    id: String,
    iconName: String,
    icon: String,
    title: String,
    isSelected: Boolean,
  },
  { _id: false }
);

const PaymentPlanSchema = new Schema<PaymentPlan>(
  {
    heading: String,
    subText: String,
  },
  { _id: false }
);

const FAQSchema = new Schema<FAQ>(
  {
    question: String,
    answer: String,
  },
  { _id: false }
);

const UnitVariantSchema = new Schema<UnitVariant>(
  {
    variantName: String,
    image: String,
  },
  { _id: false }
);

const UnitImageDataSchema = new Schema<UnitImageData>(
  {
    image: String,
    variants: [UnitVariantSchema],
  },
  { _id: false }
);

const FloorDataSchema = new Schema<FloorData>(
  {
    defaultLayout: String,

    // ✅ This is how we handle dynamic keys like "Studio", "2 BHK", etc.
    unitImages: {
      type: Map,
      of: UnitImageDataSchema,
      default: {},
    },

    selectedUnitTypes: [String],
  },
  { _id: false }
);

// -------------------------
// Main Schema
// -------------------------
const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    slug: { type: String },
    area: { type: String, required: true },
    price: { type: String, required: true },
    mainVideoUrl: { type: String, default: '' },
    developer: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String },
    layoutType: { type: String },
    images: [{ type: String }],

    brochureFile: { type: String },
    quarter: { type: String, default: '' },
    year: { type: String, default: '' },

    paymentPlans: {
      type: Map,
      of: [PaymentPlanSchema],
      default: {},
    },

    faqs: [FAQSchema],

    amenities: [FeatureSchema],
    access: [FeatureSchema],
    views: [FeatureSchema],

    description: { type: String, default: '' },
    mapUrl: { type: String },
    longitude: { type: String },
    latitude: { type: String },
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoImage: { type: String },
    seoSchema: { type: String },
    canonicalUrl: { type: String },
    overview: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    featured: { type: Boolean, default: false },
    mostLuxurious: { type: Boolean, default: false },

    numFloors: { type: Number, default: 1 },

    floors: {
      type: Map,
      of: FloorDataSchema,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProperty>('Property', PropertySchema);
