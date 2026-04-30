"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.getSingleProduct = exports.getAllProducts = exports.updateProduct = exports.createProduct = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const product_model_1 = __importDefault(require("./product.model"));
const category_model_1 = __importDefault(require("../category/category.model"));
// Validation function for product fields
function validateProductFields(body, type = "create") {
    const { user_id, product_name, category_id, product_brand, product_size, product_color, product_details } = body;
    // If type is "create", require user_id. If "update", ignore user_id validation.
    if ((type === "create" && (!user_id || typeof user_id !== "string" || user_id.trim() === "")) ||
        !product_name || typeof product_name !== "string" || product_name.trim() === "" ||
        !category_id || typeof category_id !== "string" || category_id.trim() === "" ||
        !product_brand || typeof product_brand !== "string" || product_brand.trim() === "" ||
        !product_size || typeof product_size !== "string" || product_size.trim() === "" ||
        !product_color || typeof product_color !== "string" || product_color.trim() === "" ||
        !product_details || typeof product_details !== "string" || product_details.trim() === "") {
        return false;
    }
    return true;
}
;
// POST / CREATE product
exports.createProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // Validate required fields for creating a product
    if (!validateProductFields(req.body, "create")) {
        return res.status(400).json({
            code: 400,
            status: false,
            message: "All fields (user_id, product_name, category_id, product_brand, product_size, product_color, product_details) are required and must not be blank",
        });
    }
    try {
        const newProduct = new product_model_1.default(req.body);
        const savedProduct = await newProduct.save();
        res.status(200).json({
            code: 200,
            status: true,
            message: "Product added successfully",
            data: savedProduct
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Product added failed",
        });
    }
});
// PUT (update) product by ID
exports.updateProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { product_name, category_id, category_name, product_brand, product_size, product_color, product_details } = req.body;
    try {
        const updatedProduct = await product_model_1.default.findByIdAndUpdate(id, { product_name, category_id, category_name, product_brand, product_size, product_color, product_details, updated_at: new Date() }, { new: true, runValidators: true });
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to update product",
        });
    }
});
// GET all products (admin/user use-case)
exports.getAllProducts = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { user_type, user_id } = req.body;
        let query = {};
        if (user_type === "admin") {
            // Admin can fetch all products
        }
        else if (user_type === "user") {
            if (!user_id) {
                return res.status(400).json({
                    code: 400,
                    status: false,
                    message: "User ID not found in request",
                });
            }
            query.user_id = user_id;
        }
        else {
            return res.status(403).json({
                code: 403,
                status: false,
                message: "Unauthorized access",
            });
        }
        // Fetch all products matching query
        const products = await product_model_1.default.find(query).lean();
        // Fetch all category ids used by products in one go
        const categoryIds = [
            ...new Set(products
                .map(p => p.category_id)
                .filter((id) => !!id))
        ];
        const categories = await category_model_1.default.find({ _id: { $in: categoryIds } }).lean();
        const categoryMap = {};
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch products",
        });
    }
});
// GET single product by ID
exports.getSingleProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    try {
        const product = await product_model_1.default.findById(id);
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch product",
        });
    }
});
// DELETE single product by ID
exports.deleteProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await product_model_1.default.findByIdAndDelete(id);
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to delete Product",
        });
    }
});
