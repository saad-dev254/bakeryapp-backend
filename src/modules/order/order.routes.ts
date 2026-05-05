import { Router } from "express";
import { createOrder, deleteOrder, getAllOrders, getSingleOrder, updateOrder } from "./order.controller";
import { requireAuth } from "../auth/auth.middleware";

export const orderRouter = Router();

// protected
orderRouter.post("/create-order", requireAuth, createOrder);
orderRouter.put("/update-order", requireAuth, updateOrder);
orderRouter.get("/all-orders", requireAuth, getAllOrders);
orderRouter.post("/get-single-category", requireAuth, getSingleOrder);
orderRouter.delete("/delete-category", requireAuth, deleteOrder);
