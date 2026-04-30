import { Router } from "express";
import authenticateToken from "../../middlewares/auth";
import { createCountry, deleteCountry, getAllCountries, getSingleCountry, updateCountry } from "./country.controller";
import { requireAuth } from "../auth/auth.middleware";

export const countryRouter = Router();

// protected
countryRouter.post("/add-country", authenticateToken, createCountry);
countryRouter.put("/update-country/:id", authenticateToken, updateCountry);
countryRouter.get("/countries", authenticateToken, getAllCountries);
countryRouter.get("/country/:id", authenticateToken, getSingleCountry);
countryRouter.delete("/country/:id", authenticateToken, deleteCountry);
