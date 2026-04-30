import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVendor extends Document {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    address?: string;
    status: string;
    created_at: Date;
    updated_at: Date;
}

const vendorsSchema: Schema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: { type: String },
    status: { type: String, default: "active" },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Vendors: Model<IVendor> = mongoose.model<IVendor>("Vendors", vendorsSchema);

export default Vendors;
