import { Router } from "express";
import authenticateToken from "../../middlewares/auth";
import { createCity, deleteCity, getAllCities, getSingleCity, updateCity } from "./city.controller";
import { requireAuth } from "../auth/auth.middleware";

export const cityRouter = Router();

// protected
cityRouter.post("/add-city", authenticateToken, createCity);
cityRouter.put("/update-city/:id", authenticateToken, updateCity);
cityRouter.get("/cities", authenticateToken, getAllCities);
cityRouter.get("/city/:id", authenticateToken, getSingleCity);
cityRouter.delete("/city/:id", authenticateToken, deleteCity);
