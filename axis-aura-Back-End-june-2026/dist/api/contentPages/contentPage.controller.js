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
exports.updateContentPage = exports.getContentPage = void 0;
const contentPageDefaults_1 = require("../../data/contentPageDefaults");
const contentPage_model_1 = require("../../models/contentPage.model");
const ALLOWED_SLUGS = ['privacy-policy', 'terms-and-conditions'];
function isAllowedSlug(slug) {
    return ALLOWED_SLUGS.includes(slug);
}
function normalizeSections(sections) {
    if (!Array.isArray(sections))
        return [];
    return sections
        .map((section) => {
        if (!section || typeof section !== 'object')
            return null;
        const title = typeof section.title === 'string'
            ? section.title.trim()
            : '';
        const paragraphs = Array.isArray(section.paragraphs)
            ? section.paragraphs
                .filter((item) => typeof item === 'string' && item.trim().length > 0)
                .map((item) => item.trim())
            : [];
        const bullets = Array.isArray(section.bullets)
            ? section.bullets
                .filter((item) => typeof item === 'string' && item.trim().length > 0)
                .map((item) => item.trim())
            : [];
        if (!title)
            return null;
        return Object.assign({ title,
            paragraphs }, (bullets.length > 0 ? { bullets } : {}));
    })
        .filter((section) => section !== null);
}
function getOrCreateContentPage(slug) {
    return __awaiter(this, void 0, void 0, function* () {
        let page = yield contentPage_model_1.ContentPage.findOne({ slug });
        if (page)
            return page;
        const defaults = (0, contentPageDefaults_1.getContentPageDefault)(slug);
        if (!defaults)
            return null;
        page = yield contentPage_model_1.ContentPage.create(defaults);
        return page;
    });
}
const getContentPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        if (!isAllowedSlug(slug)) {
            res.status(404).json({ message: 'Content page not found.' });
            return;
        }
        const page = yield getOrCreateContentPage(slug);
        if (!page) {
            res.status(404).json({ message: 'Content page not found.' });
            return;
        }
        res.json(page);
    }
    catch (error) {
        console.error('Error in getContentPage:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getContentPage = getContentPage;
const updateContentPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    try {
        const { slug } = req.params;
        if (!isAllowedSlug(slug)) {
            res.status(404).json({ message: 'Content page not found.' });
            return;
        }
        const { introText, hero, sections } = req.body;
        const normalizedSections = normalizeSections(sections);
        if (normalizedSections.length === 0) {
            res.status(400).json({ message: 'At least one content section is required.' });
            return;
        }
        const existing = yield getOrCreateContentPage(slug);
        const defaults = (0, contentPageDefaults_1.getContentPageDefault)(slug);
        const payload = {
            slug,
            introText: typeof introText === 'string'
                ? introText.trim()
                : (_b = (_a = existing === null || existing === void 0 ? void 0 : existing.introText) !== null && _a !== void 0 ? _a : defaults === null || defaults === void 0 ? void 0 : defaults.introText) !== null && _b !== void 0 ? _b : '',
            hero: {
                title: typeof (hero === null || hero === void 0 ? void 0 : hero.title) === 'string' && hero.title.trim()
                    ? hero.title.trim()
                    : (_e = (_d = (_c = existing === null || existing === void 0 ? void 0 : existing.hero) === null || _c === void 0 ? void 0 : _c.title) !== null && _d !== void 0 ? _d : defaults === null || defaults === void 0 ? void 0 : defaults.hero.title) !== null && _e !== void 0 ? _e : '',
                image: typeof (hero === null || hero === void 0 ? void 0 : hero.image) === 'string'
                    ? hero.image.trim()
                    : (_h = (_g = (_f = existing === null || existing === void 0 ? void 0 : existing.hero) === null || _f === void 0 ? void 0 : _f.image) !== null && _g !== void 0 ? _g : defaults === null || defaults === void 0 ? void 0 : defaults.hero.image) !== null && _h !== void 0 ? _h : '',
                imageAlt: typeof (hero === null || hero === void 0 ? void 0 : hero.imageAlt) === 'string'
                    ? hero.imageAlt.trim()
                    : (_l = (_k = (_j = existing === null || existing === void 0 ? void 0 : existing.hero) === null || _j === void 0 ? void 0 : _j.imageAlt) !== null && _k !== void 0 ? _k : defaults === null || defaults === void 0 ? void 0 : defaults.hero.imageAlt) !== null && _l !== void 0 ? _l : '',
            },
            sections: normalizedSections,
        };
        const page = yield contentPage_model_1.ContentPage.findOneAndUpdate({ slug }, payload, {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
        });
        res.json(page);
    }
    catch (error) {
        console.error('Error in updateContentPage:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateContentPage = updateContentPage;
