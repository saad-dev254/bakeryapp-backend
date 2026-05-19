import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettings extends Document {
    deliveryCharges: string;
    radiusInKM: string;
    createdAt: Date;
    updatedAt: Date;
}

const settingsSchema: Schema = new mongoose.Schema({
    deliveryCharges: { type: String },
    radiusInKM: { type: String },
    createdAt: { type: Date, default: Date },
    updatedAt: { type: Date, default: Date },
});

const Settings: Model<ISettings> = mongoose.model<ISettings>("Settings", settingsSchema);

export default Settings;
