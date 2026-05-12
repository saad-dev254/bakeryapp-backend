import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../auth/auth.middleware";
import * as RiderService from "./rider.service";
import { createRiderSchema, updateRiderSchema } from "./rider.validation";

export const createRider = asyncHandler(async (req: AuthRequest, res: Response) => {
    const files = (req as Request & { files?: Record<string, Express.Multer.File[]> }).files;
    const riderImage = files?.riderImage?.[0];
    const riderCnicFrontImage = files?.riderCnicFrontImage?.[0];
    const riderCnicBackImage = files?.riderCnicBackImage?.[0];
    const drivingLicense = files?.drivingLicense?.[0];
    const bikeRegistrationCard = files?.bikeRegistrationCard?.[0];
    const riderSelfie = files?.riderSelfie?.[0];
    const policeCharacterCertificate = files?.policeCharacterCertificate?.[0];
    const bikeNumberPlateImage = files?.bikeNumberPlateImage?.[0];

    if (riderImage) req.body.riderImage = `/uploads/riders/${riderImage.filename}`;
    if (riderCnicFrontImage) req.body.riderCnicFrontImage = `/uploads/riders/${riderCnicFrontImage.filename}`;
    if (riderCnicBackImage) req.body.riderCnicBackImage = `/uploads/riders/${riderCnicBackImage.filename}`;
    if (drivingLicense) req.body.drivingLicense = `/uploads/riders/${drivingLicense.filename}`;
    if (bikeRegistrationCard) req.body.bikeRegistrationCard = `/uploads/riders/${bikeRegistrationCard.filename}`;
    if (riderSelfie) req.body.riderSelfie = `/uploads/riders/${riderSelfie.filename}`;
    if (policeCharacterCertificate) req.body.policeCharacterCertificate = `/uploads/riders/${policeCharacterCertificate.filename}`;
    if (bikeNumberPlateImage) req.body.bikeNumberPlateImage = `/uploads/riders/${bikeNumberPlateImage.filename}`;

    const { riderId } = req.body;
    const dto = createRiderSchema.parse(req.body);
    const rider = await RiderService.createRider(riderId, dto);
    res.status(201).json({ success: true, message: `Rider created`, data: rider });
});

export const updateRider = asyncHandler(async (req: AuthRequest, res: Response) => {
    const files = (req as Request & { files?: Record<string, Express.Multer.File[]> }).files;
    const riderImage = files?.riderImage?.[0];
    const riderCnicFrontImage = files?.riderCnicFrontImage?.[0];
    const riderCnicBackImage = files?.riderCnicBackImage?.[0];
    const drivingLicense = files?.drivingLicense?.[0];
    const bikeRegistrationCard = files?.bikeRegistrationCard?.[0];
    const riderSelfie = files?.riderSelfie?.[0];
    const policeCharacterCertificate = files?.policeCharacterCertificate?.[0];
    const bikeNumberPlateImage = files?.bikeNumberPlateImage?.[0];

    if (riderImage) req.body.riderImage = `/uploads/riders/${riderImage.filename}`;
    if (riderCnicFrontImage) req.body.riderCnicFrontImage = `/uploads/riders/${riderCnicFrontImage.filename}`;
    if (riderCnicBackImage) req.body.riderCnicBackImage = `/uploads/riders/${riderCnicBackImage.filename}`;
    if (drivingLicense) req.body.drivingLicense = `/uploads/riders/${drivingLicense.filename}`;
    if (bikeRegistrationCard) req.body.bikeRegistrationCard = `/uploads/riders/${bikeRegistrationCard.filename}`;
    if (riderSelfie) req.body.riderSelfie = `/uploads/riders/${riderSelfie.filename}`;
    if (policeCharacterCertificate) req.body.policeCharacterCertificate = `/uploads/riders/${policeCharacterCertificate.filename}`;
    if (bikeNumberPlateImage) req.body.bikeNumberPlateImage = `/uploads/riders/${bikeNumberPlateImage.filename}`;

    const { id } = req.body;
    const dto = updateRiderSchema.parse(req.body);
    const rider = await RiderService.updateRider(id, dto);
    res.json({ success: true, message: "Profile updated", data: rider });
});

export const getAllRiders = asyncHandler(async (req: AuthRequest, res: Response) => {
    const riders = await RiderService.getAllRiders(req.body?.isApproved, req.body?.page, req.body?.limit);
    res.json({ success: true, data: riders });
});

export const getSingleRider = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    const rider = await RiderService.getSingleRider(id);
    res.json({ success: true, data: rider });
});

export const deleteRider = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    await RiderService.deleteRider(id);
    res.json({ success: true, message: "Rider deleted" });
});
