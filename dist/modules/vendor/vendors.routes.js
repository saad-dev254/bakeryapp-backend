"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const vendor_controller_1 = require("./vendor.controller");
const auth_middleware_1 = require("../auth/auth.middleware");
const upload_1 = require("../../utils/upload");
exports.vendorRouter = (0, express_1.Router)();
// protected
exports.vendorRouter.post("/add-vendor", auth_middleware_1.requireAuth, upload_1.vendorImageUpload.single("bakeryImage"), vendor_controller_1.createVendor);
exports.vendorRouter.put("/update-vendor", auth_middleware_1.requireAuth, upload_1.vendorImageUpload.single("bakeryImage"), vendor_controller_1.updateVendor);
exports.vendorRouter.get("/all-vendors", auth_middleware_1.requireAuth, vendor_controller_1.getAllVendors);
exports.vendorRouter.post("/get-vendor-detail", auth_middleware_1.requireAuth, vendor_controller_1.getSingleVendor);
exports.vendorRouter.delete("/delete-vendor", auth_1.default, vendor_controller_1.deleteVendor);
