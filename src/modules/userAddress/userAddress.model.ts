import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserAddress extends Document {
    address: string;
    latitude: string;
    longitude: string;
    userId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const userAddressSchema: Schema = new mongoose.Schema({
    address: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
    createdAt: { type: Date, default: Date },
    updatedAt: { type: Date, default: Date },
});

const UserAddress: Model<IUserAddress> = mongoose.model<IUserAddress>("UserAddresses", userAddressSchema);

export default UserAddress;
