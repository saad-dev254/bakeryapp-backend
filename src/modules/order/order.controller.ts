import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../auth/auth.middleware";
import * as OrderService from "./order.service";
import { createOrderSchema, updateOrderSchema } from "./order.validation";

export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const dto = createOrderSchema.parse(req.body);
    const category = await OrderService.createOrder(dto);
    res.status(201).json({ success: true, message: `Order created`, data: category });
});

export const updateOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    const dto = updateOrderSchema.parse(req.body);
    const order = await OrderService.updateOrder(id, dto);
    res.json({ success: true, message: "Order updated", data: order });
});

export const getAllOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
    const order = await OrderService.getAllOrders(req.body?.vendorId);
    res.json({ success: true, data: order });
});

export const getSingleOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    const order = await OrderService.getSingleOrder(id);
    res.json({ success: true, data: order });
});

export const deleteOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    await OrderService.deleteOrder(id);
    res.json({ success: true, message: "Order deleted" });
});
