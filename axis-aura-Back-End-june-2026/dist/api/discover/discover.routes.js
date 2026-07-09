"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const discover_controller_1 = require("./discover.controller");
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
            cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path_1.default.extname(file.originalname));
        },
    });
const fileFilter = (_req, file, cb) => {
    if (file.fieldname === 'video') {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only video files are allowed for the video field.'));
        }
        return;
    }
    if (file.fieldname === 'thumbnail') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed for the thumbnail.'));
        }
        return;
    }
    cb(null, true);
};
// Allow up to 150MB video uploads
const upload = (0, multer_1.default)({ storage, fileFilter, limits: { fileSize: 150 * 1024 * 1024 } });
const uploadFields = upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
]);
// === Routes ===
// Public read access
router.get('/', discover_controller_1.getDiscoverItems);
router.get('/:id', discover_controller_1.getDiscoverById);
// Write access restricted to Super Admin only
router.post('/', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, uploadFields, discover_controller_1.createDiscover);
router.put('/:id', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, uploadFields, discover_controller_1.updateDiscover);
router.delete('/:id', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, discover_controller_1.deleteDiscover);
exports.default = router;
