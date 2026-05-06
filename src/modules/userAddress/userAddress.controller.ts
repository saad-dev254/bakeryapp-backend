import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../auth/auth.middleware";
import * as AddressService from "./userAddress.service";
import { createUserAddressSchema, updateUserAddressSchema } from "./userAddress.validation";

export const createUserAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId } = req.body;
    const dto = createUserAddressSchema.parse(req.body);
    const address = await AddressService.createUserAddress(userId, dto);
    res.status(201).json({ success: true, message: `Address created`, data: address });
});

export const updateUserAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    const dto = updateUserAddressSchema.parse(req.body);
    const address = await AddressService.updateUserAddress(id, dto);
    res.json({ success: true, message: "Address updated", data: address });
});

export const getAllUserAddresses = asyncHandler(async (req: AuthRequest, res: Response) => {
    const address = await AddressService.getAllUserAddresses(req.body?.userId);
    res.json({ success: true, data: address });
});

export const getSingleUserAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    const address = await AddressService.getSingleUserAddress(id);
    res.json({ success: true, data: address });
});

export const deleteUserAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    await AddressService.deleteUserAddress(id);
    res.json({ success: true, message: "Address deleted" });
});
