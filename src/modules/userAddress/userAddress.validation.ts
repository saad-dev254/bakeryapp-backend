import { z } from "zod";

export const createUserAddressSchema = z.object({
    userId: z.string().min(2),
    address: z.string().min(2),
    latitude: z.string().min(2),
    longitude: z.string().min(2),
});

export const updateUserAddressSchema = z.object({
    address: z.string().min(2).optional(),
    latitude: z.string().min(2).optional(),
    longitude: z.string().min(2).optional(),
});
