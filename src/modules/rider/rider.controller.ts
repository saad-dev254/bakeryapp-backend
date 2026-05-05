import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../auth/auth.middleware";
import * as RiderService from "./rider.service";
import { createRiderSchema, updateRiderSchema } from "./rider.validation";
import { env } from "../../config/env";

export const createRider = asyncHandler(async (req: AuthRequest, res: Response) => {
    const uploadedFile = (req as Request & { file?: Express.Multer.File }).file;
    if (uploadedFile) {
        req.body.riderImage = `${env.APP_URL}/uploads/riders/${uploadedFile.filename}`;
    }
    const { riderId } = req.body;
    const dto = createRiderSchema.parse(req.body);
    const rider = await RiderService.createRider(riderId, dto);
    res.status(201).json({ success: true, message: `Rider created`, data: rider });
});

export const updateRider = asyncHandler(async (req: AuthRequest, res: Response) => {
    const uploadedFile = (req as Request & { file?: Express.Multer.File }).file;
    if (uploadedFile) {
        req.body.riderImage = `${env.APP_URL}/uploads/riders/${uploadedFile.filename}`;
    }
    const { id } = req.body;
    const dto = updateRiderSchema.parse(req.body);
    const rider = await RiderService.updateRider(id, dto);
    res.json({ success: true, message: "Profile updated", data: rider });
});

export const getAllRiders = asyncHandler(async (req: AuthRequest, res: Response) => {
    const riders = await RiderService.getAllRiders();
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