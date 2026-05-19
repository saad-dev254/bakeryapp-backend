import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdOn extends Document {
    adOnName: string;
    adOnPrice: string;
    vendorId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const adOnSchema: Schema = new mongoose.Schema({
    adOnName: { type: String, required: true },
    adOnPrice: { type: String, required: true },
    vendorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    createdAt: { type: Date, default: Date },
    updatedAt: { type: Date, default: Date },
});

const AdOn: Model<IAdOn> = mongoose.model<IAdOn>("AdOn", adOnSchema);

export default AdOn;
