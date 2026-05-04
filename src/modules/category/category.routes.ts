import { Router } from "express";
import { createCategory, deleteCategory, getAllCategory, getSingleCategory, updateCategory } from "./category.controller";
import { requireAuth } from "../auth/auth.middleware";

export const categoryRouter = Router();

// protected
categoryRouter.post("/add-category", requireAuth, createCategory);
categoryRouter.put("/update-category", requireAuth, updateCategory);
categoryRouter.get("/all-categories", requireAuth, getAllCategory);
categoryRouter.post("/get-single-category", requireAuth, getSingleCategory);
categoryRouter.delete("/delete-category", requireAuth, deleteCategory);
