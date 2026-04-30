"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipmentRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const shipment_controller_1 = require("./shipment.controller");
exports.shipmentRouter = (0, express_1.Router)();
const shipmentUpload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// protected
exports.shipmentRouter.post("/add-shipment", auth_1.default, shipment_controller_1.createShipment);
exports.shipmentRouter.put("/update-shipment/:id", auth_1.default, shipment_controller_1.updateShipment);
exports.shipmentRouter.put("/update-shipment-status/:id", auth_1.default, shipment_controller_1.updateShipmentStatus);
exports.shipmentRouter.post("/shipments", auth_1.default, shipment_controller_1.getAllShipments);
exports.shipmentRouter.get("/shipment/:id", auth_1.default, shipment_controller_1.getSingleShipment);
exports.shipmentRouter.delete("/shipment/:id", auth_1.default, shipment_controller_1.deleteShipment);
exports.shipmentRouter.post("/search-shipment", auth_1.default, shipment_controller_1.searchShipment);
exports.shipmentRouter.post("/search-shipment-by-status", auth_1.default, shipment_controller_1.searchShipmentByStatus);
exports.shipmentRouter.post("/search-shipment-by-date", auth_1.default, shipment_controller_1.searchShipmentByDate);
exports.shipmentRouter.post("/shipment-status-counts", auth_1.default, shipment_controller_1.shipmentStatusCounts);
exports.shipmentRouter.post("/find-daily-shipments", auth_1.default, shipment_controller_1.findDailyShipments);
exports.shipmentRouter.post("/shipment-summary", auth_1.default, shipment_controller_1.getShipmentSummary);
exports.shipmentRouter.post("/get-date-wise-shipments", auth_1.default, shipment_controller_1.filterShipmentsByDatesAndStatus);
exports.shipmentRouter.post("/import-warehouse-shipments", auth_1.default, shipmentUpload.single("file"), shipment_controller_1.importWarehouseShipments);
