import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../auth/auth.middleware";
import * as AddOnService from "./addOns.service";
import { createAddOnSchema, updateAddOnSchema } from "./addOns.validation";

export const createAddOn = asyncHandler(async (req: AuthRequest, res: Response) => {
    const dto = createAddOnSchema.parse(req.body);
    const addOn = await AddOnService.createAddOn(dto);
    res.status(201).json({ success: true, message: `AddOn created`, data: addOn });
});

export const updateAddOn = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    const dto = updateAddOnSchema.parse(req.body);
    const addOn = await AddOnService.updateAddOn(id, dto);
    res.json({ success: true, message: "AddOn updated", data: addOn });
});

export const getAllAddOn = asyncHandler(async (req: AuthRequest, res: Response) => {
    const addOn = await AddOnService.getAllAddOn();
    res.json({ success: true, data: addOn });
});

export const getSingleAddOn = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    const addOn = await AddOnService.getSingleAddOn(id);
    res.json({ success: true, data: addOn });
});

export const deleteAddOn = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    await AddOnService.deleteAddOn(id);
    res.json({ success: true, message: "AddOn deleted" });
});
