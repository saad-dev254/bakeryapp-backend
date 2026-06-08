import { Router } from "express";
import authenticateToken from "../../middlewares/auth";
import { requireAuth } from "../auth/auth.middleware";
import { createProduct, deleteProduct, getAllProducts, getNearbyBakeryProducts, getNearbyBakeryProductsByCategory, getSingleProduct, updateProduct } from "./product.controller";
import { productImageUpload } from "../../utils/upload";

export const productRouter = Router();

// protected
productRouter.post("/add-product", requireAuth, productImageUpload.single("productImage"), createProduct);
productRouter.put("/update-product", requireAuth, productImageUpload.single("productImage"), updateProduct);
productRouter.post("/all-products", requireAuth, getAllProducts);
productRouter.post("/get-product-detail", requireAuth, getSingleProduct);
productRouter.delete("/delete-product", requireAuth, deleteProduct);
productRouter.get("/get-near-by-products", requireAuth, getNearbyBakeryProducts);
productRouter.get("/get-near-by-products-by-category", requireAuth, getNearbyBakeryProductsByCategory);
  
