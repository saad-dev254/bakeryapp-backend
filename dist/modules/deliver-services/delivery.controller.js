"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteService = exports.getSingleService = exports.getAllServices = exports.updateService = exports.createService = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const delivery_model_1 = __importDefault(require("./delivery.model"));
// Validation function for Deliver Service fields
function validateServiceFields(body, type = "create") {
    const { delivery_service_name, city_ids } = body;
    // Validate delivery_service_name
    if (!delivery_service_name ||
        typeof delivery_service_name !== "string" ||
        delivery_service_name.trim() === "") {
        return false;
    }
    // Validate city_ids (required for create, optional for update)
    if (type === "create" || (type === "update" && city_ids !== undefined)) {
        if (!Array.isArray(city_ids) ||
            city_ids.length === 0 ||
            !city_ids.every((id) => typeof id === "string" && id.trim() !== "")) {
            return false;
        }
    }
    return true;
}
;
// POST / CREATE Deliver Service with multiple city_ids
exports.createService = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // Validate required fields for creating a country
    if (!validateServiceFields(req.body, "create")) {
        return res.status(400).json({
            code: 400,
            status: false,
            message: "Delivery service name and at least one city are required and must not be blank",
        });
    }
    try {
        const { delivery_service_name, city_ids = [] } = req.body;
        if (city_ids &&
            (!Array.isArray(city_ids) || !city_ids.every(id => typeof id === "string" && id.trim().length > 0))) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: "City must be a non-empty",
            });
        }
        const data = {
            delivery_service_name: delivery_service_name?.toUpperCase(),
            city_ids: city_ids.map((id) => id) // Optionally, convert to ObjectId if desired
        };
        const newDeliveryService = new delivery_model_1.default(data);
        const savedDeliveryService = await newDeliveryService.save();
        res.status(200).json({
            code: 200,
            status: true,
            message: "Delivery Service added successfully",
            data: savedDeliveryService
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Delivery service added failed",
        });
    }
});
// PUT (update) Deliver Service by ID, including multiple city_ids
exports.updateService = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { delivery_service_name, city_ids } = req.body;
    try {
        const updateData = {
            updated_at: new Date()
        };
        if (delivery_service_name) {
            updateData.delivery_service_name = delivery_service_name?.toUpperCase();
        }
        if (city_ids !== undefined) {
            if (!Array.isArray(city_ids) ||
                !city_ids.every(id => typeof id === "string" && id.trim().length > 0)) {
                return res.status(400).json({
                    code: 400,
                    status: false,
                    message: "City must be a non-empty",
                });
            }
            updateData.city_ids = city_ids.map((id) => id);
        }
        const updatedDeliveryService = await delivery_model_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updatedDeliveryService) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Delivery Service not found",
            });
        }
        res.status(200).json({
            code: 200,
            status: true,
            message: "Delivery Service updated successfully",
            data: updatedDeliveryService,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to update delivery service",
        });
    }
});
// GET all Deliver Services
exports.getAllServices = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const deliveryServices = await delivery_model_1.default.find(); // Fetch all Categories from MongoDB
        res.status(200).json({
            code: 200,
            status: true,
            message: "Delivery Services fetched successfully",
            data: deliveryServices,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch delivery services",
        });
    }
});
// GET single Deliver Service by ID
exports.getSingleService = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    try {
        const deliveryService = await delivery_model_1.default.findById(id);
        if (!deliveryService) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Delivery Service not found",
            });
        }
        res.status(200).json({
            code: 200,
            status: true,
            message: "Delivery Service fetched successfully",
            data: deliveryService,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to fetch delivery service",
        });
    }
});
// DELETE single Deliver Service by ID
exports.deleteService = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedDeliveryService = await delivery_model_1.default.findByIdAndDelete(id);
        if (!deletedDeliveryService) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Delivery Service not found",
            });
        }
        res.status(200).json({
            code: 200,
            status: true,
            message: "Delivery Service deleted successfully",
            // data: deletedDeliveryService,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Failed to delete delivery service",
        });
    }
});
