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
exports.bulkDeleteArticles = exports.deleteArticle = exports.updateArticle = exports.createArticle = exports.getArticleById = exports.getArticles = void 0;
const article_model_1 = require("../../models/article.model");
const cloudinaryClient_1 = __importDefault(require("../../services/cloudinaryClient"));
const stream_1 = require("stream");
const normalizeBannerUrl = (url) => {
    if (!url)
        return '';
    return encodeURI(url);
};
const generateSlug = (value) => value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
const getArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articles = yield article_model_1.Article.find();
        const normalizedArticles = articles.map((article) => {
            const plain = article.toObject();
            return Object.assign(Object.assign({}, plain), { bannerUrl: normalizeBannerUrl(plain.bannerUrl) });
        });
        res.json(normalizedArticles);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getArticles = getArticles;
const getArticleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const article = yield article_model_1.Article.findById(id);
        if (!article) {
            res.status(404).json({ message: 'Article not found' });
            return;
        }
        const plainArticle = article.toObject();
        res.json(Object.assign(Object.assign({}, plainArticle), { bannerUrl: normalizeBannerUrl(plainArticle.bannerUrl) }));
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getArticleById = getArticleById;
const useCloudinary = process.env.USE_CLOUDINARY === 'true';
const uploadBannerToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new Promise((resolve, reject) => {
        const uploadStream = cloudinaryClient_1.default.uploader.upload_stream({ folder: 'suits-and-sand/articles', resource_type: 'image' }, (error, result) => {
            if (error || !(result === null || result === void 0 ? void 0 : result.secure_url)) {
                return reject(error || new Error('Cloudinary upload failed'));
            }
            resolve(result.secure_url);
        });
        stream_1.Readable.from(file.buffer).pipe(uploadStream);
    });
});
const uploadSeoImageToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new Promise((resolve, reject) => {
        const uploadStream = cloudinaryClient_1.default.uploader.upload_stream({ folder: 'suits-and-sand/articles/seo', resource_type: 'image' }, (error, result) => {
            if (error || !(result === null || result === void 0 ? void 0 : result.secure_url)) {
                return reject(error || new Error('Cloudinary upload failed'));
            }
            resolve(result.secure_url);
        });
        stream_1.Readable.from(file.buffer).pipe(uploadStream);
    });
});
const createArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const files = req.files;
        const { title, slug, category, description, imageAlt, seoTitle, seoDescription, articleSchemas, status, canonicalUrl, } = req.body;
        const bannerFile = (_a = files === null || files === void 0 ? void 0 : files.banner) === null || _a === void 0 ? void 0 : _a[0];
        const seoImageFile = (_b = files === null || files === void 0 ? void 0 : files.seoImage) === null || _b === void 0 ? void 0 : _b[0];
        if (!title || !category || !description) {
            res.status(400).json({ message: 'title, category, and description are required.' });
            return;
        }
        let bannerUrl = '';
        let seoImageUrl = '';
        if (useCloudinary) {
            bannerUrl = normalizeBannerUrl(yield uploadBannerToCloudinary(bannerFile));
            if (seoImageFile) {
                seoImageUrl = normalizeBannerUrl(yield uploadSeoImageToCloudinary(seoImageFile));
            }
        }
        else {
            bannerUrl = `/uploads/${bannerFile.filename}`;
            if (seoImageFile) {
                seoImageUrl = `/uploads/${seoImageFile.filename}`;
            }
        }
        const newArticle = new article_model_1.Article({
            title,
            slug: slug || generateSlug(title),
            category,
            bannerUrl: bannerUrl || undefined,
            description,
            imageAlt: imageAlt || title,
            seoTitle: seoTitle || title,
            seoDescription: seoDescription || description,
            seoImageUrl: seoImageUrl || undefined,
            articleSchemas: articleSchemas
                ? (typeof articleSchemas === "string" ? JSON.parse(articleSchemas) : articleSchemas)
                : [],
            status: status === 'inactive' ? 'inactive' : 'active',
            canonicalUrl: canonicalUrl || undefined,
        });
        yield newArticle.save();
        res.status(201).json(newArticle);
    }
    catch (error) {
        console.error('Error in createArticle:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createArticle = createArticle;
const updateArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const files = req.files;
        const { id } = req.params;
        const { title, slug, category, description, imageAlt, seoTitle, seoDescription, articleSchemas, status, canonicalUrl, } = req.body;
        const bannerFile = (_a = files === null || files === void 0 ? void 0 : files.banner) === null || _a === void 0 ? void 0 : _a[0];
        const seoImageFile = (_b = files === null || files === void 0 ? void 0 : files.seoImage) === null || _b === void 0 ? void 0 : _b[0];
        const updateData = {
            title,
            slug: slug || generateSlug(title),
            category,
            description,
            imageAlt,
            seoTitle,
            seoDescription,
            articleSchemas,
        };
        if (status !== undefined) {
            updateData.status = status === 'inactive' ? 'inactive' : 'active';
        }
        if (canonicalUrl !== undefined) {
            updateData.canonicalUrl = canonicalUrl;
        }
        if (bannerFile) {
            if (useCloudinary) {
                updateData.bannerUrl = normalizeBannerUrl(yield uploadBannerToCloudinary(bannerFile));
            }
            else {
                updateData.bannerUrl = `/uploads/${bannerFile.filename}`;
            }
        }
        if (seoImageFile) {
            if (useCloudinary) {
                updateData.seoImageUrl = normalizeBannerUrl(yield uploadSeoImageToCloudinary(seoImageFile));
            }
            else {
                updateData.seoImageUrl = `/uploads/${seoImageFile.filename}`;
            }
        }
        const updatedArticle = yield article_model_1.Article.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedArticle) {
            res.status(404).json({ message: 'Article not found' });
            return;
        }
        res.json(updatedArticle);
    }
    catch (error) {
        console.error('Error in updateArticle:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateArticle = updateArticle;
const deleteArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield article_model_1.Article.findByIdAndDelete(id);
        res.status(200).json({ message: 'Article deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteArticle = deleteArticle;
const bulkDeleteArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const ids = Array.isArray((_a = req.body) === null || _a === void 0 ? void 0 : _a.ids) ? req.body.ids : [];
        if (!ids.length) {
            res.status(400).json({ message: 'No article ids provided' });
            return;
        }
        yield article_model_1.Article.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: 'Articles deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.bulkDeleteArticles = bulkDeleteArticles;
