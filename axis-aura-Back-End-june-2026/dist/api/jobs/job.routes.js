"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const job_controller_1 = require("./job.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
const useCloudinary = process.env.USE_CLOUDINARY === 'true';
// === Multer Config ===
const storage = useCloudinary
    ? multer_1.default.memoryStorage()
    : multer_1.default.diskStorage({
        destination(req, file, cb) {
            cb(null, path_1.default.join(__dirname, '..', '..', '..', 'uploads'));
        },
        filename(req, file, cb) {
            cb(null, Date.now() + path_1.default.extname(file.originalname));
        },
    });
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'image') {
        if (allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            return cb(new Error('Only image files (jpeg, png, webp) are allowed.'));
        }
    }
    else {
        cb(null, true);
    }
};
const upload = (0, multer_1.default)({ storage, fileFilter });
// Public read access
router.get('/', job_controller_1.getJobs);
router.get('/positions', job_controller_1.getJobTitles);
router.get('/:id', job_controller_1.getJobById);
// Write access restricted to Super Admin only
router.post('/', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, upload.single('image'), job_controller_1.createJob);
router.put('/:id', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, upload.single('image'), job_controller_1.updateJob);
router.delete('/:id', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, job_controller_1.deleteJob);
exports.default = router;
