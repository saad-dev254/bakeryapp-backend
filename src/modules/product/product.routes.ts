import { Router } from "express";
import authenticateToken from "../../middlewares/auth";
import { requireAuth } from "../auth/auth.middleware";
import { createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct } from "./product.controller";
import { productImageUpload } from "../../utils/upload";

export const productRouter = Router();

// protected
productRouter.post("/add-product", requireAuth, productImageUpload.single("productImage"), createProduct);
productRouter.put("/update-product", requireAuth, productImageUpload.single("productImage"), updateProduct);
productRouter.get("/all-products", requireAuth, getAllProducts);
productRouter.post("/get-product-detail", requireAuth, getSingleProduct);
productRouter.delete("/delete-product", authenticateToken, deleteProduct);
  
