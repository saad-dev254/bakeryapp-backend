import { z } from "zod";

export const createAdOnSchema = z.object({
    adOnName: z.string().min(2),
    adOnPrice: z.string().min(2),
    vendorId: z.string().min(2),
});

export const updateAdOnSchema = z.object({
    adOnName: z.string().min(2).optional(),
    adOnPrice: z.string().min(2).optional(),
});
