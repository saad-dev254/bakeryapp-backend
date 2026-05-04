import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVendor extends Document {
    vendorId?: mongoose.Types.ObjectId;
    vendorName: string;
    vendorEmail: string;
    vendorMobileNo?: string;
    vendorDesignation?: string;
    vendorCnicNumber?: string;
    bakeryImage?: string;
    bakeryName?: string;
    bakeryAddress?: string;
    bakeryLatitude?: number;
    bakeryLongitude?: number;
    openingTime?: string;
    closingTime?: string;
    bakeryType?: string;
    preOrder?: string;
    deliveryTime?: string;
    status: string;
    created_at: Date;
    updated_at: Date;
}

const vendorsSchema: Schema = new mongoose.Schema({
    vendorId: { type: Schema.Types.ObjectId, required: true, unique: true },
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

const Vendors: Model<IVendor> = mongoose.model<IVendor>("Vendors", vendorsSchema);

export default Vendors;
