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
const env_1 = require("../../config/env");
exports.createVendor = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const uploadedFile = req.file;
    if (uploadedFile) {
        req.body.bakeryImage = `${env_1.env.APP_URL}/uploads/vendors/${uploadedFile.filename}`;
    }
    if (typeof req.body.bakeryLatitude === "string") {
        req.body.bakeryLatitude = Number(req.body.bakeryLatitude);
    }
    if (typeof req.body.bakeryLongitude === "string") {
        req.body.bakeryLongitude = Number(req.body.bakeryLongitude);
    }
    const { vendorId } = req.body;
    const dto = vendor_validation_1.createVendorSchema.parse(req.body);
    const vendor = await VendorService.createVendor(vendorId, dto);
    res.status(201).json({ success: true, message: `Vendor created`, data: vendor });
});
exports.updateVendor = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const uploadedFile = req.file;
    if (uploadedFile) {
        req.body.bakeryImage = `${env_1.env.APP_URL}/uploads/vendors/${uploadedFile.filename}`;
    }
    if (typeof req.body.bakeryLatitude === "string") {
        req.body.bakeryLatitude = Number(req.body.bakeryLatitude);
    }
    if (typeof req.body.bakeryLongitude === "string") {
        req.body.bakeryLongitude = Number(req.body.bakeryLongitude);
    }
    const { id } = req.body;
    const dto = vendor_validation_1.updateVendorSchema.parse(req.body);
    const vendor = await VendorService.updateVendor(id, dto);
    res.json({ success: true, message: "Profile updated", data: vendor });
});
exports.getAllVendors = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const vendors = await VendorService.getAllVendors();
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
// // DELETE single vendor by ID
// export const deleteVendor = asyncHandler(async (req: Request, res: Response) => {
//     const { id } = req.params;
//     try {
//         const deletedVendor = await Vendors.findByIdAndDelete(id);
//         if (!deletedVendor) {
//             return res.status(404).json({
//                 code: 404,
//                 status: false,
//                 message: "Vendor not found",
//             });
//         }
//         res.status(200).json({
//             code: 200,
//             status: true,
//             message: "Vendor deleted successfully",
//             // data: deletedVendor,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             code: 500,
//             status: false,
//             message: "Failed to delete vendor",
//         });
//     }
// });
