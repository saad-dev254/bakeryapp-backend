import { Router } from "express";
import authenticateToken from "../../middlewares/auth";
import { createVendor, deleteVendor, getAllVendors, getSingleVendor, updateVendor } from "./vendor.controller";
import { requireAuth } from "../auth/auth.middleware";
import { vendorImageUpload } from "../../utils/upload";

export const vendorRouter = Router();

// protected
vendorRouter.post("/add-vendor", requireAuth, vendorImageUpload.single("bakeryImage"), createVendor);
vendorRouter.put("/update-vendor", requireAuth, vendorImageUpload.single("bakeryImage"), updateVendor);
vendorRouter.post("/all-vendors", requireAuth, getAllVendors);
vendorRouter.post("/get-vendor-detail", requireAuth, getSingleVendor);
vendorRouter.delete("/delete-vendor", authenticateToken, deleteVendor);
  