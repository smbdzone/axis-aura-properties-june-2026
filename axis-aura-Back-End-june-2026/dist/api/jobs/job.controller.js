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
exports.getJobById = exports.deleteJob = exports.updateJob = exports.createJob = exports.getJobTitles = exports.getJobs = void 0;
const job_model_1 = require("../../models/job.model");
const cloudinaryClient_1 = __importDefault(require("../../services/cloudinaryClient"));
const stream_1 = require("stream");
const useCloudinary = process.env.USE_CLOUDINARY === 'true';
const uploadFileToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new Promise((resolve, reject) => {
        const uploadStream = cloudinaryClient_1.default.uploader.upload_stream({ folder: 'suits-and-sand/jobs', resource_type: 'image', timeout: 120000 }, (error, result) => {
            if (error || !(result === null || result === void 0 ? void 0 : result.secure_url)) {
                return reject(error || new Error('Cloudinary upload failed'));
            }
            resolve(result.secure_url);
        });
        stream_1.Readable.from(file.buffer).pipe(uploadStream);
    });
});
const getJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobs = yield job_model_1.Job.find();
        res.json(jobs);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getJobs = getJobs;
const getJobTitles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobs = yield job_model_1.Job.find({}, 'title'); // Only fetch 'title' field
        const titles = jobs.map(job => job.title);
        res.json(titles);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch job titles' });
    }
});
exports.getJobTitles = getJobTitles;
const createJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, remunerationType, commission, salary, salaryPeriod, level } = req.body;
        const imageFile = req.file;
        if (!title || !description || !remunerationType) {
            res.status(400).json({ message: 'Please provide all required fields.' });
            return;
        }
        // Validate remuneration fields based on remunerationType
        if (remunerationType === 'commission' && !commission) {
            res.status(400).json({ message: 'Commission must be provided for commission type.' });
            return;
        }
        if (remunerationType === 'salary' && !salary) {
            res.status(400).json({ message: 'Salary must be provided for salary type.' });
            return;
        }
        let imageUrl;
        if (imageFile) {
            imageUrl = useCloudinary
                ? yield uploadFileToCloudinary(imageFile)
                : `/uploads/${imageFile.filename}`;
        }
        const newJob = new job_model_1.Job({ title, description, remunerationType, commission, salary, salaryPeriod, level, imageUrl });
        yield newJob.save();
        res.status(201).json(newJob);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createJob = createJob;
const updateJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description, remunerationType, commission, salary, salaryPeriod, level } = req.body;
        const imageFile = req.file;
        const updateData = { title, description, remunerationType, commission, salary, salaryPeriod, level };
        if (imageFile) {
            updateData.imageUrl = useCloudinary
                ? yield uploadFileToCloudinary(imageFile)
                : `/uploads/${imageFile.filename}`;
        }
        // Remove undefined or null fields to avoid overwriting with empty values
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });
        const updatedJob = yield job_model_1.Job.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedJob) {
            res.status(404).json({ message: 'Job not found' });
            return;
        }
        res.json(updatedJob);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateJob = updateJob;
const deleteJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield job_model_1.Job.findByIdAndDelete(id);
        res.status(200).json({ message: 'Job deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteJob = deleteJob;
const getJobById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const job = yield job_model_1.Job.findById(id);
        if (!job) {
            res.status(404).json({ message: 'Job not found' });
            return;
        }
        res.json(job);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getJobById = getJobById;
