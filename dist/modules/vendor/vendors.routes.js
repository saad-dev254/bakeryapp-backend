"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const vendor_controller_1 = require("./vendor.controller");
exports.vendorRouter = (0, express_1.Router)();
// protected
exports.vendorRouter.post("/add-vendor", auth_1.default, vendor_controller_1.createVendor);
exports.vendorRouter.put("/update-vendor/:id", auth_1.default, vendor_controller_1.updateVendor);
exports.vendorRouter.get("/vendors", auth_1.default, vendor_controller_1.getAllVendors);
exports.vendorRouter.get("/vendor/:id", auth_1.default, vendor_controller_1.getSingleVendor);
exports.vendorRouter.delete("/vendor/:id", auth_1.default, vendor_controller_1.deleteVendor);
