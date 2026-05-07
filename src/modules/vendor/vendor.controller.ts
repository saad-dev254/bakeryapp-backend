import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../auth/auth.middleware";
import * as VendorService from "./vendor.service";
import { createVendorSchema, updateVendorSchema } from "./vendor.validation";
import { env } from "../../config/env";

export const createVendor = asyncHandler(async (req: AuthRequest, res: Response) => {
    const uploadedFile = (req as Request & { file?: Express.Multer.File }).file;
    if (uploadedFile) {
        req.body.bakeryImage = `${env.APP_URL}/uploads/vendors/${uploadedFile.filename}`;
    }
    if (typeof req.body.bakeryLatitude === "string") {
        req.body.bakeryLatitude = Number(req.body.bakeryLatitude);
    }
    if (typeof req.body.bakeryLongitude === "string") {
        req.body.bakeryLongitude = Number(req.body.bakeryLongitude);
    }
    const { vendorId } = req.body;
    const dto = createVendorSchema.parse(req.body);
    const vendor = await VendorService.createVendor(vendorId, dto);
    res.status(201).json({ success: true, message: `Vendor created`, data: vendor });
});

export const updateVendor = asyncHandler(async (req: AuthRequest, res: Response) => {
    const uploadedFile = (req as Request & { file?: Express.Multer.File }).file;
    if (uploadedFile) {
        req.body.bakeryImage = `${env.APP_URL}/uploads/vendors/${uploadedFile.filename}`;
    }
    if (typeof req.body.bakeryLatitude === "string") {
        req.body.bakeryLatitude = Number(req.body.bakeryLatitude);
    }
    if (typeof req.body.bakeryLongitude === "string") {
        req.body.bakeryLongitude = Number(req.body.bakeryLongitude);
    }
    const { id } = req.body;
    const dto = updateVendorSchema.parse(req.body);
    const vendor = await VendorService.updateVendor(id, dto);
    res.json({ success: true, message: "Profile updated", data: vendor });
});

export const getAllVendors = asyncHandler(async (req: AuthRequest, res: Response) => {
    const vendors = await VendorService.getAllVendors(req.body?.isApproved);
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
