import { Router } from "express";
import authenticateToken from "../../middlewares/auth";
import { requireAuth } from "../auth/auth.middleware";
import { riderImageUpload } from "../../utils/upload";
import { createRider, deleteRider, getAllRiders, getSingleRider, updateRider } from "./rider.controller";

export const riderRouter = Router();

// protected
riderRouter.post("/add-rider", requireAuth,
  riderImageUpload.fields([
    { name: "riderImage", maxCount: 1 },
    { name: "riderCnicFrontImage", maxCount: 1 },
    { name: "riderCnicBackImage", maxCount: 1 },
  ]),
  createRider
);
riderRouter.put("/update-rider", requireAuth,
  riderImageUpload.fields([
    { name: "riderImage", maxCount: 1 },
    // { name: "riderCnicFrontImage", maxCount: 1 },
    // { name: "riderCnicBackImage", maxCount: 1 },
  ]),
  updateRider
);
riderRouter.get("/all-riders", requireAuth, getAllRiders);
riderRouter.post("/get-rider-detail", requireAuth, getSingleRider);
riderRouter.delete("/delete-rider", authenticateToken, deleteRider);
  
