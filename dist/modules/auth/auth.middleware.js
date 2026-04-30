"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
const httpError_1 = require("../../utils/httpError");
const auth_tokens_1 = require("./auth.tokens");
function requireAuth(req, _res, next) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer "))
        throw new httpError_1.HttpError(401, "Missing auth token");
    const token = auth.slice("Bearer ".length);
    const payload = (0, auth_tokens_1.verifyAccessToken)(token);
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    next();
}
function requireRole(...roles) {
    return (req, _res, next) => {
        if (!req.user)
            throw new httpError_1.HttpError(401, "Unauthorized");
        if (!roles.includes(req.user.role))
            throw new httpError_1.HttpError(403, "Forbidden");
        next();
    };
}
