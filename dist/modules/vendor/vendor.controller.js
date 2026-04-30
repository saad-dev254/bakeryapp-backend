"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVendor = exports.getSingleVendor = exports.getAllVendors = exports.updateVendor = exports.createVendor = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const vendor_model_1 = __importDefault(require("./vendor.model"));
// POST / CREATE vendor
exports.createVendor = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { first_name, last_name, email, phone, address } = req.body;
    try {
        const data = { first_name, last_name, email, phone, address };
        const newVendor = new vendor_model_1.default(data);
        const savedVendor = await newVendor.save();
        res.status(200).json({
            code: 200,
            status: true,
            message: "Vendor added successfully",
            data: savedVendor
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Vendor added failed",
        });
    }
});
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
