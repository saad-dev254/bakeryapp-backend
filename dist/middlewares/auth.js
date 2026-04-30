"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Authentication middleware to verify token in request headers
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // Check if authorization header exists and has correct format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            code: 401,
            status: false,
            message: "No token provided or token format invalid",
        });
        return;
    }
    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({
            code: 401,
            status: false,
            message: "Unauthorized: No token",
        });
        return;
    }
    // TODO: Add JWT verification here if using JWT
    // Example with jsonwebtoken:
    // try {
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //     req.user = decoded;
    //     next();
    // } catch (err) {
    //     return res.status(403).json({
    //         code: 403,
    //         status: false,
    //         message: "Invalid or expired token",
    //     });
    // }
    // For now, just verify token exists
    // Attach token to request for potential use in routes
    req.token = token;
    next();
}
exports.default = authenticateToken;
