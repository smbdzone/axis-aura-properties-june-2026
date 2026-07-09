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
const developer_model_1 = __importDefault(require("../models/developer.model"));
dotenv_1.default.config();
const logo = (label) => `https://placehold.co/250x75/003049/ffffff?text=${encodeURIComponent(label)}`;
const developers = [
    {
        title: 'Emaar',
        logoUrl: logo('EMAAR'),
        description: 'Emaar Properties is one of the world\'s most valuable real estate developers, behind iconic Dubai landmarks such as Burj Khalifa, The Dubai Mall, and Downtown Dubai.',
    },
    {
        title: 'Nakheel',
        logoUrl: logo('NAKHEEL'),
        description: 'Nakheel is a master developer renowned for transformative waterfront communities including Palm Jumeirah, The World Islands, and Jumeirah Village Circle.',
    },
    {
        title: 'Sobha',
        logoUrl: logo('SOBHA'),
        description: 'Sobha Realty is a luxury developer celebrated for its backward-integrated model and meticulous craftsmanship, delivering premium communities like Sobha Hartland.',
    },
    {
        title: 'Damac',
        logoUrl: logo('DAMAC'),
        description: 'DAMAC Properties is a leading luxury developer in the Middle East, known for branded residences and landmark projects across Dubai and the wider region.',
    },
    {
        title: 'Meraas',
        logoUrl: logo('MERAAS'),
        description: 'Meraas is a Dubai-based developer shaping lifestyle destinations such as City Walk, Bluewaters, and Jumeirah Bay Island with a focus on design and experience.',
    },
    {
        title: 'DMCC',
        logoUrl: logo('DMCC'),
        description: 'DMCC is the world\'s leading free zone and Government of Dubai Authority on commodities trade, home to the vibrant Jumeirah Lakes Towers business district.',
    },
    {
        title: 'Binghatti',
        logoUrl: logo('BINGHATTI'),
        description: 'Binghatti Developers is an Emirati developer recognised for distinctive architecture and fast-tracked delivery across Dubai\'s key investment districts.',
    },
    {
        title: 'Meydan',
        logoUrl: logo('MEYDAN'),
        description: 'Meydan is a visionary developer behind the Meydan district, blending world-class sporting, residential, and commercial destinations in the heart of Dubai.',
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
        console.log('Connected to MongoDB for developer seeding.');
        let created = 0;
        let updated = 0;
        for (const developer of developers) {
            const result = yield developer_model_1.default.updateOne({ title: developer.title }, { $set: developer }, { upsert: true });
            if (result.upsertedCount && result.upsertedCount > 0) {
                created += 1;
            }
            else if (result.modifiedCount && result.modifiedCount > 0) {
                updated += 1;
            }
        }
        console.log(`Developer seed complete. Created: ${created}, Updated: ${updated}, Total: ${developers.length}.`);
        yield mongoose_1.default.disconnect();
        process.exit(0);
    });
}
run().catch((error) => {
    console.error('Developer seeding failed:', error);
    process.exit(1);
});
