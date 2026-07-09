"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const property_controller_1 = require("./property.controller");
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
            cb(null, Date.now() + '_' + file.originalname);
        },
    });
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const allowedBrochureTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
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
    const { fieldname, mimetype } = file;
    const fileName = (file.originalname || '').toLowerCase();
    const isExecutableType = blockedExecutableTypes.includes(mimetype);
    const isExecutableExtension = blockedExecutableExtensions.some(ext => fileName.endsWith(ext));
    const isBrochureField = fieldname === 'brochureFile';
    const isImageField = fieldname === 'propertyImages' ||
        fieldname === 'seoimage' ||
        fieldname === 'seoImage' ||
        /^floor_\d+_defaultLayout$/.test(fieldname) ||
        /^floor_\d+_unit_.+/.test(fieldname);
    if (isExecutableType || isExecutableExtension) {
        return cb(new Error('Executable or script files are not allowed.'));
    }
    if (isBrochureField) {
        if (allowedBrochureTypes.includes(mimetype)) {
            cb(null, true);
        }
        else {
            return cb(new Error('Only PDF or DOCX files are allowed for brochure.'));
        }
    }
    else if (isImageField) {
        if (allowedImageTypes.includes(mimetype)) {
            cb(null, true);
        }
        else {
            return cb(new Error('Only image files are allowed for layouts and units.'));
        }
    }
    else {
        return cb(new Error(`Unexpected file field: ${fieldname}`));
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 200 * 1024 * 1024 },
});
// === Upload Fields (dynamic floors/units) ===
const uploadFields = [
    { name: 'propertyImages', maxCount: 10 },
    { name: 'brochureFile', maxCount: 1 },
    { name: 'seoimage', maxCount: 1 },
];
for (let i = 0; i < 30; i++) {
    uploadFields.push({ name: `floor_${i}_defaultLayout`, maxCount: 1 });
    const unitTypes = ['Studio', '1_BHK', '2_BHK', '3_BHK', '2_BHK_Duplex', '3_BHK_Duplex', 'Penthouse'];
    for (const unit of unitTypes) {
        uploadFields.push({ name: `floor_${i}_unit_${unit}`, maxCount: 1 });
        for (let variantIndex = 0; variantIndex < 10; variantIndex++) {
            uploadFields.push({ name: `floor_${i}_unit_${unit}_variant_${variantIndex}_image`, maxCount: 1 });
            //uploadFields.push({ name: `floor_${i}_unit_${unit}_variant_${variantIndex}_name`, maxCount: 1 });
        }
    }
}
// === Routes ===
// Public read access
router.get('/', property_controller_1.getProperties);
router.get('/:id', property_controller_1.getPropertyById);
// Write access restricted to Super Admin only
router.post('/bulk-create', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, property_controller_1.bulkCreateProperties);
router.post('/', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, upload.fields(uploadFields), property_controller_1.createProperty);
router.post('/bulk-delete', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, property_controller_1.bulkDeleteProperties);
router.delete('/:id', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, property_controller_1.deleteProperty);
router.put('/:id', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, upload.fields(uploadFields), property_controller_1.updateProperty);
exports.default = router;
