import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../auth/auth.middleware";
import * as VendorService from "./vendor.service";
import { createVendorSchema, updateVendorSchema } from "./vendor.validation";

export const createVendor = asyncHandler(async (req: AuthRequest, res: Response) => {
    const files = (req as Request & { files?: Record<string, Express.Multer.File[]> }).files;
    const bakeryLogo = files?.bakeryLogo?.[0];
    const bakeryImage = files?.bakeryImage?.[0];
    const vendorCnicFrontImage = files?.vendorCnicFrontImage?.[0];
    const vendorCnicBackImage = files?.vendorCnicBackImage?.[0];
    const ntnImage = files?.ntnImage?.[0];
    const foodLicenseImage = files?.foodLicenseImage?.[0];
    const kitchenImageFiles = files?.kitchenImages || [];

    if (bakeryLogo) req.body.bakeryLogo = `/uploads/vendors/${bakeryLogo.filename}`;
    if (bakeryImage) req.body.bakeryImage = `/uploads/vendors/${bakeryImage.filename}`;
    if (vendorCnicFrontImage) req.body.vendorCnicFrontImage = `/uploads/vendors/${vendorCnicFrontImage.filename}`;
    if (vendorCnicBackImage) req.body.vendorCnicBackImage = `/uploads/vendors/${vendorCnicBackImage.filename}`;
    if (ntnImage) req.body.ntnImage = `/uploads/vendors/${ntnImage.filename}`;
    if (foodLicenseImage) req.body.foodLicenseImage = `/uploads/vendors/${foodLicenseImage.filename}`;
    // Handle kitchenImages (multiple images: 0, 1, or many)
    if (kitchenImageFiles.length > 0) {
        req.body.kitchenImages = kitchenImageFiles.map(img =>
            `/uploads/vendors/${img.filename}`
        );
    } else {
        req.body.kitchenImages = []; // For consistency if none uploaded
    }

    const { vendorId } = req.body;
    const dto = createVendorSchema.parse(req.body);
    const vendor = await VendorService.createVendor(vendorId, dto);
    res.status(201).json({ success: true, message: `Vendor created`, data: vendor });
});

export const updateVendor = asyncHandler(async (req: AuthRequest, res: Response) => {
    const files = (req as Request & { files?: Record<string, Express.Multer.File[]> }).files;
    const bakeryLogo = files?.bakeryLogo?.[0];
    const bakeryImage = files?.bakeryImage?.[0];
    const vendorCnicFrontImage = files?.vendorCnicFrontImage?.[0];
    const vendorCnicBackImage = files?.vendorCnicBackImage?.[0];
    const ntnImage = files?.ntnImage?.[0];
    const foodLicenseImage = files?.foodLicenseImage?.[0];
    const kitchenImageFiles = files?.kitchenImages || [];

    if (bakeryLogo) req.body.bakeryLogo = `/uploads/vendors/${bakeryLogo.filename}`;
    if (bakeryImage) req.body.bakeryImage = `/uploads/vendors/${bakeryImage.filename}`;
    if (vendorCnicFrontImage) req.body.vendorCnicFrontImage = `/uploads/vendors/${vendorCnicFrontImage.filename}`;
    if (vendorCnicBackImage) req.body.vendorCnicBackImage = `/uploads/vendors/${vendorCnicBackImage.filename}`;
    if (ntnImage) req.body.ntnImage = `/uploads/vendors/${ntnImage.filename}`;
    if (foodLicenseImage) req.body.foodLicenseImage = `/uploads/vendors/${foodLicenseImage.filename}`;
    // Handle kitchenImages (multiple images: 0, 1, or many)
    if (kitchenImageFiles.length > 0) {
        req.body.kitchenImages = kitchenImageFiles.map(img =>
            `/uploads/vendors/${img.filename}`
        );
    } else {
        req.body.kitchenImages = [];
    }
    
    const { id } = req.body;
    const dto = updateVendorSchema.parse(req.body);
    const vendor = await VendorService.updateVendor(id, dto);
    res.json({ success: true, message: "Profile updated", data: vendor });
});

export const getAllVendors = asyncHandler(async (req: AuthRequest, res: Response) => {
    const vendors = await VendorService.getAllVendors(req.body?.approvalStatus, req.body?.page, req.body?.limit);
    res.json({ success: true, data: vendors });
});

export const getSingleVendor = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    const vendor = await VendorService.getSingleVendor(id);
    res.json({ success: true, data: vendor });
});

export const deleteVendor = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    await VendorService.deleteVendor(id);
    res.json({ success: true, message: "Vendor deleted" });
});
