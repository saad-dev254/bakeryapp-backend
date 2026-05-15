import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettings extends Document {
    deliveryCharges: string;
    radiusInKM: string;
    created_at: Date;
    updated_at: Date;
}

const settingsSchema: Schema = new mongoose.Schema({
    deliveryCharges: { type: String },
    radiusInKM: { type: String },
    created_at: { type: Date, default: Date },
    updated_at: { type: Date, default: Date },
});

const Settings: Model<ISettings> = mongoose.model<ISettings>("Settings", settingsSchema);

export default Settings;
