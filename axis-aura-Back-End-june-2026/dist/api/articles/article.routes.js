"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const article_controller_1 = require("./article.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const path_1 = __importDefault(require("path"));
const useCloudinary = process.env.USE_CLOUDINARY === 'true';
const router = express_1.default.Router();
// Multer config for file upload
const storage = useCloudinary
    ? multer_1.default.memoryStorage()
    : multer_1.default.diskStorage({
        destination: function (_req, _file, cb) {
            cb(null, path_1.default.join(__dirname, '..', '..', '..', 'uploads'));
        },
        filename: function (_req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    });
const upload = (0, multer_1.default)({ storage });
// Routes
// Public read access (shown on the public site)
router.get('/', article_controller_1.getArticles);
router.get('/:id', article_controller_1.getArticleById);
// Write access restricted to Super Admin only
router.post('/', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, upload.fields([{ name: 'banner', maxCount: 1 }, { name: 'seoImage', maxCount: 1 }]), article_controller_1.createArticle);
router.put('/:id', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, upload.fields([{ name: 'banner', maxCount: 1 }, { name: 'seoImage', maxCount: 1 }]), article_controller_1.updateArticle);
router.delete('/:id', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, article_controller_1.deleteArticle);
router.post('/bulk-delete', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, article_controller_1.bulkDeleteArticles);
exports.default = router;
