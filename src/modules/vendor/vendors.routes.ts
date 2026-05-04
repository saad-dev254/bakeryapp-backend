import { Router } from "express";
import authenticateToken from "../../middlewares/auth";
import { createVendor, deleteVendor, getAllVendors, getSingleVendor, updateVendor } from "./vendor.controller";
import { requireAuth } from "../auth/auth.middleware";

export const vendorRouter = Router();

// protected
vendorRouter.post("/add-vendor", requireAuth, createVendor);
vendorRouter.put("/update-vendor", requireAuth, updateVendor);
vendorRouter.get("/all-vendors", requireAuth, getAllVendors);
vendorRouter.post("/get-vendor-detail", requireAuth, getSingleVendor);
vendorRouter.delete("/delete-vendor", authenticateToken, deleteVendor);
  
