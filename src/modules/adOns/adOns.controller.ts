import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../auth/auth.middleware";
import * as AdOnService from "./adOns.service";
import { createAdOnSchema, updateAdOnSchema } from "./adOns.validation";

export const createAdOn = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { vendorId } = req.body;
    const dto = createAdOnSchema.parse(req.body);
    const adOn = await AdOnService.createAdOn(vendorId, dto);
    res.status(201).json({ success: true, message: `AdOn created`, data: adOn });
});

export const updateAdOn = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    const dto = updateAdOnSchema.parse(req.body);
    const adOn = await AdOnService.updateAdOn(id, dto);
    res.json({ success: true, message: "AdOn updated", data: adOn });
});

export const getAllAdOn = asyncHandler(async (req: AuthRequest, res: Response) => {
    const adOn = await AdOnService.getAllAdOn(req.body?.vendorId);
    res.json({ success: true, data: adOn });
});

export const getSingleAdOn = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    const adOn = await AdOnService.getSingleAdOn(id);
    res.json({ success: true, data: adOn });
});

export const deleteAdOn = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    await AdOnService.deleteAdOn(id);
    res.json({ success: true, message: "AdOn deleted" });
});
