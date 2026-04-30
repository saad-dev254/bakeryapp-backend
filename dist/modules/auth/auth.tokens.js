"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
exports.hashValue = hashValue;
exports.compareHash = compareHash;
exports.createResetToken = createResetToken;
exports.sha256 = sha256;
const jwt = __importStar(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
function signOptions(expiresIn) {
    return { expiresIn };
}
function signAccessToken(payload) {
    const secret = env_1.env.JWT_ACCESS_SECRET;
    return jwt.sign(payload, secret, signOptions(env_1.env.JWT_ACCESS_EXPIRES_IN));
}
function signRefreshToken(payload) {
    const secret = env_1.env.JWT_REFRESH_SECRET;
    return jwt.sign(payload, secret, signOptions(env_1.env.JWT_REFRESH_EXPIRES_IN));
}
function verifyAccessToken(token) {
    const secret = env_1.env.JWT_ACCESS_SECRET;
    return jwt.verify(token, secret);
}
function verifyRefreshToken(token) {
    const secret = env_1.env.JWT_REFRESH_SECRET;
    return jwt.verify(token, secret);
}
async function hashValue(value) {
    const salt = await bcryptjs_1.default.genSalt(10);
    return bcryptjs_1.default.hash(value, salt);
}
async function compareHash(value, hash) {
    return bcryptjs_1.default.compare(value, hash);
}
function createResetToken() {
    const raw = crypto_1.default.randomBytes(32).toString("hex");
    const hash = crypto_1.default.createHash("sha256").update(raw).digest("hex");
    return { raw, hash };
}
function sha256(input) {
    return crypto_1.default.createHash("sha256").update(input).digest("hex");
}
