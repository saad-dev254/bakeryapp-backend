import { Router } from "express";
import cookieParser from "cookie-parser";
import {
  adminCreateUser,
  changePassword,
  createUser,
  deleteMe,
  forgotPassword,
  login,
  logout,
  me,
  refresh,
  resetPassword,
  updateMe
} from "./auth.controller";
import { requireAuth, requireRole } from "./auth.middleware";

export const authRouter = Router();

authRouter.use(cookieParser());

// public
authRouter.post("/create-user", createUser); // working fine 
authRouter.post("/login", login); // working fine 
authRouter.post("/refresh", refresh);
authRouter.post("/forgot-password", forgotPassword);  // working fine but wee need to send reset token on phoneNumber not email
authRouter.post("/reset-password", resetPassword);  // working fine 

// protected
authRouter.get("/me", requireAuth, me); // working fine 
authRouter.patch("/me", requireAuth, updateMe); // working fine 
authRouter.delete("/me", requireAuth, deleteMe); // working fine 

authRouter.post("/logout", requireAuth, logout);  // working fine 
authRouter.post("/change-password", requireAuth, changePassword); // working fine 

// admin-only: admin creates users
authRouter.post("/admin/users", requireAuth, requireRole("ADMIN"), adminCreateUser);
