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
exports.getDeveloperById = exports.deleteDeveloper = exports.updateDeveloper = exports.createDeveloper = exports.getDevelopers = void 0;
const developer_model_1 = __importDefault(require("../../models/developer.model"));
const property_model_1 = __importDefault(require("../../models/property.model"));
const cloudinaryClient_1 = __importDefault(require("../../services/cloudinaryClient"));
const stream_1 = require("stream");
const useCloudinary = process.env.USE_CLOUDINARY === 'true';
// Map a handover quarter to the month it ends in (used to decide if a project is handed over)
const quarterEndMonth = { q1: 3, q2: 6, q3: 9, q4: 12 };
// A project counts as "handed over" once its handover date (year + quarter) is in the past
const isHandedOver = (year, quarter) => {
    const parsedYear = parseInt(String(year !== null && year !== void 0 ? year : ''), 10);
    if (!parsedYear || Number.isNaN(parsedYear))
        return false;
    const now = new Date();
    const currentYear = now.getFullYear();
    if (parsedYear < currentYear)
        return true;
    if (parsedYear > currentYear)
        return false;
    const normalizedQuarter = String(quarter !== null && quarter !== void 0 ? quarter : '').trim().toLowerCase();
    const endMonth = quarterEndMonth[normalizedQuarter];
    if (!endMonth)
        return false;
    return now.getMonth() + 1 > endMonth;
};
// Derive project counts for a developer from the properties linked to it (matched by name)
const computeDeveloperStats = (title) => __awaiter(void 0, void 0, void 0, function* () {
    const trimmedTitle = (title !== null && title !== void 0 ? title : '').trim();
    if (!trimmedTitle)
        return { numberOfProjects: 0, projectsHandedOver: 0 };
    const escapedTitle = trimmedTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const developerMatch = new RegExp(`^${escapedTitle}$`, 'i');
    const properties = yield property_model_1.default.find({ developer: developerMatch }, { year: 1, quarter: 1 }).lean();
    const numberOfProjects = properties.length;
    const projectsHandedOver = properties.filter((property) => isHandedOver(property.year, property.quarter)).length;
    return { numberOfProjects, projectsHandedOver };
});
const uploadFileToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new Promise((resolve, reject) => {
        const uploadStream = cloudinaryClient_1.default.uploader.upload_stream({ folder: 'suits-and-sand/developers', resource_type: 'image', timeout: 120000 }, (error, result) => {
            if (error || !(result === null || result === void 0 ? void 0 : result.secure_url)) {
                return reject(error || new Error('Cloudinary upload failed'));
            }
            resolve(result.secure_url);
        });
        stream_1.Readable.from(file.buffer).pipe(uploadStream);
    });
});
// =============================
// GET ALL DEVELOPERS
// =============================
const getDevelopers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const developers = yield developer_model_1.default.find().lean();
        const developersWithStats = yield Promise.all(developers.map((developer) => __awaiter(void 0, void 0, void 0, function* () {
            const stats = yield computeDeveloperStats(developer.title);
            return Object.assign(Object.assign({}, developer), stats);
        })));
        res.json(developersWithStats);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getDevelopers = getDevelopers;
// =============================
// CREATE DEVELOPER
// =============================
const createDeveloper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, numberOfProjects, projectsHandedOver } = req.body;
        const logoFile = req.file;
        if (!title || !description || !logoFile) {
            res.status(400).json({ message: 'Please provide all required fields.' });
            return;
        }
        let logoUrl = '';
        if (useCloudinary) {
            logoUrl = yield uploadFileToCloudinary(logoFile);
        }
        else {
            logoUrl = `/uploads/${logoFile.filename}`;
        }
        const newDeveloper = new developer_model_1.default({
            title,
            description,
            logoUrl,
            numberOfProjects,
            projectsHandedOver,
        });
        yield newDeveloper.save();
        res.status(201).json(newDeveloper);
    }
    catch (error) {
        console.error('Create Developer Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createDeveloper = createDeveloper;
// =============================
// UPDATE DEVELOPER
// =============================
const updateDeveloper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description, numberOfProjects, projectsHandedOver } = req.body;
        const logoFile = req.file;
        const updateData = {
            title,
            description,
            numberOfProjects,
            projectsHandedOver,
        };
        if (logoFile) {
            if (useCloudinary) {
                updateData.logoUrl = yield uploadFileToCloudinary(logoFile);
            }
            else {
                updateData.logoUrl = `/uploads/${logoFile.filename}`;
            }
        }
        const updatedDeveloper = yield developer_model_1.default.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedDeveloper) {
            res.status(404).json({ message: 'Developer not found' });
            return;
        }
        res.json(updatedDeveloper);
    }
    catch (error) {
        console.error('Update Developer Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateDeveloper = updateDeveloper;
// =============================
// DELETE DEVELOPER
// =============================
const deleteDeveloper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield developer_model_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Developer deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteDeveloper = deleteDeveloper;
// =============================
// GET DEVELOPER BY ID
// =============================
const getDeveloperById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const developer = yield developer_model_1.default.findById(req.params.id).lean();
        if (!developer) {
            res.status(404).json({ message: 'Developer not found' });
            return;
        }
        const stats = yield computeDeveloperStats(developer.title);
        res.json(Object.assign(Object.assign({}, developer), stats));
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getDeveloperById = getDeveloperById;
