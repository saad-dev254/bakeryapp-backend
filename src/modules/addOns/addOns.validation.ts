import { z } from "zod";

export const createAddOnSchema = z.object({
    addOnName: z.string().min(2),
    addOnPrice: z.string().min(2),
});

export const updateAddOnSchema = z.object({
    addOnName: z.string().min(2).optional(),
    addOnPrice: z.string().min(2).optional(),
});
