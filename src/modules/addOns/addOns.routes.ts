import { Router } from "express";
import { createAddOn, deleteAddOn, getAllAddOn, getSingleAddOn, updateAddOn } from "./addOns.controller";
import { requireAuth } from "../auth/auth.middleware";

export const addOnRouter = Router();

// protected
addOnRouter.post("/add-addOn", requireAuth, createAddOn);
addOnRouter.put("/update-addOn", requireAuth, updateAddOn);
addOnRouter.get("/all-addOns", requireAuth, getAllAddOn);
addOnRouter.post("/get-single-addOn", requireAuth, getSingleAddOn);
addOnRouter.delete("/delete-addOn", requireAuth, deleteAddOn);
