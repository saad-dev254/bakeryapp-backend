import { Router } from "express";
import { requireAuth } from "../auth/auth.middleware";
import { createSettings, deleteSetting, getAllSettings, getSingleASetting, updateSetting } from "./settings.controller";

export const settingRouter = Router();

// protected
settingRouter.post("/add-setting", requireAuth, createSettings);
settingRouter.put("/update-setting", requireAuth, updateSetting);
settingRouter.get("/all-settings", requireAuth, getAllSettings);
settingRouter.post("/get-single-setting", requireAuth, getSingleASetting);
settingRouter.delete("/delete-setting", requireAuth, deleteSetting);
