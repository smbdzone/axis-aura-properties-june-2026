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
exports.deleteDiscover = exports.updateDiscover = exports.createDiscover = exports.getDiscoverById = exports.getDiscoverItems = void 0;
const discover_model_1 = __importDefault(require("../../models/discover.model"));
const cloudinaryClient_1 = __importDefault(require("../../services/cloudinaryClient"));
const stream_1 = require("stream");
const useCloudinary = process.env.USE_CLOUDINARY === 'true';
const uploadToCloudinary = (file, resourceType) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new Promise((resolve, reject) => {
        const uploadStream = cloudinaryClient_1.default.uploader.upload_stream({
            folder: `suits-and-sand/discover/${resourceType === 'video' ? 'videos' : 'thumbnails'}`,
            resource_type: resourceType,
            timeout: 300000,
        }, (error, result) => {
            if (error || !(result === null || result === void 0 ? void 0 : result.secure_url)) {
                return reject(error || new Error('Cloudinary upload failed'));
            }
            resolve(result.secure_url);
        });
        stream_1.Readable.from(file.buffer).pipe(uploadStream);
    });
});
const resolveUploadedUrl = (file, resourceType) => __awaiter(void 0, void 0, void 0, function* () {
    if (!file)
        return undefined;
    if (useCloudinary)
        return uploadToCloudinary(file, resourceType);
    return `/uploads/${file.filename}`;
});
// =============================
// GET ALL DISCOVER ITEMS (public)
// =============================
const getDiscoverItems = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield discover_model_1.default.find().sort({ order: 1, createdAt: -1 }).lean();
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getDiscoverItems = getDiscoverItems;
// =============================
// GET DISCOVER ITEM BY ID
// =============================
const getDiscoverById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield discover_model_1.default.findById(req.params.id).lean();
        if (!item) {
            res.status(404).json({ message: 'Discover item not found' });
            return;
        }
        res.json(item);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getDiscoverById = getDiscoverById;
// =============================
// CREATE DISCOVER ITEM
// =============================
const createDiscover = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { title, description, videoUrl, thumbnailUrl, order } = req.body;
        const files = req.files || {};
        const videoFile = (_a = files.video) === null || _a === void 0 ? void 0 : _a[0];
        const thumbnailFile = (_b = files.thumbnail) === null || _b === void 0 ? void 0 : _b[0];
        if (!title || !String(title).trim()) {
            res.status(400).json({ message: 'Title is required.' });
            return;
        }
        const uploadedVideoUrl = yield resolveUploadedUrl(videoFile, 'video');
        const finalVideoUrl = uploadedVideoUrl || (videoUrl ? String(videoUrl).trim() : '');
        if (!finalVideoUrl) {
            res.status(400).json({ message: 'A video file or video URL is required.' });
            return;
        }
        const uploadedThumbnailUrl = yield resolveUploadedUrl(thumbnailFile, 'image');
        const finalThumbnailUrl = uploadedThumbnailUrl || (thumbnailUrl ? String(thumbnailUrl).trim() : '');
        const newItem = new discover_model_1.default({
            title: String(title).trim(),
            description: description ? String(description).trim() : '',
            videoUrl: finalVideoUrl,
            thumbnailUrl: finalThumbnailUrl,
            order: order !== undefined ? Number(order) : 0,
        });
        yield newItem.save();
        res.status(201).json(newItem);
    }
    catch (error) {
        console.error('Create Discover Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createDiscover = createDiscover;
// =============================
// UPDATE DISCOVER ITEM
// =============================
const updateDiscover = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params;
        const { title, description, videoUrl, thumbnailUrl, order } = req.body;
        const files = req.files || {};
        const videoFile = (_a = files.video) === null || _a === void 0 ? void 0 : _a[0];
        const thumbnailFile = (_b = files.thumbnail) === null || _b === void 0 ? void 0 : _b[0];
        const updateData = {};
        if (title !== undefined)
            updateData.title = String(title).trim();
        if (description !== undefined)
            updateData.description = String(description).trim();
        if (order !== undefined)
            updateData.order = Number(order);
        const uploadedVideoUrl = yield resolveUploadedUrl(videoFile, 'video');
        if (uploadedVideoUrl) {
            updateData.videoUrl = uploadedVideoUrl;
        }
        else if (videoUrl !== undefined && String(videoUrl).trim()) {
            updateData.videoUrl = String(videoUrl).trim();
        }
        const uploadedThumbnailUrl = yield resolveUploadedUrl(thumbnailFile, 'image');
        if (uploadedThumbnailUrl) {
            updateData.thumbnailUrl = uploadedThumbnailUrl;
        }
        else if (thumbnailUrl !== undefined) {
            updateData.thumbnailUrl = String(thumbnailUrl).trim();
        }
        const updatedItem = yield discover_model_1.default.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedItem) {
            res.status(404).json({ message: 'Discover item not found' });
            return;
        }
        res.json(updatedItem);
    }
    catch (error) {
        console.error('Update Discover Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateDiscover = updateDiscover;
// =============================
// DELETE DISCOVER ITEM
// =============================
const deleteDiscover = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield discover_model_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            res.status(404).json({ message: 'Discover item not found' });
            return;
        }
        res.status(200).json({ message: 'Discover item deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteDiscover = deleteDiscover;
