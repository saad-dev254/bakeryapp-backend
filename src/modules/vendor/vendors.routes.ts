import { Router } from "express";
import authenticateToken from "../../middlewares/auth";
import { createVendor, deleteVendor, getAllVendors, getSingleVendor, updateVendor } from "./vendor.controller";
import { requireAuth } from "../auth/auth.middleware";
import { vendorImageUpload } from "../../utils/upload";

export const vendorRouter = Router();

// protected
// vendorRouter.post("/add-vendor", requireAuth, vendorImageUpload.single("bakeryImage"), createVendor);
vendorRouter.post("/add-vendor", requireAuth,
    vendorImageUpload.fields([
      { name: "bakeryImage", maxCount: 1 },
      { name: "vendorCnicFrontImage", maxCount: 1 },
      { name: "vendorCnicBackImage", maxCount: 1 },
      { name: "bakeryLogo", maxCount: 1 },
      { name: "ntnImage", maxCount: 1 },
      { name: "foodLicenseImage", maxCount: 1 },
      { name: "kitchenImages", maxCount: 10 }, // Accept array: 1 or more images
    ]),
    createVendor
);
vendorRouter.put("/update-vendor", requireAuth, vendorImageUpload.single("bakeryImage"), updateVendor);
vendorRouter.post("/all-vendors", requireAuth, getAllVendors);
vendorRouter.post("/get-vendor-detail", requireAuth, getSingleVendor);
vendorRouter.delete("/delete-vendor", authenticateToken, deleteVendor);
  