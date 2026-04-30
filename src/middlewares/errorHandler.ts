import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../utils/logger";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  // Zod validation errors
  if (err instanceof ZodError) {
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

  logger.error(
    { err, path: req.originalUrl, method: req.method },
    "Unhandled error",
  );

  res.status(status).json({
    success: false,
    message,
  });
}
