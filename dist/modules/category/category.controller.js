"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.getSingleCategory = exports.getAllCategories = exports.updateCategory = exports.createCategory = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const category_model_1 = __importDefault(require("./category.model"));
// Validation function for category fields
function validateCategoryFields(body, type = "create") {
    const { category_name } = body;
    if (!category_name || typeof category_name !== "string" || category_name.trim() === "") {
        return false;
    }
    return true;
}
;
// POST / CREATE category
exports.createCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // Validate required fields for creating a category
    if (!validateCategoryFields(req.body, "create")) {
        return res.status(400).json({
            code: 400,
            status: false,
            message: "Category name must not be blank",
        });
    }
    try {
        const newCategory = new category_model_1.default(req.body);
        const savedCategory = await newCategory.save();
        res.status(200).json({
            code: 200,
            status: true,
            message: "Category added successfully",
            data: savedCategory
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Category added failed",
        });
    }
});
// PUT (update) category by ID
exports.updateCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
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
        const updatedCategory = await category_model_1.default.findByIdAndUpdate(id, {
            category_name,
            updated_at: new Date()
        }, { new: true, runValidators: true });
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to update Category",
        });
    }
});
// GET all categories
exports.getAllCategories = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const categories = await category_model_1.default.find(); // Fetch all Categories from MongoDB
        res.status(200).json({
            code: 200,
            status: true,
            message: "Categories fetched successfully",
            data: categories,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch categories",
        });
    }
});
// GET single category by ID
exports.getSingleCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    try {
        const category = await category_model_1.default.findById(id);
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch category",
        });
    }
});
// DELETE single category by ID
exports.deleteCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCategory = await category_model_1.default.findByIdAndDelete(id);
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to delete Category",
        });
    }
});
