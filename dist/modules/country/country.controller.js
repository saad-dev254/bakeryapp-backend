"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCountry = exports.getSingleCountry = exports.getAllCountries = exports.updateCountry = exports.createCountry = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const country_model_1 = __importDefault(require("./country.model"));
// Validation function for Country fields
function validateCountryFields(body, type = "create") {
    const { country_name, country_code, phone_code, currency_code } = body;
    // If type is "create", require user_id. If "update", ignore user_id validation.
    if (!country_name || typeof country_name !== "string" || country_name.trim() === "" ||
        !country_code || typeof country_code !== "string" || country_code.trim() === "" ||
        !phone_code || typeof phone_code !== "string" || phone_code.trim() === "" ||
        !currency_code || typeof currency_code !== "string" || currency_code.trim() === "") {
        return false;
    }
    return true;
}
;
// POST / CREATE Country with multiple 
exports.createCountry = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // Validate required fields for creating a country
    if (!validateCountryFields(req.body, "create")) {
        return res.status(400).json({
            code: 400,
            status: false,
            message: "Country name, Country code, Phone code and Currency code must not be blank",
        });
    }
    try {
        const { country_name } = req.body;
        const data = { ...req.body, country_name: country_name?.toUpperCase() };
        const newCountry = new country_model_1.default(data);
        const savedCountry = await newCountry.save();
        res.status(200).json({
            code: 200,
            status: true,
            message: "Country created successfully",
            data: savedCountry
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Country create failed",
        });
    }
});
// PUT (update) Country by ID, including multiple 
exports.updateCountry = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { country_name } = req.body;
    try {
        const updateData = {
            updated_at: new Date()
        };
        if (country_name) {
            updateData.country_name = country_name?.toUpperCase();
        }
        const updatedCountry = await country_model_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updatedCountry) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Country not found",
            });
        }
        res.status(200).json({
            code: 200,
            status: true,
            message: "Country updated successfully",
            data: updatedCountry,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to update country",
        });
    }
});
// GET all Countries
exports.getAllCountries = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const countries = await country_model_1.default.find(); // Fetch all Categories from MongoDB
        res.status(200).json({
            code: 200,
            status: true,
            message: "Countries fetched successfully",
            data: countries,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch countries",
        });
    }
});
// GET single Country by ID
exports.getSingleCountry = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    try {
        const country = await country_model_1.default.findById(id);
        if (!country) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Country not found",
            });
        }
        res.status(200).json({
            code: 200,
            status: true,
            message: "Country fetched successfully",
            data: country,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch country",
        });
    }
});
// DELETE single Country by ID
exports.deleteCountry = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCountry = await country_model_1.default.findByIdAndDelete(id);
        if (!deletedCountry) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Country not found",
            });
        }
        res.status(200).json({
            code: 200,
            status: true,
            message: "Country deleted successfully",
            // data: deletedCountry,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to delete country",
        });
    }
});
