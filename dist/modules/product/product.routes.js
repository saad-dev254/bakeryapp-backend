"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const product_controller_1 = require("./product.controller");
exports.productRouter = (0, express_1.Router)();
// protected
exports.productRouter.post("/add-product", auth_1.default, product_controller_1.createProduct);
exports.productRouter.put("/update-product/:id", auth_1.default, product_controller_1.updateProduct);
exports.productRouter.post("/products", auth_1.default, product_controller_1.getAllProducts);
exports.productRouter.get("/product/:id", auth_1.default, product_controller_1.getSingleProduct);
exports.productRouter.delete("/product/:id", auth_1.default, product_controller_1.deleteProduct);
