import { Router } from "express";
import multer from "multer";
import authenticateToken from "../../middlewares/auth";
import { createShipment, deleteShipment, getAllShipments, getSingleShipment, searchShipment, searchShipmentByStatus, searchShipmentByDate, shipmentStatusCounts, updateShipment, updateShipmentStatus, findDailyShipments, getShipmentSummary, filterShipmentsByDatesAndStatus, importWarehouseShipments } from "./shipment.controller";
import { requireAuth } from "../auth/auth.middleware";

export const shipmentRouter = Router();
const shipmentUpload = multer({ storage: multer.memoryStorage() });

// protected
shipmentRouter.post("/add-shipment", authenticateToken, createShipment);
shipmentRouter.put("/update-shipment/:id", authenticateToken, updateShipment);
shipmentRouter.put("/update-shipment-status/:id", authenticateToken, updateShipmentStatus);
shipmentRouter.post("/shipments", authenticateToken, getAllShipments);
shipmentRouter.get("/shipment/:id", authenticateToken, getSingleShipment);
shipmentRouter.delete("/shipment/:id", authenticateToken, deleteShipment);
shipmentRouter.post("/search-shipment", authenticateToken, searchShipment);
shipmentRouter.post("/search-shipment-by-status", authenticateToken, searchShipmentByStatus);
shipmentRouter.post("/search-shipment-by-date", authenticateToken, searchShipmentByDate);
shipmentRouter.post("/shipment-status-counts", authenticateToken, shipmentStatusCounts);
shipmentRouter.post("/find-daily-shipments", authenticateToken, findDailyShipments);
shipmentRouter.post("/shipment-summary", authenticateToken, getShipmentSummary);
shipmentRouter.post("/get-date-wise-shipments", authenticateToken, filterShipmentsByDatesAndStatus);
shipmentRouter.post("/import-warehouse-shipments", authenticateToken, shipmentUpload.single("file"), importWarehouseShipments);

