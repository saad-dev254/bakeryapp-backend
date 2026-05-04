import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../auth/auth.middleware";
import * as CategoryService from "./category.service";
import { createCategorySchema, updateCategorySchema } from "./category.validation";

export const createCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const dto = createCategorySchema.parse(req.body);
    const category = await CategoryService.createCategory(dto);
    res.status(201).json({ success: true, message: `Category created`, data: category });
});

export const updateCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    const dto = updateCategorySchema.parse(req.body);
    const category = await CategoryService.updateCategory(id, dto);
    res.json({ success: true, message: "Category updated", data: category });
});

export const getAllCategory= asyncHandler(async (req: AuthRequest, res: Response) => {
    const category = await CategoryService.getAllCategory();
    res.json({ success: true, data: category });
});

export const getSingleCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    const category = await CategoryService.getSingleCategory(id);
    res.json({ success: true, data: category });
});

export const deleteCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    await CategoryService.deleteCategory(id);
    res.json({ success: true, message: "Category deleted" });
});
