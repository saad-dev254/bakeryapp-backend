"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const category_controller_1 = require("./category.controller");
exports.categoryRouter = (0, express_1.Router)();
// protected
exports.categoryRouter.post("/add-category", auth_1.default, category_controller_1.createCategory);
exports.categoryRouter.put("/update-category/:id", auth_1.default, category_controller_1.updateCategory);
exports.categoryRouter.get("/categories", auth_1.default, category_controller_1.getAllCategories);
exports.categoryRouter.get("/category/:id", auth_1.default, category_controller_1.getSingleCategory);
exports.categoryRouter.delete("/category/:id", auth_1.default, category_controller_1.deleteCategory);
