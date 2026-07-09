"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const property_model_1 = __importDefault(require("../models/property.model"));
dotenv_1.default.config();
// Force a fixed landscape crop (w x h) so every image fills the card frame
// consistently regardless of the source photo's native aspect ratio.
const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=entropy&w=1200&h=900&q=80`;
const layoutImg = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=entropy&w=1000&h=750&q=80`;
// Curated open image ids (Unsplash) grouped by feel
const residentialImages = [
    '1568605114967-8130f3a36994',
    '1512917774080-9991f1c4c750',
    '1570129477492-45c003edd2be',
    '1600585154340-be6161a56a0c',
    '1600607687939-ce8a6c25118c',
    '1600596542815-ffad4c1539a9',
];
const commercialImages = [
    '1486406146926-c627a92ad1ab',
    '1497366216548-37526070297c',
    '1497366811353-6870744d04b2',
    '1454165804606-c3d57bc86b40',
    '1524758631624-e2822e304c36',
    '1541746972996-4e0b0f43e02a',
];
const luxuryImages = [
    '1613490493576-7fde63acd811',
    '1580587771525-78b9dba3b914',
    '1600047509807-ba8f99d2cdde',
    '1613977257363-707ba9348227',
    '1512453979798-5ea266f8880c',
];
const pick = (pool, start, count) => {
    const out = [];
    for (let i = 0; i < count; i += 1) {
        out.push(pool[(start + i) % pool.length]);
    }
    return out;
};
const feat = (title, icon) => ({
    id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    icon,
    iconName: icon,
    title,
    isSelected: true,
});
const residentialAmenities = [
    feat('Luxury & High-end Finishing', 'streamline:diamond-2-solid'),
    feat('GYM', 'game-icons:gym-bag'),
    feat('Central AC', 'ic:round-ac-unit'),
    feat('Swimming Pool', 'ph:swimming-pool-fill'),
    feat('CCTV Cameras', 'bxs:cctv'),
    feat('Kids Playground', 'mingcute:playground-fill'),
    feat('Covered Parking', 'mdi:car'),
    feat('24/7 Security', 'mdi:security'),
];
const commercialAmenities = [
    feat('High-Speed Elevators', 'mdi:elevator'),
    feat('Central AC', 'ic:round-ac-unit'),
    feat('24/7 Security', 'mdi:security'),
    feat('Covered Parking', 'mdi:car'),
    feat('Conference Facilities', 'mdi:presentation'),
    feat('High-Speed Internet', 'mdi:wifi'),
    feat('CCTV Cameras', 'bxs:cctv'),
    feat('Retail on Ground Floor', 'material-symbols:local-mall'),
];
const luxuryAmenities = [
    feat('Private Beach Access', 'majesticons:beach'),
    feat('Private Pool', 'ph:swimming-pool-fill'),
    feat('Home Cinema', 'mdi:cinema'),
    feat('Smart Home System', 'mdi:home-automation'),
    feat('Private Gym & Spa', 'game-icons:gym-bag'),
    feat('Concierge Service', 'mdi:room-service'),
    feat('Landscaped Garden', 'maki:garden'),
    feat('Chauffeur Parking', 'mdi:car-limousine'),
];
const accessCommon = [
    feat('20 mins Dubai Mall', 'material-symbols:local-mall'),
    feat('20 mins Dubai International Airport', 'mdi:local-airport'),
    feat('15 mins Dubai Miracle Garden', 'maki:garden'),
    feat('25 mins Burj Al Arab', 'mingcute:burj-al-arab-fill'),
];
const viewsResidential = [
    feat('Community View', 'ri:community-fill'),
    feat('Pool View', 'ph:swimming-pool-fill'),
    feat('Burj Khalifa View', 'mingcute:burj-khalifa-tower-fill'),
];
const viewsCommercial = [
    feat('Sheikh Zayed Road View', 'material-symbols:flyover-rounded'),
    feat('City Skyline View', 'ri:community-fill'),
];
const viewsLuxury = [
    feat('Sea View', 'iconoir:sea-and-sun'),
    feat('Burj Al Arab View', 'mingcute:burj-al-arab-fill'),
    feat('Burj Khalifa View', 'mingcute:burj-khalifa-tower-fill'),
];
const standardPaymentPlan = {
    'Standard Plan': [
        { heading: '20%', subText: 'On Booking' },
        { heading: '40%', subText: 'During Construction' },
        { heading: '40%', subText: 'On Handover' },
    ],
};
const luxuryPaymentPlan = {
    'Payment Plan': [
        { heading: '30%', subText: 'On Booking' },
        { heading: '30%', subText: 'During Construction' },
        { heading: '40%', subText: 'On Handover' },
    ],
};
const commonFaqs = [
    {
        question: 'Is this property freehold?',
        answer: 'Yes, this property is located in a designated freehold area and is available to both UAE residents and international buyers.',
    },
    {
        question: 'What is the expected handover date?',
        answer: 'The projected handover is aligned with the quarter and year listed on this property. Exact timelines are confirmed in the developer agreement.',
    },
    {
        question: 'Are flexible payment plans available?',
        answer: 'Yes, developer-backed payment plans are available. Our advisors will walk you through every option for this unit.',
    },
];
const richText = (paragraphs) => paragraphs.map((p) => `<p>${p}</p>`).join('');
const makeFloors = (defaultLayoutImageId, unitTypes) => ({
    '0': {
        defaultLayout: layoutImg(defaultLayoutImageId),
        selectedUnitTypes: unitTypes,
        unitImages: {},
    },
});
const properties = [
    // ------------------------------------------------------------------
    // RESIDENTIAL (6)
    // ------------------------------------------------------------------
    {
        title: 'Marina Vista Residences',
        slug: 'marina-vista-residences',
        area: 'Dubai Marina',
        price: 'AED 1,850,000',
        mainVideoUrl: '',
        developer: 'Emaar',
        type: 'Residential',
        location: 'Dubai Marina, Dubai',
        layoutType: 'Residential',
        images: pick(residentialImages, 0, 4).map(img),
        brochureFile: '',
        paymentPlans: standardPaymentPlan,
        faqs: commonFaqs,
        quarter: 'Q4',
        year: '2026',
        amenities: residentialAmenities,
        access: accessCommon,
        views: viewsResidential,
        description: richText([
            'Marina Vista Residences offers waterfront living in the heart of Dubai Marina, with floor-to-ceiling windows framing the yachts and skyline.',
            'Each residence is finished to a premium standard with an open-plan layout, designer kitchen, and a private balcony.',
        ]),
        overview: richText([
            'A collection of 1 to 3 bedroom apartments and penthouses steps away from the Marina promenade, JBR Beach, and world-class dining.',
        ]),
        mapUrl: 'https://maps.google.com/?q=Dubai+Marina',
        seoTitle: 'Marina Vista Residences | Waterfront Apartments in Dubai Marina',
        seoDescription: 'Luxury 1-3 bedroom waterfront apartments in Dubai Marina by Emaar. Flexible payment plans and premium amenities.',
        seoImage: img(residentialImages[0]),
        seoSchema: '',
        canonicalUrl: '',
        status: 'active',
        featured: true,
        mostLuxurious: false,
        numFloors: 28,
        floors: makeFloors(residentialImages[3], ['Studio', '1 BHK', '2 BHK', 'Penthouse']),
    },
    {
        title: 'Creek Horizon Apartments',
        slug: 'creek-horizon-apartments',
        area: 'Dubai Creek Harbour',
        price: 'AED 1,450,000',
        mainVideoUrl: '',
        developer: 'Emaar',
        type: 'Residential',
        location: 'Dubai Creek Harbour, Dubai',
        layoutType: 'Residential',
        images: pick(residentialImages, 1, 4).map(img),
        brochureFile: '',
        paymentPlans: standardPaymentPlan,
        faqs: commonFaqs,
        quarter: 'Q2',
        year: '2027',
        amenities: residentialAmenities,
        access: accessCommon,
        views: viewsResidential,
        description: richText([
            'Creek Horizon places you beside the future icon of the city, with uninterrupted views over the creek, marina, and Ras Al Khor wildlife sanctuary.',
            'Contemporary interiors, resort-style pools, and landscaped podiums create a calm retreat minutes from Downtown.',
        ]),
        overview: richText([
            'Elegant 1 to 3 bedroom homes in one of Dubai\'s most anticipated waterfront communities.',
        ]),
        mapUrl: 'https://maps.google.com/?q=Dubai+Creek+Harbour',
        seoTitle: 'Creek Horizon Apartments | Dubai Creek Harbour',
        seoDescription: 'Modern waterfront apartments at Dubai Creek Harbour with skyline and creek views.',
        seoImage: img(residentialImages[1]),
        seoSchema: '',
        canonicalUrl: '',
        status: 'active',
        featured: false,
        mostLuxurious: false,
        numFloors: 32,
        floors: makeFloors(residentialImages[4], ['1 BHK', '2 BHK', '3 BHK Duplex']),
    },
    {
        title: 'JVC Garden Homes',
        slug: 'jvc-garden-homes',
        area: 'Jumeirah Village Circle',
        price: 'AED 820,000',
        mainVideoUrl: '',
        developer: 'Nakheel',
        type: 'Residential',
        location: 'Jumeirah Village Circle, Dubai',
        layoutType: 'Residential',
        images: pick(residentialImages, 2, 3).map(img),
        brochureFile: '',
        paymentPlans: standardPaymentPlan,
        faqs: commonFaqs,
        quarter: 'Q1',
        year: '2026',
        amenities: residentialAmenities,
        access: accessCommon,
        views: viewsResidential,
        description: richText([
            'JVC Garden Homes brings affordable, family-friendly living to a green, well-connected community in the centre of new Dubai.',
            'Spacious layouts, generous storage, and community parks make this an ideal first home or investment.',
        ]),
        overview: richText([
            'Value-driven studios and 1 to 2 bedroom apartments with strong rental yields in Jumeirah Village Circle.',
        ]),
        mapUrl: 'https://maps.google.com/?q=Jumeirah+Village+Circle',
        seoTitle: 'JVC Garden Homes | Affordable Apartments in Jumeirah Village Circle',
        seoDescription: 'Family-friendly, high-yield studios and apartments in JVC by Nakheel.',
        seoImage: img(residentialImages[2]),
        seoSchema: '',
        canonicalUrl: '',
        status: 'active',
        featured: false,
        mostLuxurious: false,
        numFloors: 12,
        floors: makeFloors(residentialImages[0], ['Studio', '1 BHK', '2 BHK']),
    },
    {
        title: 'Sobha Hartland Greens',
        slug: 'sobha-hartland-greens',
        area: 'Mohammed Bin Rashid City',
        price: 'AED 2,100,000',
        mainVideoUrl: '',
        developer: 'Sobha',
        type: 'Residential',
        location: 'Sobha Hartland, MBR City, Dubai',
        layoutType: 'Residential',
        images: pick(residentialImages, 3, 4).map(img),
        brochureFile: '',
        paymentPlans: standardPaymentPlan,
        faqs: commonFaqs,
        quarter: 'Q3',
        year: '2026',
        amenities: residentialAmenities,
        access: accessCommon,
        views: viewsResidential,
        description: richText([
            'Set within a lush, forested community, Sobha Hartland Greens offers greenery-wrapped apartments minutes from Downtown Dubai.',
            'Renowned Sobha craftsmanship delivers premium finishes and thoughtful, light-filled layouts.',
        ]),
        overview: richText([
            'Premium 1 to 3 bedroom residences surrounded by two international schools and open parkland.',
        ]),
        mapUrl: 'https://maps.google.com/?q=Sobha+Hartland',
        seoTitle: 'Sobha Hartland Greens | Green Living in MBR City',
        seoDescription: 'Premium greenery-wrapped apartments in Sobha Hartland, minutes from Downtown Dubai.',
        seoImage: img(residentialImages[3]),
        seoSchema: '',
        canonicalUrl: '',
        status: 'active',
        featured: true,
        mostLuxurious: false,
        numFloors: 18,
        floors: makeFloors(residentialImages[1], ['1 BHK', '2 BHK', '3 BHK Duplex']),
    },
    {
        title: 'Downtown Views II',
        slug: 'downtown-views-ii',
        area: 'Downtown Dubai',
        price: 'AED 2,650,000',
        mainVideoUrl: '',
        developer: 'Emaar',
        type: 'Residential',
        location: 'Downtown Dubai',
        layoutType: 'Residential',
        images: pick(residentialImages, 4, 4).map(img),
        brochureFile: '',
        paymentPlans: standardPaymentPlan,
        faqs: commonFaqs,
        quarter: 'Q4',
        year: '2025',
        amenities: residentialAmenities,
        access: accessCommon,
        views: viewsResidential,
        description: richText([
            'Downtown Views II delivers direct Burj Khalifa vistas from the most connected address in the city.',
            'Walk to The Dubai Mall, Dubai Opera, and the fountains from a tower designed for modern urban living.',
        ]),
        overview: richText([
            'Sophisticated 1 to 3 bedroom apartments in the beating heart of Downtown Dubai.',
        ]),
        mapUrl: 'https://maps.google.com/?q=Downtown+Dubai',
        seoTitle: 'Downtown Views II | Burj Khalifa View Apartments',
        seoDescription: 'Apartments with direct Burj Khalifa views in Downtown Dubai by Emaar.',
        seoImage: img(residentialImages[4]),
        seoSchema: '',
        canonicalUrl: '',
        status: 'active',
        featured: false,
        mostLuxurious: false,
        numFloors: 55,
        floors: makeFloors(residentialImages[2], ['1 BHK', '2 BHK', 'Penthouse']),
    },
    {
        title: 'Palm Beach Towers',
        slug: 'palm-beach-towers',
        area: 'Palm Jumeirah',
        price: 'AED 3,200,000',
        mainVideoUrl: '',
        developer: 'Nakheel',
        type: 'Residential',
        location: 'Palm Jumeirah, Dubai',
        layoutType: 'Residential',
        images: pick(residentialImages, 0, 4).map(img),
        brochureFile: '',
        paymentPlans: standardPaymentPlan,
        faqs: commonFaqs,
        quarter: 'Q2',
        year: '2026',
        amenities: residentialAmenities,
        access: accessCommon,
        views: viewsResidential,
        description: richText([
            'Palm Beach Towers sits at the gateway of Palm Jumeirah with private beach access and panoramic sea and skyline views.',
            'Resort-style amenities, a beach club, and direct monorail access define island living at its finest.',
        ]),
        overview: richText([
            'Beachfront 1 to 3 bedroom apartments and penthouses on the iconic Palm Jumeirah.',
        ]),
        mapUrl: 'https://maps.google.com/?q=Palm+Jumeirah',
        seoTitle: 'Palm Beach Towers | Beachfront Living on Palm Jumeirah',
        seoDescription: 'Beachfront apartments with private beach access on Palm Jumeirah by Nakheel.',
        seoImage: img(residentialImages[0]),
        seoSchema: '',
        canonicalUrl: '',
        status: 'active',
        featured: false,
        mostLuxurious: false,
        numFloors: 45,
        floors: makeFloors(residentialImages[3], ['2 BHK', '3 BHK Duplex', 'Penthouse']),
    },
    // ------------------------------------------------------------------
    // COMMERCIAL (6)
    // ------------------------------------------------------------------
    {
        title: 'Business Bay Executive Offices',
        slug: 'business-bay-executive-offices',
        area: 'Business Bay',
        price: 'AED 2,400,000',
        mainVideoUrl: '',
        developer: 'Damac',
        type: 'Commercial',
        location: 'Business Bay, Dubai',
        layoutType: 'Commercial',
        images: pick(commercialImages, 0, 4).map(img),
        brochureFile: '',
        paymentPlans: standardPaymentPlan,
        faqs: commonFaqs,
        quarter: 'Q3',
        year: '2026',
        amenities: commercialAmenities,
        access: accessCommon,
        views: viewsCommercial,
        description: richText([
            'Grade-A executive offices in the commercial core of Business Bay, moments from Downtown Dubai and the Dubai Canal.',
            'Fitted and shell-and-core options with flexible floor plates for growing enterprises.',
        ]),
        overview: richText([
            'Premium office units from compact suites to full floors, ideal for headquarters and regional offices.',
        ]),
        mapUrl: 'https://maps.google.com/?q=Business+Bay',
        seoTitle: 'Business Bay Executive Offices | Grade-A Commercial Space',
        seoDescription: 'Grade-A executive offices for sale in Business Bay, Dubai.',
        seoImage: img(commercialImages[0]),
        seoSchema: '',
        canonicalUrl: '',
        status: 'active',
        featured: true,
        mostLuxurious: false,
        numFloors: 22,
        floors: makeFloors(commercialImages[3], ['Studio']),
    },
    {
        title: 'DIFC Prime Offices',
        slug: 'difc-prime-offices',
        area: 'DIFC',
        price: 'AED 5,800,000',
        mainVideoUrl: '',
        developer: 'Meraas',
        type: 'Commercial',
        location: 'Dubai International Financial Centre, Dubai',
        layoutType: 'Commercial',
        images: pick(commercialImages, 1, 4).map(img),
        brochureFile: '',
        paymentPlans: standardPaymentPlan,
        faqs: commonFaqs,
        quarter: 'Q1',
        year: '2027',
        amenities: commercialAmenities,
        access: accessCommon,
        views: viewsCommercial,
        description: richText([
            'A prestigious address within Dubai\'s financial district, DIFC Prime Offices place you among global banks, law firms, and family offices.',
            'Column-free floor plates, premium lobbies, and dedicated parking support institutional-grade occupiers.',
        ]),
        overview: richText([
            'Landmark office floors in the region\'s leading financial hub with a Category 1 business environment.',
        ]),
        mapUrl: 'https://maps.google.com/?q=DIFC+Dubai',
        seoTitle: 'DIFC Prime Offices | Financial District Commercial Space',
        seoDescription: 'Prestigious office floors in Dubai International Financial Centre (DIFC).',
        seoImage: img(commercialImages[1]),
        seoSchema: '',
        canonicalUrl: '',
        status: 'active',
        featured: false,
        mostLuxurious: false,
        numFloors: 30,
        floors: makeFloors(commercialImages[4], ['Studio']),
    },
    {
        title: 'JLT Corporate Suites',
        slug: 'jlt-corporate-suites',
        area: 'Jumeirah Lakes Towers',
        price: 'AED 1,300,000',
        mainVideoUrl: '',
        developer: 'DMCC',
        type: 'Commercial',
        location: 'Jumeirah Lakes Towers, Dubai',
        layoutType: 'Commercial',
        images: pick(commercialImages, 2, 3).map(img),
        brochureFile: '',
        paymentPlans: standardPaymentPlan,
        faqs: commonFaqs,
        quarter: 'Q4',
        year: '2025',
        amenities: commercialAmenities,
        access: accessCommon,
        views: viewsCommercial,
        description: richText([
            'Efficient corporate suites in the well-established DMCC free zone, connected by two metro stations and ringed by lakeside dining.',
            'A cost-effective base for SMEs and start-ups with free-zone licensing on the doorstep.',
        ]),
        overview: richText([
            'Ready office suites in Jumeirah Lakes Towers with strong connectivity and free-zone benefits.',
        ]),
        mapUrl: 'https://maps.google.com/?q=Jumeirah+Lakes+Towers',
        seoTitle: 'JLT Corporate Suites | Free-Zone Offices in Dubai',
        seoDescription: 'Corporate office suites in the DMCC free zone, Jumeirah Lakes Towers.',
        seoImage: img(commercialImages[2]),
        seoSchema: '',
        canonicalUrl: '',
        status: 'active',
        featured: false,
        mostLuxurious: false,
        numFloors: 26,
        floors: makeFloors(commercialImages[0], ['Studio']),
    },
    {
        title: 'Sheikh Zayed Retail Plaza',
        slug: 'sheikh-zayed-retail-plaza',
        area: 'Sheikh Zayed Road',
        price: 'AED 4,200,000',
        mainVideoUrl: '',
        developer: 'Meraas',
        type: 'Commercial',
        location: 'Sheikh Zayed Road, Dubai',
        layoutType: 'Commercial',
        images: pick(commercialImages, 3, 4).map(img),
        brochureFile: '',
        paymentPlans: standardPaymentPlan,
        faqs: commonFaqs,
        quarter: 'Q2',
        year: '2026',
        amenities: commercialAmenities,
        access: accessCommon,
        views: viewsCommercial,
        description: richText([
            'High-footfall retail units fronting Sheikh Zayed Road, Dubai\'s most prominent commercial artery.',
            'Double-height shopfronts and prime visibility for flagship stores, showrooms, and F&B.',
        ]),
        overview: richText([
            'Prime retail spaces with exceptional exposure along Sheikh Zayed Road.',
        ]),
        mapUrl: 'https://maps.google.com/?q=Sheikh+Zayed+Road',
        seoTitle: 'Sheikh Zayed Retail Plaza | Prime Retail on SZR',
        seoDescription: 'High-visibility retail units fronting Sheikh Zayed Road, Dubai.',
        seoImage: img(commercialImages[3]),
        seoSchema: '',
        canonicalUrl: '',
        status: 'active',
        featured: false,
        mostLuxurious: false,
        numFloors: 6,
        floors: makeFloors(commercialImages[1], ['Studio']),
    },
    {
        title: 'Dubai Silicon Oasis Tech Hub',
        slug: 'dubai-silicon-oasis-tech-hub',
        area: 'Dubai Silicon Oasis',
        price: 'AED 1,100,000',
        mainVideoUrl: '',
        developer: 'Binghatti',
        type: 'Commercial',
        location: 'Dubai Silicon Oasis, Dubai',
        layoutType: 'Commercial',
        images: pick(commercialImages, 4, 3).map(img),
        brochureFile: '',
        paymentPlans: standardPaymentPlan,
        faqs: commonFaqs,
        quarter: 'Q3',
        year: '2027',
        amenities: commercialAmenities,
        access: accessCommon,
        views: viewsCommercial,
        description: richText([
            'A purpose-built technology hub in the Dubai Silicon Oasis free zone, tailored for tech firms and R&D teams.',
            'Flexible open-plan floors, robust connectivity, and integrated amenities support innovation-led businesses.',
        ]),
        overview: richText([
            'Modern office floors designed for technology and knowledge-economy companies.',
        ]),
        mapUrl: 'https://maps.google.com/?q=Dubai+Silicon+Oasis',
        seoTitle: 'Dubai Silicon Oasis Tech Hub | Free-Zone Tech Offices',
        seoDescription: 'Purpose-built technology offices in the Dubai Silicon Oasis free zone.',
        seoImage: img(commercialImages[4]),
        seoSchema: '',
        canonicalUrl: '',
        status: 'active',
        featured: false,
        mostLuxurious: false,
        numFloors: 14,
        floors: makeFloors(commercialImages[2], ['Studio']),
    },
    {
        title: 'Meydan Commercial Center',
        slug: 'meydan-commercial-center',
        area: 'Meydan',
        price: 'AED 3,000,000',
        mainVideoUrl: '',
        developer: 'Meydan',
        type: 'Commercial',
        location: 'Meydan, Dubai',
        layoutType: 'Commercial',
        images: pick(commercialImages, 0, 4).map(img),
        brochureFile: '',
        paymentPlans: standardPaymentPlan,
        faqs: commonFaqs,
        quarter: 'Q1',
        year: '2026',
        amenities: commercialAmenities,
        access: accessCommon,
        views: viewsCommercial,
        description: richText([
            'A mixed-use commercial center in the fast-growing Meydan district, close to the racecourse and the new Meydan One development.',
            'Flexible retail and office configurations for businesses seeking a premium yet accessible location.',
        ]),
        overview: richText([
            'Retail and office units in one of Dubai\'s most dynamic growth corridors.',
        ]),
        mapUrl: 'https://maps.google.com/?q=Meydan+Dubai',
        seoTitle: 'Meydan Commercial Center | Retail & Offices in Meydan',
        seoDescription: 'Mixed-use retail and office units in the growing Meydan district, Dubai.',
        seoImage: img(commercialImages[0]),
        seoSchema: '',
        canonicalUrl: '',
        status: 'active',
        featured: false,
        mostLuxurious: false,
        numFloors: 10,
        floors: makeFloors(commercialImages[3], ['Studio']),
    },
    // ------------------------------------------------------------------
    // MOST LUXURIOUS (3)
    // ------------------------------------------------------------------
    {
        title: 'Palm Signature Villas',
        slug: 'palm-signature-villas',
        area: 'Palm Jumeirah',
        price: 'AED 42,000,000',
        mainVideoUrl: '',
        developer: 'Nakheel',
        type: 'Residential',
        location: 'Palm Jumeirah, Dubai',
        layoutType: 'Residential',
        images: pick(luxuryImages, 0, 4).map(img),
        brochureFile: '',
        paymentPlans: luxuryPaymentPlan,
        faqs: commonFaqs,
        quarter: 'Q4',
        year: '2026',
        amenities: luxuryAmenities,
        access: accessCommon,
        views: viewsLuxury,
        description: richText([
            'Palm Signature Villas are a limited collection of beachfront mansions on the fronds of Palm Jumeirah, each with a private pool and direct beach access.',
            'Bespoke interiors, private lifts, staff quarters, and smart-home integration set a new benchmark for waterfront luxury.',
        ]),
        overview: richText([
            'Ultra-luxury 5 to 7 bedroom beachfront villas with panoramic sea and Dubai skyline views.',
        ]),
        mapUrl: 'https://maps.google.com/?q=Palm+Jumeirah',
        seoTitle: 'Palm Signature Villas | Beachfront Mansions on Palm Jumeirah',
        seoDescription: 'Ultra-luxury beachfront villas with private pools and beach access on Palm Jumeirah.',
        seoImage: img(luxuryImages[0]),
        seoSchema: '',
        canonicalUrl: '',
        status: 'active',
        featured: true,
        mostLuxurious: true,
        numFloors: 3,
        floors: makeFloors(luxuryImages[2], ['Penthouse']),
    },
    {
        title: 'Emirates Hills Mansion',
        slug: 'emirates-hills-mansion',
        area: 'Emirates Hills',
        price: 'AED 65,000,000',
        mainVideoUrl: '',
        developer: 'Emaar',
        type: 'Residential',
        location: 'Emirates Hills, Dubai',
        layoutType: 'Residential',
        images: pick(luxuryImages, 1, 4).map(img),
        brochureFile: '',
        paymentPlans: luxuryPaymentPlan,
        faqs: commonFaqs,
        quarter: 'Q2',
        year: '2026',
        amenities: luxuryAmenities,
        access: accessCommon,
        views: viewsLuxury,
        description: richText([
            'A landmark mansion in the prestigious Emirates Hills, the "Beverly Hills of Dubai", overlooking the Montgomerie golf course.',
            'Grand double-height reception, a private cinema, spa, indoor pool, and landscaped gardens define this trophy residence.',
        ]),
        overview: richText([
            'An extraordinary custom-built mansion with golf-course frontage in Dubai\'s most exclusive gated community.',
        ]),
        mapUrl: 'https://maps.google.com/?q=Emirates+Hills',
        seoTitle: 'Emirates Hills Mansion | Trophy Villa in Dubai',
        seoDescription: 'A landmark golf-course mansion in the exclusive Emirates Hills community.',
        seoImage: img(luxuryImages[1]),
        seoSchema: '',
        canonicalUrl: '',
        status: 'active',
        featured: false,
        mostLuxurious: true,
        numFloors: 3,
        floors: makeFloors(luxuryImages[3], ['Penthouse']),
    },
    {
        title: 'Bulgari Lighthouse Penthouse',
        slug: 'bulgari-lighthouse-penthouse',
        area: 'Jumeirah Bay Island',
        price: 'AED 120,000,000',
        mainVideoUrl: '',
        developer: 'Meraas',
        type: 'Residential',
        location: 'Jumeirah Bay Island, Dubai',
        layoutType: 'Residential',
        images: pick(luxuryImages, 2, 3).map(img),
        brochureFile: '',
        paymentPlans: luxuryPaymentPlan,
        faqs: commonFaqs,
        quarter: 'Q4',
        year: '2027',
        amenities: luxuryAmenities,
        access: accessCommon,
        views: viewsLuxury,
        description: richText([
            'The crowning penthouse of the Bulgari Lighthouse on Jumeirah Bay Island, an address synonymous with Italian craftsmanship and rarefied privacy.',
            'A private pool, sky-lounge, and 360-degree views of the Arabian Gulf and Dubai skyline make this one of the world\'s most coveted homes.',
        ]),
        overview: richText([
            'A once-in-a-generation branded penthouse with unrivalled sea and skyline views on Jumeirah Bay Island.',
        ]),
        mapUrl: 'https://maps.google.com/?q=Jumeirah+Bay+Island',
        seoTitle: 'Bulgari Lighthouse Penthouse | Branded Ultra-Luxury Residence',
        seoDescription: 'A signature branded penthouse on Jumeirah Bay Island with 360-degree Gulf views.',
        seoImage: img(luxuryImages[2]),
        seoSchema: '',
        canonicalUrl: '',
        status: 'active',
        featured: true,
        mostLuxurious: true,
        numFloors: 2,
        floors: makeFloors(luxuryImages[4], ['Penthouse']),
    },
];
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            console.error('MONGO_URI is not configured in .env');
            process.exit(1);
        }
        yield mongoose_1.default.connect(mongoURI);
        console.log('Connected to MongoDB for property seeding.');
        let created = 0;
        let updated = 0;
        for (const property of properties) {
            const result = yield property_model_1.default.updateOne({ slug: property.slug }, { $set: property }, { upsert: true });
            if (result.upsertedCount && result.upsertedCount > 0) {
                created += 1;
            }
            else if (result.modifiedCount && result.modifiedCount > 0) {
                updated += 1;
            }
        }
        const residential = properties.filter((p) => p.type === 'Residential' && !p.mostLuxurious).length;
        const commercial = properties.filter((p) => p.type === 'Commercial').length;
        const luxurious = properties.filter((p) => p.mostLuxurious).length;
        console.log(`Property seed complete. Created: ${created}, Updated: ${updated}, Total: ${properties.length} ` +
            `(Residential: ${residential}, Commercial: ${commercial}, Most Luxurious: ${luxurious}).`);
        yield mongoose_1.default.disconnect();
        process.exit(0);
    });
}
run().catch((error) => {
    console.error('Property seeding failed:', error);
    process.exit(1);
});
