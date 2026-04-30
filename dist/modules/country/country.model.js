"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const countrySchema = new mongoose_1.default.Schema({
    country_name: { type: String, required: true },
    country_code: { type: String, required: true },
    phone_code: { type: String, required: true },
    currency_code: { type: String, required: true },
    created_at: { type: Date, default: Date },
    updated_at: { type: Date, default: Date },
});
const Country = mongoose_1.default.model("Countries", countrySchema);
exports.default = Country;
