import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRider extends Document {
    riderId?: mongoose.Types.ObjectId;
    riderCnicNumber?: string;
    riderImage?: string;
    riderCnicFrontImage?: string;
    riderCnicBackImage?: string;
    riderAddress?: string;
    riderLatitude?: number;
    riderLongitude?: number;
    riderStatus?: string;
    created_at: Date;
    updated_at: Date;
}

const ridersSchema: Schema = new mongoose.Schema({
    riderId: { type: Schema.Types.ObjectId, required: true, unique: true, ref: "User" },
    riderCnicNumber: { type: String, required: true },
    riderImage: { type: String, required: true },
    riderCnicFrontImage: { type: String, required: true },
    riderCnicBackImage: { type: String, required: true },
    riderAddress: { type: String, required: true },
    riderLatitude: { type: Number, required: true },
    riderLongitude: { type: Number, required: true },
    riderStatus: { type: String, default: "online" },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Riders: Model<IRider> = mongoose.model<IRider>("Riders", ridersSchema);

export default Riders;
