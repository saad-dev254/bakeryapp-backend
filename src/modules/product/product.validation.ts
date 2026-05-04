import { z } from "zod";

export const createProductSchema = z.object({
    vendorId: z.string().min(2),
    productName: z.string().min(2),
    productImage: z.string().min(2),
    productDescription: z.string().min(2),
    productPrice: z.string().min(2),
    discountAmount: z.string().min(2).optional(),
    discountType: z.string().min(2).optional(),
    categoryId: z.string().min(2),
    addOnIds: z.array(z.string().min(2)).optional(),
});

export const updateProductSchema = z.object({
    productName: z.string().min(2).optional(),
    productImage: z.string().min(2).optional(),
    productDescription: z.string().min(2).optional(),
    productPrice: z.string().min(2).optional(),
    discountAmount: z.string().min(2).optional(),
    discountType: z.string().min(2).optional(),
    categoryId: z.string().min(2).optional(),
    addOnIds: z.array(z.string().min(2)).optional(),
});
