import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import Vendors from "./vendor.model";

// POST / CREATE vendor
export const createVendor = asyncHandler(async (req: Request, res: Response) => {
    const { first_name, last_name, email, phone, address } = req.body;
  
    try {
        const data = { first_name, last_name, email, phone, address };

        const newVendor = new Vendors(data);
        const savedVendor = await newVendor.save();
  
        res.status(200).json({
            code: 200,
            status: true,
            message: "Vendor added successfully", 
            data: savedVendor
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Vendor added failed",
        });
    }
});

// PUT (update) vendor by ID
export const updateVendor = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { first_name, last_name, phone, address } = req.body;

    try {
        const updatedVendor = await Vendors.findByIdAndUpdate(
            id,
            { first_name, last_name, phone, address, updated_at: new Date() },
            { new: true, runValidators: true }
        );

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
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to update vendor",
        });
    }
});

// GET all vendors
export const getAllVendors = asyncHandler(async (req: Request, res: Response) => {
    try {
        const vendors = await Vendors.find(); // Fetch all vendors from MongoDB
        res.status(200).json({
            code: 200,
            status: true,
            message: "Vendors fetched successfully",
            data: vendors,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch vendors",
        });
    }
});

// GET single vendor by ID
export const getSingleVendor = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
        const vendor = await Vendors.findById(id);
        
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
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch vendor",
        });
    }
});

// DELETE single vendor by ID
export const deleteVendor = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deletedVendor = await Vendors.findByIdAndDelete(id);

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
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to delete vendor",
        });
    }
});