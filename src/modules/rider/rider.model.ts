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
    bikeRegistrationCard?: string;
    riderSelfie?: string;
    policeCharacterCertificate?: string;
    bikeModel?: string;
    bikeRegistrationNumber?: string;
    bikeNumberPlateImage?: string;
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
    bikeRegistrationCard: { type: String, required: true },
    riderSelfie: { type: String, required: true },
    policeCharacterCertificate: { type: String },
    bikeModel: { type: String, required: true },
    bikeRegistrationNumber: { type: String, required: true },
    bikeNumberPlateImage: { type: String, required: true },
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
