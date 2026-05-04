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
const vendorsSchema = new mongoose_1.default.Schema({
    vendorId: { type: mongoose_1.Schema.Types.ObjectId, required: true, unique: true },
    vendorName: { type: String, required: true },
    // vendorEmail: { type: String, required: true, unique: true },
    vendorEmail: { type: String, required: true, lowercase: true, trim: true },
    vendorMobileNo: { type: String, required: true },
    vendorDesignation: { type: String, required: true },
    vendorCnicNumber: { type: String, required: true },
    bakeryImage: { type: String, required: true },
    bakeryName: { type: String, required: true },
    bakeryAddress: { type: String, required: true },
    bakeryLatitude: { type: Number, required: true },
    bakeryLongitude: { type: Number, required: true },
    openingTime: { type: String, required: true },
    closingTime: { type: String, required: true },
    bakeryType: { type: String, required: true },
    preOrder: { type: String, required: true },
    deliveryTime: { type: String, required: true },
    status: { type: String, default: "online" },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});
const Vendors = mongoose_1.default.model("Vendors", vendorsSchema);
exports.default = Vendors;
