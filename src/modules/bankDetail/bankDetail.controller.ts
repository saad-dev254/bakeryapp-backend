import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../auth/auth.middleware";
import * as BankDetailService from "./bankDetail.service";
import { createBankDetailSchema, updateBankDetailSchema } from "./bankDetail.validation";

export const createBankDetail = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId } = req.body;
    const dto = createBankDetailSchema.parse(req.body);
    const bankDetail = await BankDetailService.createBankDetail(userId, dto);
    res.status(201).json({ success: true, message: `Bank Detail created`, data: bankDetail });
});

export const updateBankDetail = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    const dto = updateBankDetailSchema.parse(req.body);
    const bankDetail = await BankDetailService.updateBankDetail(id, dto);
    res.json({ success: true, message: "Bank Detail updated", data: bankDetail });
});

export const getAllBankDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
    const bankDetail = await BankDetailService.getAllBankDetails(req.body?.userId);
    res.json({ success: true, data: bankDetail });
});

export const getSingleBankDetail = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    const bankDetail = await BankDetailService.getSingleBankDetail(id);
    res.json({ success: true, data: bankDetail });
});

export const deleteBankDetail = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    await BankDetailService.deleteBankDetail(id);
    res.json({ success: true, message: "Bank Detail deleted" });
});
