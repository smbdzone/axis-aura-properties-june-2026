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
exports.updateRolePermissions = exports.getRolePermissions = exports.getUserById = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const cloudinaryClient_1 = __importDefault(require("../../services/cloudinaryClient"));
const stream_1 = require("stream");
const useCloudinary = process.env.USE_CLOUDINARY === 'true';
const PERMISSION_KEYS = [
    'dashboard',
    'properties',
    'newsAndRegulations',
    'developers',
    'careers',
    'jobApplications',
    'comments',
    'faqs',
    'manageUsers',
];
const getDefaultPermissionsByRole = (role) => {
    if (role === 'Super Admin') {
        return PERMISSION_KEYS.reduce((acc, key) => {
            acc[key] = { view: true, edit: true };
            return acc;
        }, {});
    }
    return PERMISSION_KEYS.reduce((acc, key) => {
        acc[key] = { view: false, edit: false };
        return acc;
    }, {});
};
const normalizePermissions = (input, role) => {
    const base = getDefaultPermissionsByRole(role);
    if (!input || typeof input !== 'object')
        return base;
    const normalized = Object.assign({}, base);
    for (const key of PERMISSION_KEYS) {
        const access = input[key];
        if (access && typeof access === 'object') {
            normalized[key] = {
                view: !!access.view,
                edit: !!access.edit,
            };
        }
    }
    if (role === 'Super Admin') {
        return getDefaultPermissionsByRole(role);
    }
    return normalized;
};
const uploadProfilePictureToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new Promise((resolve, reject) => {
        const uploadStream = cloudinaryClient_1.default.uploader.upload_stream({ folder: 'suits-and-sand/users', resource_type: 'image' }, (error, result) => {
            if (error || !(result === null || result === void 0 ? void 0 : result.secure_url)) {
                return reject(error || new Error('Cloudinary upload failed'));
            }
            resolve(result.secure_url);
        });
        stream_1.Readable.from(file.buffer).pipe(uploadStream);
    });
});
// =============================
// GET ALL USERS
// =============================
const getUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getUsers = getUsers;
// =============================
// CREATE USER
// =============================
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password, role, status } = req.body;
        const profilePictureFile = req.file;
        if (!fullName || !email || !password || !role || typeof status === 'undefined') {
            res.status(400).json({ message: 'Please provide all required fields.' });
            return;
        }
        let profilePictureUrl = '';
        if (profilePictureFile) {
            profilePictureUrl = useCloudinary
                ? yield uploadProfilePictureToCloudinary(profilePictureFile)
                : `/uploads/${profilePictureFile.filename}`;
        }
        const newUser = new user_model_1.default({
            fullName,
            email,
            password, // Make sure to hash this in production!
            role,
            status,
            profilePicture: profilePictureUrl || undefined,
            permissions: getDefaultPermissionsByRole(role),
        });
        yield newUser.save();
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error('Create User Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createUser = createUser;
// =============================
// UPDATE USER
// =============================
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { fullName, email, password, role, status } = req.body;
        const profilePictureFile = req.file;
        const existingUser = yield user_model_1.default.findById(id);
        if (!existingUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const updateData = {
            fullName,
            email,
            password,
            role,
            status,
        };
        if (profilePictureFile) {
            updateData.profilePicture = useCloudinary
                ? yield uploadProfilePictureToCloudinary(profilePictureFile)
                : `/uploads/${profilePictureFile.filename}`;
        }
        if (role && role !== existingUser.role) {
            updateData.permissions = getDefaultPermissionsByRole(role);
        }
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(id, updateData, { new: true });
        res.json(updatedUser);
    }
    catch (error) {
        console.error('Update User Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateUser = updateUser;
// =============================
// DELETE USER
// =============================
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_model_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteUser = deleteUser;
// =============================
// GET USER BY ID
// =============================
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getUserById = getUserById;
const getRolePermissions = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = ['Super Admin', 'Maintenance', 'Marketing'];
        const response = {};
        for (const role of roles) {
            const anyUser = yield user_model_1.default.findOne({ role }).select('permissions');
            response[role] = normalizePermissions(anyUser === null || anyUser === void 0 ? void 0 : anyUser.permissions, role);
        }
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getRolePermissions = getRolePermissions;
const updateRolePermissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role } = req.params;
        if (!['Super Admin', 'Maintenance', 'Marketing'].includes(role)) {
            res.status(400).json({ message: 'Invalid role' });
            return;
        }
        const permissions = normalizePermissions(req.body.permissions, role);
        yield user_model_1.default.updateMany({ role }, { $set: { permissions } });
        res.status(200).json({ role, permissions });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateRolePermissions = updateRolePermissions;
