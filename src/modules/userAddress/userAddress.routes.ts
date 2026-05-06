import { Router } from "express";
import { requireAuth } from "../auth/auth.middleware";
import { createUserAddress, deleteUserAddress, getAllUserAddresses, getSingleUserAddress, updateUserAddress } from "./userAddress.controller";

export const addressRouter = Router();

// protected
addressRouter.post("/add-address", requireAuth, createUserAddress);
addressRouter.put("/update-address", requireAuth, updateUserAddress);
addressRouter.get("/all-addresses", requireAuth, getAllUserAddresses);
addressRouter.post("/get-single-address", requireAuth, getSingleUserAddress);
addressRouter.delete("/delete-address", requireAuth, deleteUserAddress);
