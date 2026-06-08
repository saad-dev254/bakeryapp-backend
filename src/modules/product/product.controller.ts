import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../auth/auth.middleware";
import * as ProductService from "./product.service";
import { createProductSchema, updateProductSchema } from "./product.validation";

export const createProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
    const uploadedFile = (req as Request & { file?: Express.Multer.File }).file;
    if (uploadedFile) {
        req.body.productImage = `/uploads/products/${uploadedFile.filename}`;
    }
    const { vendorId } = req.body;
    const dto = createProductSchema.parse(req.body);
    const product = await ProductService.createProduct(vendorId, dto);
    res.status(201).json({ success: true, message: `Product created`, data: product });
});

export const updateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
    const uploadedFile = (req as Request & { file?: Express.Multer.File }).file;
    if (uploadedFile) {
        req.body.productImage = `/uploads/products/${uploadedFile.filename}`;
    }
    const { id } = req.body;
    const dto = updateProductSchema.parse(req.body);
    const product = await ProductService.updateProduct(id, dto);
    res.json({ success: true, message: "Product updated", data: product });
});

export const getAllProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
    const products = await ProductService.getAllProducts(req.body?.vendorId);
    res.json({ success: true, data: products });
});

export const getSingleProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    const product = await ProductService.getSingleProduct(id);
    res.json({ success: true, data: product });
});

export const deleteProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.body;
    await ProductService.deleteProduct(id);
    res.json({ success: true, message: "Product deleted" });
});

export const getNearbyBakeryProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
    const latitude = req.query.latitude ? req.query.latitude : undefined;
    const longitude = req.query.longitude ? req.query.longitude : undefined;
    
    const products = await ProductService.getNearbyBakeryProducts(Number(latitude), Number(longitude));
    res.json({ success: true, data: products });
});

export const getNearbyBakeryProductsByCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const latitude = req.query.latitude ? req.query.latitude : undefined;
    const longitude = req.query.longitude ? req.query.longitude : undefined;
    const categoryId = req.query.categoryId ? req.query.categoryId : undefined;

    const products = await ProductService.getNearbyBakeryProductsByCategory(Number(latitude), Number(longitude), String(categoryId));
    res.json({ success: true, data: products });
});
