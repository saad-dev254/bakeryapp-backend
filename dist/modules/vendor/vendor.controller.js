"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVendor = exports.getSingleVendor = exports.getAllVendors = exports.updateVendor = exports.createVendor = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const VendorService = __importStar(require("./vendor.service"));
const vendor_validation_1 = require("./vendor.validation");
exports.createVendor = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const files = req.files;
    const bakeryLogo = files?.bakeryLogo?.[0];
    const bakeryImage = files?.bakeryImage?.[0];
    const vendorCnicFrontImage = files?.vendorCnicFrontImage?.[0];
    const vendorCnicBackImage = files?.vendorCnicBackImage?.[0];
    const ntnImage = files?.ntnImage?.[0];
    const foodLicenseImage = files?.foodLicenseImage?.[0];
    const kitchenImageFiles = files?.kitchenImages || [];
    if (bakeryLogo)
        req.body.bakeryLogo = `/uploads/vendors/${bakeryLogo.filename}`;
    if (bakeryImage)
        req.body.bakeryImage = `/uploads/vendors/${bakeryImage.filename}`;
    if (vendorCnicFrontImage)
        req.body.vendorCnicFrontImage = `/uploads/vendors/${vendorCnicFrontImage.filename}`;
    if (vendorCnicBackImage)
        req.body.vendorCnicBackImage = `/uploads/vendors/${vendorCnicBackImage.filename}`;
    if (ntnImage)
        req.body.ntnImage = `/uploads/vendors/${ntnImage.filename}`;
    if (foodLicenseImage)
        req.body.foodLicenseImage = `/uploads/vendors/${foodLicenseImage.filename}`;
    // Handle kitchenImages (multiple images: 0, 1, or many)
    if (kitchenImageFiles.length > 0) {
        req.body.kitchenImages = kitchenImageFiles.map(img => `/uploads/vendors/${img.filename}`);
    }
    else {
        req.body.kitchenImages = []; // For consistency if none uploaded
    }
    const { vendorId } = req.body;
    const dto = vendor_validation_1.createVendorSchema.parse(req.body);
    const vendor = await VendorService.createVendor(vendorId, dto);
    res.status(201).json({ success: true, message: `Vendor created`, data: vendor });
});
exports.updateVendor = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const uploadedFile = req.file;
    if (uploadedFile) {
        req.body.bakeryImage = `/uploads/vendors/${uploadedFile.filename}`;
    }
    const { id } = req.body;
    const dto = vendor_validation_1.updateVendorSchema.parse(req.body);
    const vendor = await VendorService.updateVendor(id, dto);
    res.json({ success: true, message: "Profile updated", data: vendor });
});
exports.getAllVendors = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const vendors = await VendorService.getAllVendors(req.body?.isApproved, req.body?.page, req.body?.limit);
    res.json({ success: true, data: vendors });
});
exports.getSingleVendor = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.body;
    const vendor = await VendorService.getSingleVendor(id);
    res.json({ success: true, data: vendor });
});
exports.deleteVendor = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.body;
    await VendorService.deleteVendor(id);
    res.json({ success: true, message: "Vendor deleted" });
});
