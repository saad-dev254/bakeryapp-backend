import { Router } from "express";
import authenticateToken from "../../middlewares/auth";
import { createService, deleteService, getAllServices, getSingleService, updateService } from "./delivery.controller";
import { requireAuth } from "../auth/auth.middleware";

export const deliveryRouter = Router();

// protected
deliveryRouter.post("/add-delivery-service", authenticateToken, createService);
deliveryRouter.put("/update-delivery-service/:id", authenticateToken, updateService);
deliveryRouter.get("/delivery-services", authenticateToken, getAllServices);
deliveryRouter.get("/delivery-service/:id", authenticateToken, getSingleService);
deliveryRouter.delete("/delivery-service/:id", authenticateToken, deleteService);
