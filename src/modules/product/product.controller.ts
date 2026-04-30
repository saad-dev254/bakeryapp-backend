import mongoose from "mongoose";
import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import Products from "./product.model";
import Category from "../category/category.model";

// Validation function for product fields
function validateProductFields(body: any, type: "create" | "update" = "create") {
    const {
        user_id, product_name, category_id, product_brand, product_size, product_color, product_details
    } = body;

    // If type is "create", require user_id. If "update", ignore user_id validation.
    if (
        (type === "create" && (!user_id || typeof user_id !== "string" || user_id.trim() === "")) ||
        !product_name || typeof product_name !== "string" || product_name.trim() === "" ||
        !category_id || typeof category_id !== "string" || category_id.trim() === "" ||
        !product_brand || typeof product_brand !== "string" || product_brand.trim() === "" ||
        !product_size || typeof product_size !== "string" || product_size.trim() === "" ||
        !product_color || typeof product_color !== "string" || product_color.trim() === "" ||
        !product_details || typeof product_details !== "string" || product_details.trim() === ""
    ) {
        return false;
    }
    return true;
};

// POST / CREATE product
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    // Validate required fields for creating a product
    if (!validateProductFields(req.body, "create")) {
        return res.status(400).json({
            code: 400,
            status: false,
            message: "All fields (user_id, product_name, category_id, product_brand, product_size, product_color, product_details) are required and must not be blank",
        });
    }

    try {
        const newProduct = new Products(req.body);
        const savedProduct = await newProduct.save();
  
        res.status(200).json({
            code: 200,
            status: true, 
            message: "Product added successfully", 
            data: savedProduct
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Product added failed",
        });
    }
});

// PUT (update) product by ID
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { product_name, category_id, category_name, product_brand, product_size, product_color, product_details } = req.body;

    try {
        const updatedProduct = await Products.findByIdAndUpdate(
            id,
            { product_name, category_id, category_name, product_brand, product_size, product_color, product_details, updated_at: new Date() },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            code: 200,
            status: true,
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to update product",
        });
    }
});

// GET all products (admin/user use-case)
export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { user_type, user_id } = req.body;

        let query: { user_id?: string } = {};
        if (user_type === "admin") {
            // Admin can fetch all products
        } else if (user_type === "user") {
            if (!user_id) {
                return res.status(400).json({
                    code: 400,
                    status: false,
                    message: "User ID not found in request",
                });
            }
            query.user_id = user_id;
        } else {
            return res.status(403).json({
                code: 403,
                status: false,
                message: "Unauthorized access",
            });
        }

        // Fetch all products matching query
        const products = await Products.find(query).lean();

        // Fetch all category ids used by products in one go
        const categoryIds = [
            ...new Set(
                products
                    .map(p => p.category_id)
                    .filter((id): id is mongoose.Types.ObjectId => !!id)
            )
        ];
        const categories = await Category.find({ _id: { $in: categoryIds } }).lean();
        const categoryMap: { [key: string]: string } = {};
        categories.forEach(cat => {
            categoryMap[cat._id.toString()] = cat.category_name;
        });

        // Attach category_name to each product
        const productsWithCategory = products.map(product => {
            const categoryIdKey = String(product.category_id);
            return {
                ...product,
                category_name: categoryMap[categoryIdKey] || null
            };
        });
        
        res.status(200).json({
            code: 200,
            status: true,
            message: "Products fetched successfully",
            data: productsWithCategory,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch products",
        });
    }
});

// GET single product by ID
export const getSingleProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
        const product = await Products.findById(id);
        
        if (!product) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Product not found",
            });
        }
    
        res.status(200).json({
            code: 200,
            status: true,
            message: "Product fetched successfully",
            data: product,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch product",
        });
    }
});

// DELETE single product by ID
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Products.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            code: 200,
            status: true,
            message: "Product deleted successfully",
            // data: deletedProduct,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to delete Product",
        });
    }
});
