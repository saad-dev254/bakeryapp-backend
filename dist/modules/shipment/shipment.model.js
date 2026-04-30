"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const shipmentsSchema = new mongoose_1.default.Schema({
    shipment_no: { type: String, required: true },
    reference: { type: String, required: true },
    receiver_name: { type: String, required: true },
    shipment_quantity: { type: String, required: false },
    country: { type: String, required: true },
    country_code: { type: String, required: false },
    phone_code: { type: String, required: false },
    country_currency: { type: String, required: false },
    delivery_service: { type: String, required: true },
    city: { type: String, required: true },
    customer_address: { type: String, required: true },
    national_address: { type: String, required: false },
    location_coordinates: { type: String, required: false },
    customer_email: { type: String, required: true },
    contact_number: { type: String, required: true },
    whatsApp_number: { type: String, required: false },
    cod_amount: { type: String, required: true },
    branded_items: { type: String, required: true },
    custom_duty: { type: String, required: false },
    goods_description: { type: String, required: true },
    insurance: { type: String, required: true },
    reforward_shipment: { type: String, required: true },
    warehousing_location: { type: String, required: true },
    status: { type: String, default: "pending" },
    created_at: { type: Date, default: Date },
    updated_at: { type: Date, default: Date },
    user_id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    country_id: { type: mongoose_1.Schema.Types.ObjectId, required: false },
    delivery_service_id: { type: mongoose_1.Schema.Types.ObjectId, required: false },
    city_id: { type: mongoose_1.Schema.Types.ObjectId, required: false },
});
const Shipments = mongoose_1.default.model("Shipments", shipmentsSchema);
exports.default = Shipments;
