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

    // Support kitchenImages passed from form-data or already existing in body (as JSON strings or URLs)
    let kitchenImagesArr: string[] = [];

    // If kitchenImages sent as files via multer (as expected for uploads)
    if (files?.kitchenImages && Array.isArray(files.kitchenImages) && files.kitchenImages.length > 0) {
        kitchenImagesArr = files.kitchenImages.map(img => `/uploads/vendors/${img.filename}`);
    }
    // If user sends kitchenImages as array of URLs (edit or from Postman etc), add those also
    if (req.body.kitchenImages) {
        // Could be a stringified array, a comma separated string, or plain string/array
        let imagesFromBody = [];
        if (Array.isArray(req.body.kitchenImages)) {
            imagesFromBody = req.body.kitchenImages;
        } else if (typeof req.body.kitchenImages === "string") {
            try {
                // Try parsing as JSON array
                imagesFromBody = JSON.parse(req.body.kitchenImages);
                if (!Array.isArray(imagesFromBody)) imagesFromBody = [req.body.kitchenImages];
            } catch {
                // Fall back to comma-separated
                imagesFromBody = req.body.kitchenImages.split(",");
            }
        }
        // Filter out empty or duplicate entries
        imagesFromBody = imagesFromBody.map((img: string) => img.trim()).filter(Boolean);
        // Merge with multer-uploaded files
        kitchenImagesArr = [...kitchenImagesArr, ...imagesFromBody].filter((v, i, a) => a.indexOf(v) === i);
    }

    // Finally, assign the merged (non-empty) array to body, or empty array if none
    req.body.kitchenImages = kitchenImagesArr.length > 0 ? kitchenImagesArr : [];

    if (bakeryLogo) req.body.bakeryLogo = `/uploads/vendors/${bakeryLogo.filename}`;
    if (bakeryImage) req.body.bakeryImage = `/uploads/vendors/${bakeryImage.filename}`;
    if (vendorCnicFrontImage) req.body.vendorCnicFrontImage = `/uploads/vendors/${vendorCnicFrontImage.filename}`;
    if (vendorCnicBackImage) req.body.vendorCnicBackImage = `/uploads/vendors/${vendorCnicBackImage.filename}`;
    if (ntnImage) req.body.ntnImage = `/uploads/vendors/${ntnImage.filename}`;
    if (foodLicenseImage) req.body.foodLicenseImage = `/uploads/vendors/${foodLicenseImage.filename}`;

    console.log("req.body ====> ", req.body);

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
