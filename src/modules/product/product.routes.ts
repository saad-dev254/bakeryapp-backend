import { Router } from "express";
import authenticateToken from "../../middlewares/auth";
import { requireAuth } from "../auth/auth.middleware";
import { createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct } from "./product.controller";

export const productRouter = Router();

// protected
productRouter.post("/add-product", requireAuth, createProduct);
productRouter.put("/update-product", requireAuth, updateProduct);
productRouter.get("/all-products", requireAuth, getAllProducts);
productRouter.post("/get-product-detail", requireAuth, getSingleProduct);
productRouter.delete("/delete-product", authenticateToken, deleteProduct);
  
