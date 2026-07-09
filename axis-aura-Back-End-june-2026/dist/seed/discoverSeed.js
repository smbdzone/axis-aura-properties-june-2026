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
const discover_model_1 = __importDefault(require("../models/discover.model"));
dotenv_1.default.config();
// Fixed landscape crop so thumbnails fill their frames consistently.
const thumb = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=entropy&w=1200&h=900&q=80`;
// NOTE: These use free/open sample videos as placeholders. Replace them with your
// own Dubai property videos from the admin dashboard (they will upload to Cloudinary).
const items = [
    {
        order: 1,
        title: 'Discover Downtown Dubai',
        description: "Explore the world's most dynamic city. From iconic skyline penthouses to high-yield investment properties, we connect you with Dubai's most exclusive addresses and trusted developers.",
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        thumbnailUrl: thumb('1512453979798-5ea266f8880c'),
    },
    {
        order: 2,
        title: 'Palm Jumeirah Waterfront Living',
        description: "Experience waterfront living at its finest. Discover marina residences, beachfront villas, and branded towers crafted by the region's most trusted developers.",
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        thumbnailUrl: thumb('1613490493576-7fde63acd811'),
    },
    {
        order: 3,
        title: 'Dubai Marina Skyline Residences',
        description: "Live above the city in Dubai Marina's most sought-after towers. Panoramic water views, world-class amenities, and a vibrant lifestyle at your doorstep.",
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: thumb('1486406146926-c627a92ad1ab'),
    },
    {
        order: 4,
        title: 'Business Bay Investment Opportunities',
        description: "Unlock high-yield investment opportunities across Dubai's fastest-growing districts. Expert guidance connects you with premier off-plan launches and ready properties.",
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        thumbnailUrl: thumb('1497366216548-37526070297c'),
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
        console.log('Connected to MongoDB for Discover (videos) seeding.');
        let created = 0;
        let updated = 0;
        for (const item of items) {
            const result = yield discover_model_1.default.updateOne({ title: item.title }, {
                $set: {
                    description: item.description,
                    videoUrl: item.videoUrl,
                    thumbnailUrl: item.thumbnailUrl,
                    order: item.order,
                },
            }, { upsert: true });
            if (result.upsertedCount && result.upsertedCount > 0) {
                created += 1;
            }
            else if (result.modifiedCount && result.modifiedCount > 0) {
                updated += 1;
            }
        }
        console.log(`Discover seed complete. Created: ${created}, Updated: ${updated}, Total in seed: ${items.length}`);
        yield mongoose_1.default.disconnect();
        process.exit(0);
    });
}
run().catch((error) => {
    console.error('Discover seeding failed:', error);
    process.exit(1);
});
