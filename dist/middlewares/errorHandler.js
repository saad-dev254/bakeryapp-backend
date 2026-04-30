"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const logger_1 = require("../utils/logger");
function errorHandler(err, req, res, _next) {
    // Zod validation errors
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: err.issues.map((i) => ({
                path: i.path.join("."),
                message: i.message,
            })),
        });
    }
    const status = Number(err?.statusCode || err?.status || 500);
    const message = err?.message || "Something went wrong";
    logger_1.logger.error({ err, path: req.originalUrl, method: req.method }, "Unhandled error");
    res.status(status).json({
        success: false,
        message,
    });
}
