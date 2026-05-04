import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import Vendors from "./vendor.model";
import { AuthRequest } from "../auth/auth.middleware";
import * as VendorService from "./vendor.service";
import { createVendorSchema, updateVendorSchema } from "./vendor.validation";

export const createVendor = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { vendorId } = req.body;
    const dto = createVendorSchema.parse(req.body);
    const vendor = await VendorService.createVendor(vendorId, dto);
    res.status(201).json({ success: true, message: `Vendor created`, data: vendor });
});

export const updateVendor = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    const dto = updateVendorSchema.parse(req.body);
    const vendor = await VendorService.updateVendor(id, dto);
    res.json({ success: true, message: "Profile updated", data: vendor });
});

export const getAllVendors = asyncHandler(async (req: AuthRequest, res: Response) => {
    const vendors = await VendorService.getAllVendors();
    res.json({ success: true, data: vendors });
});

export const getSingleVendor = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    const vendor = await VendorService.getSingleVendor(id);
    res.json({ success: true, data: vendor });
});

export const deleteVendor = asyncHandler(async (req: AuthRequest, res: Response) => {
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