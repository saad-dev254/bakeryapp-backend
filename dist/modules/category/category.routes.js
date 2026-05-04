"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRouter = void 0;
const express_1 = require("express");
const category_controller_1 = require("./category.controller");
const auth_middleware_1 = require("../auth/auth.middleware");
exports.categoryRouter = (0, express_1.Router)();
// protected
exports.categoryRouter.post("/add-category", auth_middleware_1.requireAuth, category_controller_1.createCategory);
exports.categoryRouter.put("/update-category", auth_middleware_1.requireAuth, category_controller_1.updateCategory);
exports.categoryRouter.get("/all-categories", auth_middleware_1.requireAuth, category_controller_1.getAllCategory);
exports.categoryRouter.post("/get-single-category", auth_middleware_1.requireAuth, category_controller_1.getSingleCategory);
exports.categoryRouter.delete("/delete-category", auth_middleware_1.requireAuth, category_controller_1.deleteCategory);
