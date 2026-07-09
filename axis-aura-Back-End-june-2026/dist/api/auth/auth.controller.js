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
exports.getAdminProfile = exports.logoutAdmin = exports.registerAdmin = exports.bootstrapSuperAdmin = exports.loginAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}
const defaultSuperAdminPermissions = {
    dashboard: { view: true, edit: true },
    properties: { view: true, edit: true },
    newsAndRegulations: { view: true, edit: true },
    developers: { view: true, edit: true },
    careers: { view: true, edit: true },
    jobApplications: { view: true, edit: true },
    comments: { view: true, edit: true },
    faqs: { view: true, edit: true },
    manageUsers: { view: true, edit: true },
};
function verifyPassword(stored, input) {
    return __awaiter(this, void 0, void 0, function* () {
        if (stored.startsWith('$2b$') || stored.startsWith('$2a$')) {
            return bcrypt_1.default.compare(input, stored);
        }
        return stored === input;
    });
}
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcrypt_1.default.hash(password, 10);
    });
}
function issueToken(user) {
    return jsonwebtoken_1.default.sign({ id: user._id, role: user.role, email: user.email }, SECRET, {
        expiresIn: '8h',
    });
}
function setAuthCookie(res, token) {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 8 * 60 * 60 * 1000,
    });
}
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (!user || user.status !== 'active') {
            res.status(401).json({ message: 'Invalid credentials or inactive user' });
            return;
        }
        const valid = yield verifyPassword(user.password, password);
        if (!valid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = issueToken(user);
        setAuthCookie(res, token);
        res.status(200).json({
            success: true,
            token,
            role: user.role,
            user: {
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
            },
        });
    }
    catch (_a) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.loginAdmin = loginAdmin;
const bootstrapSuperAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield user_model_1.default.countDocuments();
        if (count > 0) {
            res.status(403).json({ message: 'Bootstrap disabled. Super Admin already exists.' });
            return;
        }
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            res.status(400).json({ message: 'fullName, email, and password are required' });
            return;
        }
        const hashed = yield hashPassword(password);
        const user = yield user_model_1.default.create({
            fullName,
            email,
            password: hashed,
            role: 'Super Admin',
            status: 'active',
            permissions: defaultSuperAdminPermissions,
        });
        const token = issueToken(user);
        setAuthCookie(res, token);
        res.status(201).json({
            success: true,
            message: 'Super Admin created',
            token,
            user: {
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Server error';
        res.status(500).json({ message });
    }
});
exports.bootstrapSuperAdmin = bootstrapSuperAdmin;
const registerAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password, role, status } = req.body;
        if (!fullName || !email || !password || !role) {
            res.status(400).json({ message: 'fullName, email, password, and role are required' });
            return;
        }
        const allowedRoles = ['Super Admin', 'Maintenance', 'Marketing'];
        if (!allowedRoles.includes(role)) {
            res.status(400).json({ message: 'Invalid role' });
            return;
        }
        const existing = yield user_model_1.default.findOne({ email });
        if (existing) {
            res.status(409).json({ message: 'Email already registered' });
            return;
        }
        const hashed = yield hashPassword(password);
        const user = yield user_model_1.default.create({
            fullName,
            email,
            password: hashed,
            role,
            status: status === 'inactive' ? 'inactive' : 'active',
        });
        res.status(201).json({
            success: true,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                status: user.status,
            },
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Server error';
        res.status(500).json({ message });
    }
});
exports.registerAdmin = registerAdmin;
const logoutAdmin = (_req, res) => {
    res.clearCookie('token', { path: '/' });
    res.status(200).json({ message: 'Logged out' });
};
exports.logoutAdmin = logoutAdmin;
const getAdminProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '')) || ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b.token);
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        const user = yield user_model_1.default.findById(decoded.id).select('fullName role email profilePicture phone permissions status');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ user });
    }
    catch (_c) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});
exports.getAdminProfile = getAdminProfile;
