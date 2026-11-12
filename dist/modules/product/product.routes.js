"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../auth/auth.middleware");
const product_controller_1 = require("./product.controller");
const upload_1 = require("../../utils/upload");
exports.productRouter = (0, express_1.Router)();
// protected
exports.productRouter.post("/add-product", auth_middleware_1.requireAuth, upload_1.productImageUpload.single("productImage"), product_controller_1.createProduct);
exports.productRouter.put("/update-product", auth_middleware_1.requireAuth, upload_1.productImageUpload.single("productImage"), product_controller_1.updateProduct);
exports.productRouter.post("/all-products", auth_middleware_1.requireAuth, product_controller_1.getAllProducts);
exports.productRouter.post("/get-product-detail", auth_middleware_1.requireAuth, product_controller_1.getSingleProduct);
exports.productRouter.delete("/delete-product", auth_middleware_1.requireAuth, product_controller_1.deleteProduct);
exports.productRouter.get("/get-near-by-products", auth_middleware_1.requireAuth, product_controller_1.getNearbyBakeryProducts);
exports.productRouter.get("/get-near-by-products-by-category", auth_middleware_1.requireAuth, product_controller_1.getNearbyBakeryProductsByCategory);
