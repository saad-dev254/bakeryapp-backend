import { Router } from "express";
import { createAdOn, deleteAdOn, getAllAdOn, getSingleAdOn, updateAdOn } from "./adOns.controller";
import { requireAuth } from "../auth/auth.middleware";

export const adOnRouter = Router();

// protected
adOnRouter.post("/add-adOn", requireAuth, createAdOn);
adOnRouter.put("/update-adOn", requireAuth, updateAdOn);
adOnRouter.get("/all-adOns", requireAuth, getAllAdOn);
adOnRouter.post("/get-single-adOn", requireAuth, getSingleAdOn);
adOnRouter.delete("/delete-adOn", requireAuth, deleteAdOn);
