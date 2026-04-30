"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCity = exports.getSingleCity = exports.getAllCities = exports.updateCity = exports.createCity = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const city_model_1 = __importDefault(require("./city.model"));
const country_model_1 = __importDefault(require("../country/country.model"));
// Validation function for City fields
function validateCityFields(body, type = "create") {
    const { city_name, country_id } = body;
    if (!city_name || typeof city_name !== "string" || city_name.trim() === "") {
        return false;
    }
    if (!country_id || typeof country_id !== "string" || country_id.trim() === "") {
        return false;
    }
    return true;
}
;
// POST / CREATE City
exports.createCity = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // Validate required fields for creating a category
    if (!validateCityFields(req.body, "create")) {
        return res.status(400).json({
            code: 400,
            status: false,
            message: "City name and country are required and must not be blank",
        });
    }
    try {
        const newCity = new city_model_1.default(req.body);
        const savedCity = await newCity.save();
        res.status(200).json({
            code: 200,
            status: true,
            message: "City added successfully",
            data: savedCity
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "City added failed",
        });
    }
});
// PUT (update) City by ID
exports.updateCity = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { city_name, country_id } = req.body;
    try {
        const updatedCity = await city_model_1.default.findByIdAndUpdate(id, {
            city_name, country_id,
            updated_at: new Date()
        }, { new: true, runValidators: true });
        if (!updatedCity) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "City not found",
            });
        }
        res.status(200).json({
            code: 200,
            status: true,
            message: "City updated successfully",
            data: updatedCity,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to update city",
        });
    }
});
// GET all Cities
exports.getAllCities = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const cities = await city_model_1.default.find().lean(); // Fetch all Cities from MongoDB
        // Fetch all country ids used by cities in one go
        const countryIds = [
            ...new Set(cities
                .map(p => p.country_id)
                .filter((id) => !!id))
        ];
        const countries = await country_model_1.default.find({ _id: { $in: countryIds } }).lean();
        const countryMap = {};
        countries.forEach(con => {
            countryMap[con._id.toString()] = con.country_name;
        });
        // Attach country_name to each product
        const citiesWithCountries = cities.map(cities => {
            const countryIdKey = String(cities.country_id);
            return {
                ...cities,
                country_name: countryMap[countryIdKey] || null
            };
        });
        res.status(200).json({
            code: 200,
            status: true,
            message: "Cities fetched successfully",
            data: citiesWithCountries,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch cities",
        });
    }
});
// GET single City by ID
exports.getSingleCity = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    try {
        const city = await city_model_1.default.findById(id);
        if (!city) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "City not found",
            });
        }
        res.status(200).json({
            code: 200,
            status: true,
            message: "City fetched successfully",
            data: city,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch city",
        });
    }
});
// DELETE single City by ID
exports.deleteCity = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCity = await city_model_1.default.findByIdAndDelete(id);
        if (!deletedCity) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "City not found",
            });
        }
        res.status(200).json({
            code: 200,
            status: true,
            message: "City deleted successfully",
            // data: deletedCity,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to delete city",
        });
    }
});
