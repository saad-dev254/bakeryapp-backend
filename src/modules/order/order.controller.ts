import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../auth/auth.middleware";
import * as OrderService from "./order.service";
import { createOrderSchema, orderAnalyticsSchema, updateOrderSchema } from "./order.validation";

export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const dto = createOrderSchema.parse(req.body);
    console.log("dto =====> ", dto);
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
    const { vendorId, riderId, userId } = req.body;
    const order = await OrderService.getAllOrders(vendorId, riderId, userId);
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

export const orderStatusCounts = asyncHandler(async (req: Request, res: Response) => {
    try {
        const dto = orderAnalyticsSchema.parse(req.body);
        const data = await OrderService.getOrderAnalytics(dto);

        res.status(200).json({
            code: 200,
            status: true,
            message: "Order analytics fetched successfully",
            data: {
                ...data,
            },
        });
    } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : "Failed to fetch order analytics";
        const isValidationOrBadRequest =
            typeof message === "string" &&
            (message.toLowerCase().includes("invalid") ||
                message.toLowerCase().includes("required") ||
                message.toLowerCase().includes("expected"));

        res.status(isValidationOrBadRequest ? 400 : 500).json({
            code: isValidationOrBadRequest ? 400 : 500,
            status: false,
            message,
        });
    }
});
