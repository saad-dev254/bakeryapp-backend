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

    // Always produce an array of string URLs for kitchenImages
    let kitchenImagesArr: string[] = [];

    // Handle files from multer
    if (Array.isArray(files?.kitchenImages) && files.kitchenImages.length > 0) {
        kitchenImagesArr = files.kitchenImages.map(img => {
            if (typeof img === "object" && img.filename) {
                return `/uploads/vendors/${img.filename}`;
            }
            return "";
        }).filter(Boolean); // Remove any empty strings
    }

    // Also support kitchenImages in body (might be sent as JSON string or array of urls)
    if (req.body.kitchenImages) {
        let imagesFromBody: string[] = [];
        if (Array.isArray(req.body.kitchenImages)) {
            // If array, map and stringify any object elements
            imagesFromBody = req.body.kitchenImages.map((img: any) =>
                typeof img === "string"
                    ? img
                    : (img && typeof img === "object" && img.url)
                    ? img.url
                    : ""
            ).filter(Boolean);
        } else if (typeof req.body.kitchenImages === "string") {
            // Try to parse JSON array, fallback to comma-split string
            try {
                const parsed = JSON.parse(req.body.kitchenImages);
                if (Array.isArray(parsed)) {
                    imagesFromBody = parsed.map((img: any) => 
                        typeof img === "string"
                            ? img
                            : (img && typeof img === "object" && img.url)
                            ? img.url
                            : ""
                    ).filter(Boolean);
                } else if (typeof parsed === "string") {
                    imagesFromBody = [parsed];
                }
            } catch {
                imagesFromBody = req.body.kitchenImages.split(",").map((img: string) => img.trim()).filter(Boolean);
            }
        }
        // Merge and de-duplicate
        kitchenImagesArr = [...kitchenImagesArr, ...imagesFromBody].filter((v, i, a) => a.indexOf(v) === i);
    }

    // Ensure kitchenImages is always a proper string array
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
