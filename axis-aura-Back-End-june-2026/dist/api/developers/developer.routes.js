"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const developer_controller_1 = require("./developer.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
const useCloudinary = process.env.USE_CLOUDINARY === 'true';
// === Multer Config ===
const storage = useCloudinary
    ? multer_1.default.memoryStorage()
    : multer_1.default.diskStorage({
        destination(req, file, cb) {
            cb(null, path_1.default.join(__dirname, '..', '..', '..', 'uploads')); // Adjust path for local storage
        },
        filename(req, file, cb) {
            cb(null, Date.now() + path_1.default.extname(file.originalname));
        },
    });
// === File Filter (optional) ===
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
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
const fileFilter = (req, file, cb) => {
    const fileName = (file.originalname || '').toLowerCase();
    const isExecutableType = blockedExecutableTypes.includes(file.mimetype);
    const isExecutableExtension = blockedExecutableExtensions.some(ext => fileName.endsWith(ext));
    if (isExecutableType || isExecutableExtension) {
        return cb(new Error('Executable or script files are not allowed.'));
    }
    if (file.fieldname === 'logo') {
        const isSvg = file.mimetype === 'image/svg+xml' || fileName.endsWith('.svg');
        if (allowedImageTypes.includes(file.mimetype) || isSvg) {
            cb(null, true);
        }
        else {
            return cb(new Error('Only image files (jpeg, png, webp, svg) are allowed for the logo.'));
        }
    }
    else {
        cb(null, true); // allow other fields if added later
    }
};
const upload = (0, multer_1.default)({ storage, fileFilter });
// === Routes ===
// Public read access
router.get('/', developer_controller_1.getDevelopers);
router.get('/:id', developer_controller_1.getDeveloperById);
// Write access restricted to Super Admin only
router.post('/', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, upload.single('logo'), developer_controller_1.createDeveloper);
router.put('/:id', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, upload.single('logo'), developer_controller_1.updateDeveloper);
router.delete('/:id', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, developer_controller_1.deleteDeveloper);
exports.default = router;
