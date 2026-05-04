import { Router } from "express";
import authenticateToken from "../../middlewares/auth";
import { createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct } from "./product.controller";
import { requireAuth } from "../auth/auth.middleware";

export const productRouter = Router();

// protected
productRouter.post("/add-product", authenticateToken, createProduct);
productRouter.put("/update-product/:id", authenticateToken, updateProduct);
productRouter.post("/products", authenticateToken, getAllProducts);
productRouter.get("/product/:id", authenticateToken, getSingleProduct);
productRouter.delete("/product/:id", authenticateToken, deleteProduct);
