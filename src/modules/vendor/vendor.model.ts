import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVendor extends Document {
    vendorId?: mongoose.Types.ObjectId;
    vendorDesignation?: string;
    vendorCnicNumber?: string;
    vendorCnicFrontImage?: string;
    vendorCnicBackImage?: string;
    bakeryLogo?: string;
    bakeryImage?: string;
    bakeryName?: string;
    bakeryAddress?: string;
    bakeryLatitude?: string;
    bakeryLongitude?: string;
    city?: string;
    area?: string;
    ntnNumber?: string;
    ntnImage?: string;
    foodLicenseImage?: string;
    openingTime?: string;
    closingTime?: string;
    bakeryType?: string;
    preOrder?: string;
    deliveryTime?: string;
    kitchenImages?: string[]; // Multiple kitchen images, optional
    isOnline: string;
    approvalStatus: string;
    rejectReason: string;
    created_at: Date;
    updated_at: Date;
}

const vendorsSchema: Schema = new mongoose.Schema({
    vendorId: { type: Schema.Types.ObjectId, required: true, unique: true, ref: "User" },
    vendorDesignation: { type: String, required: true },
    vendorCnicNumber: { type: String, required: true },
    vendorCnicFrontImage: { type: String, required: true },
    vendorCnicBackImage: { type: String, required: true },
    bakeryLogo: { type: String, required: true },
    bakeryImage: { type: String, required: true },
    bakeryName: { type: String, required: true },
    bakeryAddress: { type: String, required: true },
    bakeryLatitude: { type: String, required: true },
    bakeryLongitude: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String },
    ntnNumber: { type: String },
    ntnImage: { type: String },
    foodLicenseImage: { type: String },
    openingTime: { type: String, required: true },
    closingTime: { type: String, required: true },
    bakeryType: { type: String, required: true },
    preOrder: { type: String, required: true },
    deliveryTime: { type: String, required: true },
    kitchenImages: [{ type: String }], // Field for multiple kitchen images
    isOnline: { type: String, required: true },
    approvalStatus: { type: String, required: true },
    rejectReason: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Vendors: Model<IVendor> = mongoose.model<IVendor>("Vendors", vendorsSchema);

export default Vendors;
