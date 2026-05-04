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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVendor = exports.getSingleVendor = exports.getAllVendors = exports.updateVendor = exports.createVendor = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const vendor_model_1 = __importDefault(require("./vendor.model"));
const VendorService = __importStar(require("./vendor.service"));
const vendor_validation_1 = require("./vendor.validation");
exports.createVendor = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    console.log("req.body =====> ", req.body);
    const dto = vendor_validation_1.createVendorSchema.parse(req.body);
    console.log("dto ===> ", dto);
    const user = await VendorService.createVendor(req.body.vendorId, dto);
    res.status(201).json({ success: true, message: `Vendor created`, data: user });
});
// POST / CREATE vendor
// export const createVendor = asyncHandler(async (req: Request, res: Response) => {
//     const { userId, vendorName, vendorEmail, vendorMobileNo, vendorDesignation, vendorCnicNumber, bakeryImage, bakeryName, 
//     bakeryAddress, bakeryLatitude, bakeryLongitude, openingTime, closingTime, bakeryType, preOrder, deliveryTime } = req.body;
//     console.log(req.body)
//     try {
//         const data = { userId, vendorName, vendorEmail, vendorMobileNo, vendorDesignation, vendorCnicNumber, bakeryImage, bakeryName, 
//         bakeryAddress, bakeryLatitude, bakeryLongitude, openingTime, closingTime, bakeryType, preOrder, deliveryTime };
//         // Check if vendorMobileNo or userId already exists, if so, don't add and show error
//         const exists = await Vendors.findOne({
//             $or: [
//                 { userId: userId },
//                 { vendorMobileNo: vendorMobileNo }
//             ]
//         });
//         if (exists) throw new HttpError(409, "Vendor already exists");
//         console.log("exists ====> ", exists);
//         const newVendor = new Vendors(data);
//         const savedVendor = await newVendor.save();
//         // After successfully adding the vendor, update the corresponding user's isProfileComplete to true
//         try {
//             await User.findByIdAndUpdate(
//                 userId,
//                 { isProfileComplete: true },
//                 { new: true }
//             );
//         } catch (userUpdateErr) {
//             // Log the error but do not fail vendor creation if user profile update fails
//             console.error("Failed to update user's isProfileComplete:", userUpdateErr);
//         }
//         res.status(200).json({
//             code: 200,
//             status: true,
//             message: "Vendor added successfully", 
//             data: savedVendor
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             code: 500,
//             status: false,
//             message: "Vendor added failed",
//         });
//     }
// });
// PUT (update) vendor by ID
exports.updateVendor = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, phone, address } = req.body;
    try {
        const updatedVendor = await vendor_model_1.default.findByIdAndUpdate(id, { first_name, last_name, phone, address, updated_at: new Date() }, { new: true, runValidators: true });
        if (!updatedVendor) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Vendor not found",
            });
        }
        res.status(200).json({
            code: 200,
            status: true,
            message: "Vendor updated successfully",
            data: updatedVendor,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to update vendor",
        });
    }
});
// GET all vendors
exports.getAllVendors = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const vendors = await vendor_model_1.default.find(); // Fetch all vendors from MongoDB
        res.status(200).json({
            code: 200,
            status: true,
            message: "Vendors fetched successfully",
            data: vendors,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch vendors",
        });
    }
});
// GET single vendor by ID
exports.getSingleVendor = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    try {
        const vendor = await vendor_model_1.default.findById(id);
        if (!vendor) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Vendor not found",
            });
        }
        res.status(200).json({
            code: 200,
            status: true,
            message: "Vendor fetched successfully",
            data: vendor,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch vendor",
        });
    }
});
// DELETE single vendor by ID
exports.deleteVendor = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedVendor = await vendor_model_1.default.findByIdAndDelete(id);
        if (!deletedVendor) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Vendor not found",
            });
        }
        res.status(200).json({
            code: 200,
            status: true,
            message: "Vendor deleted successfully",
            // data: deletedVendor,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to delete vendor",
        });
    }
});
