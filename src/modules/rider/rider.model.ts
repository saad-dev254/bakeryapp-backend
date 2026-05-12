import mongoose, { Schema, Document, Model, model } from "mongoose";

export interface IRider extends Document {
    riderId?: mongoose.Types.ObjectId;
    riderCnicNumber?: string;
    riderImage?: string;
    riderCnicFrontImage?: string;
    riderCnicBackImage?: string;
    riderAddress?: string;
    riderLatitude?: number;
    riderLongitude?: number;
    riderDOB?: string;
    drivingLicense?: string;
    vehicleRegistrationCard?: string;
    riderSelfie?: string;
    policeCharacterCertificate?: string;
    vehicleModel?: string;
    vehicleRegistrationNumber?: string;
    vehicleNumberPlateImage?: string;
    vehicleType?: string;
    fuelType?: string;
    isOnline?: string;
    approvalStatus?: string;
    rejectReason?: string;
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
    riderDOB: { type: String, required: true },
    drivingLicense: { type: String, required: true },
    vehicleRegistrationCard: { type: String, required: true },
    riderSelfie: { type: String, required: true },
    policeCharacterCertificate: { type: String },
    vehicleModel: { type: String, required: true },
    vehicleRegistrationNumber: { type: String, required: true },
    vehicleNumberPlateImage: { type: String, required: true },
    vehicleType: { type: String, required: true },
    fuelType: { type: String },
    isOnline: { type: String, default: "online" },
    approvalStatus: { type: String, required: true },
    rejectReason: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Riders: Model<IRider> = mongoose.model<IRider>("Riders", ridersSchema);

export default Riders;
