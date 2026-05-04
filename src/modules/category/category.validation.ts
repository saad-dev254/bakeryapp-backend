import { z } from "zod";

export const createCategorySchema = z.object({
    categoryName: z.string().min(2),
});

export const updateCategorySchema = z.object({
    categoryName: z.string().min(2).optional(),
});
