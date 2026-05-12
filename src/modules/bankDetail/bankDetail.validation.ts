import { z } from "zod";

export const createBankDetailSchema = z.object({
    accountNumber: z.string().min(2),
    ibanNumber: z.string().min(2),
    bankName: z.string().min(2),
    accountHolderName: z.string().min(2),
    userId: z.string().min(2),
    branchName:  z.string().min(2),
    isPrimary: z.boolean(),
});

export const updateBankDetailSchema = z.object({
    accountNumber: z.string().min(2).optional(),
    ibanNumber: z.string().min(2).optional(),
    bankName: z.string().min(2).optional(),
    accountHolderName: z.string().min(2).optional(),
    branchName:  z.string().min(2).optional(),
    isPrimary: z.boolean().optional(),
});
