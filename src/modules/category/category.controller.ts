import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import Category from "./category.model";

// Validation function for category fields
function validateCategoryFields(body: any, type: "create" | "update" = "create") {
    const { category_name } = body;

    if ( !category_name || typeof category_name !== "string" || category_name.trim() === "" ) {
        return false;
    }
    return true;
};

// POST / CREATE category
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
    // Validate required fields for creating a category
    if (!validateCategoryFields(req.body, "create")) {
        return res.status(400).json({
            code: 400,
            status: false,
            message: "Category name must not be blank",
        });
    }

    try {
        const newCategory = new Category(req.body);
        const savedCategory = await newCategory.save();
  
        res.status(200).json({
            code: 200,
            status: true, 
            message: "Category added successfully", 
            data: savedCategory
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Category added failed",
        });
    }
});

// PUT (update) category by ID
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Validate required fields for updating a category
    // if (!validateCategoryFields(req.body, "create")) {
    //     return res.status(400).json({
    //         code: 400,
    //         status: false,
    //         message: "Category name must not be blank",
    //     });
    // }

    const { category_name } = req.body;

    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { 
                category_name,
                updated_at: new Date() 
            },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Category not found",
            });
        }

        res.status(200).json({
            code: 200,
            status: true,
            message: "Category updated successfully",
            data: updatedCategory,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to update Category",
        });
    }
});

// GET all categories
export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
    try {
        const categories = await Category.find(); // Fetch all Categories from MongoDB
        res.status(200).json({
            code: 200,
            status: true,
            message: "Categories fetched successfully",
            data: categories,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch categories",
        });
    }
});

// GET single category by ID
export const getSingleCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const category = await Category.findById(id);
        
        if (!category) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Category not found",
            });
        }
    
        res.status(200).json({
            code: 200,
            status: true,
            message: "Category fetched successfully",
            data: category,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch category",
        });
    }
});

// DELETE single category by ID
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Category not found",
            });
        }

        res.status(200).json({
            code: 200,
            status: true,
            message: "Category deleted successfully",
            // data: deletedCategory,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to delete Category",
        });
    }
});
