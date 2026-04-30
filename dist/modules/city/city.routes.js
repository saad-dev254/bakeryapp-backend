"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cityRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const city_controller_1 = require("./city.controller");
exports.cityRouter = (0, express_1.Router)();
// protected
exports.cityRouter.post("/add-city", auth_1.default, city_controller_1.createCity);
exports.cityRouter.put("/update-city/:id", auth_1.default, city_controller_1.updateCity);
exports.cityRouter.get("/cities", auth_1.default, city_controller_1.getAllCities);
exports.cityRouter.get("/city/:id", auth_1.default, city_controller_1.getSingleCity);
exports.cityRouter.delete("/city/:id", auth_1.default, city_controller_1.deleteCity);
