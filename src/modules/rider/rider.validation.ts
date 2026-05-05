import { z } from "zod";

export const createRiderSchema = z.object({
    riderId: z.string().min(2),
    riderCnicNumber: z.string().min(13),
    riderImage: z.string().min(2),
    riderCnicFrontImage: z.string().min(2),
    riderCnicBackImage: z.string().min(2),
    riderAddress: z.string().min(2),
    riderLatitude: z.coerce.number(),
    riderLongitude: z.coerce.number(),
    riderStatus: z.string().min(2),
}); 

export const updateRiderSchema = z.object({
    riderName: z.string().optional(),
    riderImage: z.string().optional(),
    riderAddress: z.string().optional(),
    riderLatitude: z.coerce.number(),
    riderLongitude: z.coerce.number(),
    riderStatus: z.string().min(2),
});
