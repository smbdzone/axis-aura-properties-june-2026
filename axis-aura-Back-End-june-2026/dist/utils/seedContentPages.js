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
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedContentPages = seedContentPages;
const contentPageDefaults_1 = require("../data/contentPageDefaults");
const contentPage_model_1 = require("../models/contentPage.model");
function seedContentPages() {
    return __awaiter(this, void 0, void 0, function* () {
        let created = 0;
        for (const defaults of contentPageDefaults_1.contentPageDefaults) {
            const exists = yield contentPage_model_1.ContentPage.findOne({ slug: defaults.slug });
            if (exists)
                continue;
            yield contentPage_model_1.ContentPage.create(defaults);
            created += 1;
            console.log(`Seeded content page: ${defaults.slug}`);
        }
        if (created === 0) {
            console.log('Content pages already seeded.');
        }
        else {
            console.log(`Content page seed complete. Created: ${created}`);
        }
    });
}
