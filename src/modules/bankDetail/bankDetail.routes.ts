import { Router } from "express";
import { requireAuth } from "../auth/auth.middleware";
import { createBankDetail, deleteBankDetail, getAllBankDetails, getSingleBankDetail, updateBankDetail } from "./bankDetail.controller";

export const bankDetailRouter = Router();

// protected
bankDetailRouter.post("/add-bankDetail", requireAuth, createBankDetail);
bankDetailRouter.put("/update-bankDetail", requireAuth, updateBankDetail);
bankDetailRouter.post("/all-bankDetails", requireAuth, getAllBankDetails);
bankDetailRouter.post("/get-single-bankDetail", requireAuth, getSingleBankDetail);
bankDetailRouter.delete("/delete-bankDetail", requireAuth, deleteBankDetail);
