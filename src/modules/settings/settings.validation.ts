import { z } from "zod";

export const createSettingsSchema = z.object({
    role: z.enum(["ADMIN"]),
    deliveryCharges: z.string().min(2).optional(),
    radiusInKM: z.string().min(2).optional(),
});

export const updateSettingsSchema = z.object({
    role: z.enum(["ADMIN"]),
    deliveryCharges: z.string().min(2).optional(),
    radiusInKM: z.string().min(2).optional(),
});
