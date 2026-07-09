"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.requireSuperAdmin = requireSuperAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.JWT_SECRET;
function getTokenFromRequest(req) {
    var _a;
    const header = req.headers.authorization;
    if (header === null || header === void 0 ? void 0 : header.startsWith('Bearer ')) {
        return header.slice(7);
    }
    if ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token) {
        return req.cookies.token;
    }
    return null;
}
function authenticate(req, res, next) {
    if (!SECRET) {
        res.status(500).json({ message: 'JWT_SECRET is not configured' });
        return;
    }
    const token = getTokenFromRequest(req);
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        req.authUser = decoded;
        next();
    }
    catch (_a) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}
function requireSuperAdmin(req, res, next) {
    var _a;
    if (((_a = req.authUser) === null || _a === void 0 ? void 0 : _a.role) !== 'Super Admin') {
        res.status(403).json({ message: 'Super Admin access required' });
        return;
    }
    next();
}
