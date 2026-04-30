import { Router } from "express";
import authenticateToken from "../../middlewares/auth";
import { createVendor, deleteVendor, getAllVendors, getSingleVendor, updateVendor } from "./vendor.controller";
import { requireAuth } from "../auth/auth.middleware";

export const vendorRouter = Router();

// protected
vendorRouter.post("/add-vendor", authenticateToken, createVendor);
vendorRouter.put("/update-vendor/:id", authenticateToken, updateVendor);
vendorRouter.get("/vendors", authenticateToken, getAllVendors);
vendorRouter.get("/vendor/:id", authenticateToken, getSingleVendor);
vendorRouter.delete("/vendor/:id", authenticateToken, deleteVendor);
  
