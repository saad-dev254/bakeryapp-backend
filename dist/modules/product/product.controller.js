"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.getSingleProduct = exports.getAllProducts = exports.updateProduct = exports.createProduct = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const ProductService = __importStar(require("./product.service"));
const product_validation_1 = require("./product.validation");
exports.createProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const uploadedFile = req.file;
    if (uploadedFile) {
        req.body.productImage = `/uploads/products/${uploadedFile.filename}`;
    }
    const { vendorId } = req.body;
    const dto = product_validation_1.createProductSchema.parse(req.body);
    const product = await ProductService.createProduct(vendorId, dto);
    res.status(201).json({ success: true, message: `Product created`, data: product });
});
exports.updateProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const uploadedFile = req.file;
    if (uploadedFile) {
        req.body.productImage = `/uploads/products/${uploadedFile.filename}`;
    }
    const { id } = req.body;
    const dto = product_validation_1.updateProductSchema.parse(req.body);
    const product = await ProductService.updateProduct(id, dto);
    res.json({ success: true, message: "Product updated", data: product });
});
exports.getAllProducts = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const products = await ProductService.getAllProducts(req.body?.vendorId);
    res.json({ success: true, data: products });
});
exports.getSingleProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.body;
    const product = await ProductService.getSingleProduct(id);
    res.json({ success: true, data: product });
});
exports.deleteProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.body;
    await ProductService.deleteProduct(id);
    res.json({ success: true, message: "Product deleted" });
});
