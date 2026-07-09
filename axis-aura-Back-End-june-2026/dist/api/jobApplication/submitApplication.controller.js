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
exports.bulkDeleteApplications = exports.deleteApplication = exports.getApplications = exports.submitApplication = exports.upload = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const jobApplication_model_1 = __importDefault(require("../../models/jobApplication.model"));
const cloudinaryClient_1 = __importDefault(require("../../services/cloudinaryClient"));
const stream_1 = require("stream");
dotenv_1.default.config();
const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
const useCloudinary = process.env.USE_CLOUDINARY === 'true';
const allowedResumeTypes = ['application/pdf'];
const blockedExecutableTypes = [
    'application/x-msdownload',
    'application/x-msdos-program',
    'application/x-dosexec',
    'application/x-executable',
    'application/x-mach-binary',
    'application/x-sh',
    'application/x-bat',
    'application/x-csh',
    'application/x-msi',
    'application/java-archive',
    'application/javascript',
    'text/javascript',
    'text/x-shellscript',
];
const blockedExecutableExtensions = [
    '.exe',
    '.bat',
    '.cmd',
    '.com',
    '.msi',
    '.dll',
    '.sh',
    '.bash',
    '.zsh',
    '.ps1',
    '.jar',
    '.js',
    '.vbs',
    '.scr',
];
// Multer storage config
const storage = useCloudinary
    ? multer_1.default.memoryStorage()
    : multer_1.default.diskStorage({
        destination: uploadsDir,
        filename: (_, file, cb) => {
            cb(null, Date.now() + path_1.default.extname(file.originalname));
        },
    });
const fileFilter = (_req, file, cb) => {
    const filename = (file.originalname || '').toLowerCase();
    const isBlockedByType = blockedExecutableTypes.includes(file.mimetype);
    const isBlockedByExt = blockedExecutableExtensions.some((ext) => filename.endsWith(ext));
    if (isBlockedByType || isBlockedByExt) {
        return cb(new Error('Executable files are not allowed.'));
    }
    const isPdf = allowedResumeTypes.includes(file.mimetype) || filename.endsWith('.pdf');
    if (!isPdf) {
        return cb(new Error('Only PDF resumes are allowed.'));
    }
    cb(null, true);
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 3 * 1024 * 1024 },
}).single('resume');
const uploadResumeToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new Promise((resolve, reject) => {
        const uploadStream = cloudinaryClient_1.default.uploader.upload_stream({ folder: 'suits-and-sand/job-applications', resource_type: 'raw', timeout: 120000 }, (error, result) => {
            if (error || !(result === null || result === void 0 ? void 0 : result.secure_url)) {
                return reject(error || new Error('Cloudinary upload failed'));
            }
            resolve(result.secure_url);
        });
        stream_1.Readable.from(file.buffer).pipe(uploadStream);
    });
});
// Application submission handler (public)
const submitApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { fullName, firstName, lastName, email, phone, position, role, experience, coverLetter, description, } = req.body;
    const resolvedFullName = (fullName && String(fullName).trim()) ||
        [firstName, lastName].filter(Boolean).join(' ').trim();
    const resolvedPosition = position || role || '';
    const resolvedCoverLetter = (_a = coverLetter !== null && coverLetter !== void 0 ? coverLetter : description) !== null && _a !== void 0 ? _a : '';
    const resumeFile = req.file;
    if (!resolvedFullName || !email || !phone || !resolvedPosition) {
        res.status(400).json({ error: 'Please provide name, email, phone and role.' });
        return;
    }
    try {
        let resumeUrl;
        if (resumeFile) {
            if (useCloudinary) {
                try {
                    resumeUrl = yield uploadResumeToCloudinary(resumeFile);
                }
                catch (cloudinaryError) {
                    console.error('Cloudinary resume upload failed:', cloudinaryError);
                    res.status(502).json({ error: 'Resume upload to Cloudinary failed. Please try again.' });
                    return;
                }
            }
            else {
                resumeUrl = `/uploads/${path_1.default.basename(resumeFile.path)}`;
            }
        }
        const createdApplication = yield jobApplication_model_1.default.create({
            fullName: resolvedFullName,
            firstName,
            lastName,
            email,
            phone,
            position: resolvedPosition,
            experience,
            coverLetter: resolvedCoverLetter,
            resume: resumeUrl,
        });
        // Best-effort email notification — never block a successful submission.
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                const transporter = nodemailer_1.default.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });
                yield transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: process.env.EMAIL_TO,
                    subject: `New Job Application: ${resolvedFullName}`,
                    text: `
Name: ${resolvedFullName}
Email: ${email}
Phone: ${phone}
Position: ${resolvedPosition}

Cover Letter:
${resolvedCoverLetter}
          `,
                    attachments: resumeFile
                        ? [
                            Object.assign({ filename: resumeFile.originalname }, (useCloudinary ? { content: resumeFile.buffer } : { path: resumeFile.path })),
                        ]
                        : [],
                });
            }
            catch (mailError) {
                console.error('Application email notification failed:', mailError);
            }
        }
        res.status(200).json({ message: 'Application sent successfully', application: createdApplication });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error sending application' });
    }
});
exports.submitApplication = submitApplication;
const getApplications = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applications = yield jobApplication_model_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(applications);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});
exports.getApplications = getApplications;
const deleteApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield jobApplication_model_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            res.status(404).json({ error: 'Application not found' });
            return;
        }
        res.status(200).json({ message: 'Application deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete application' });
    }
});
exports.deleteApplication = deleteApplication;
const bulkDeleteApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const ids = Array.isArray((_a = req.body) === null || _a === void 0 ? void 0 : _a.ids) ? req.body.ids : [];
        if (!ids.length) {
            res.status(400).json({ error: 'No application ids provided' });
            return;
        }
        yield jobApplication_model_1.default.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: 'Applications deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to bulk delete applications' });
    }
});
exports.bulkDeleteApplications = bulkDeleteApplications;
