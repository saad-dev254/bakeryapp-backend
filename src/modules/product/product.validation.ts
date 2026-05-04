import { z } from "zod";

export const createVendorSchema = z.object({
    vendorId: z.string().min(2),
    vendorEmail: z.string().email(),
    vendorName: z.string().min(2),
    vendorMobileNo: z.string().min(11),
    vendorCnicNumber: z.string().min(13),
    vendorDesignation: z.string().min(2),
    bakeryImage: z.string().min(2),
    bakeryName: z.string().min(2),
    bakeryAddress: z.string().min(2),
    bakeryLatitude: z.number().min(2),
    bakeryLongitude: z.number().min(2),
    openingTime: z.string().min(2),
    closingTime: z.string().min(2),
    bakeryType: z.string().min(2),
    preOrder: z.string().min(2),
    deliveryTime: z.string().min(2),
    status: z.string().min(2),
});

export const updateVendorSchema = z.object({
    vendorName: z.string().min(2).optional(),
    vendorDesignation: z.string().min(2).optional(),
    bakeryImage: z.string().min(2).optional(),
    bakeryName: z.string().min(2).optional(),
    bakeryAddress: z.string().min(2).optional(),
    bakeryLatitude: z.number().min(2).optional(),
    bakeryLongitude: z.number().min(2).optional(),
    openingTime: z.string().min(2).optional(),
    closingTime: z.string().min(2).optional(),
    bakeryType: z.string().min(2).optional(),
    preOrder: z.string().min(2).optional(),
    deliveryTime: z.string().min(2).optional(),
    status: z.string().min(2).optional(),
});
