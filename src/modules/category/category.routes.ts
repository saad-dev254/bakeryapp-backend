import { Router } from "express";
import authenticateToken from "../../middlewares/auth";
import { createCategory, deleteCategory, getAllCategories, getSingleCategory, updateCategory } from "./category.controller";
import { requireAuth } from "../auth/auth.middleware";

export const categoryRouter = Router();

// protected
categoryRouter.post("/add-category", authenticateToken, createCategory);
categoryRouter.put("/update-category/:id", authenticateToken, updateCategory);
categoryRouter.get("/categories", authenticateToken, getAllCategories);
categoryRouter.get("/category/:id", authenticateToken, getSingleCategory);
categoryRouter.delete("/category/:id", authenticateToken, deleteCategory);
