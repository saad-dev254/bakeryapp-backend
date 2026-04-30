"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countryRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const country_controller_1 = require("./country.controller");
exports.countryRouter = (0, express_1.Router)();
// protected
exports.countryRouter.post("/add-country", auth_1.default, country_controller_1.createCountry);
exports.countryRouter.put("/update-country/:id", auth_1.default, country_controller_1.updateCountry);
exports.countryRouter.get("/countries", auth_1.default, country_controller_1.getAllCountries);
exports.countryRouter.get("/country/:id", auth_1.default, country_controller_1.getSingleCountry);
exports.countryRouter.delete("/country/:id", auth_1.default, country_controller_1.deleteCountry);
