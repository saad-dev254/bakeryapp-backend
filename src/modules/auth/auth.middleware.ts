import { NextFunction, Request, Response } from "express";
import { HttpError } from "../../utils/httpError";
import { verifyAccessToken } from "./auth.tokens";
import { UserRole } from "./user.model";

export type AuthRequest = Request & {
  user?: {
    id: string;
    role: UserRole;
    email: string;
  };
};

export function requireAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) throw new HttpError(401, "Missing auth token");

  const token = auth.slice("Bearer ".length);
  const payload = verifyAccessToken(token);

  req.user = { id: payload.sub, role: payload.role, email: payload.email };
  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) throw new HttpError(401, "Unauthorized");
    if (!roles.includes(req.user.role)) throw new HttpError(403, "Forbidden");
    next();
  };
}
