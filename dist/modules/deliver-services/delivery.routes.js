"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliveryRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const delivery_controller_1 = require("./delivery.controller");
exports.deliveryRouter = (0, express_1.Router)();
// protected
exports.deliveryRouter.post("/add-delivery-service", auth_1.default, delivery_controller_1.createService);
exports.deliveryRouter.put("/update-delivery-service/:id", auth_1.default, delivery_controller_1.updateService);
exports.deliveryRouter.get("/delivery-services", auth_1.default, delivery_controller_1.getAllServices);
exports.deliveryRouter.get("/delivery-service/:id", auth_1.default, delivery_controller_1.getSingleService);
exports.deliveryRouter.delete("/delivery-service/:id", auth_1.default, delivery_controller_1.deleteService);
