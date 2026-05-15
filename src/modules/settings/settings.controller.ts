import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../auth/auth.middleware";
import * as SettingsService from "./settings.service";
import { createSettingsSchema, updateSettingsSchema } from "./settings.validation";

export const createSettings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const dto = createSettingsSchema.parse(req.body);
    const settings = await SettingsService.createSettings(dto);
    res.status(201).json({ success: true, message: `Settings created`, data: settings });
});

export const updateSetting = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    const dto = updateSettingsSchema.parse(req.body);
    const settings = await SettingsService.updateSetting(id, dto);
    res.json({ success: true, message: "Setting updated", data: settings });
});

export const getAllSettings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const settings = await SettingsService.getAllSettings();
    res.json({ success: true, data: settings });
});

export const getSingleASetting = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    const settings = await SettingsService.getSingleASetting(id);
    res.json({ success: true, data: settings });
});

export const deleteSetting = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    await SettingsService.deleteSetting(id);
    res.json({ success: true, message: "Setting deleted" });
});
