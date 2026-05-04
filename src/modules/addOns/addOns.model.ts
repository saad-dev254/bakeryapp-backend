import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAddOn extends Document {
    addOnName: string;
    addOnPrice: string;
    created_at: Date;
    updated_at: Date;
}

const addOnSchema: Schema = new mongoose.Schema({
    addOnName: { type: String, required: true },
    addOnPrice: { type: String, required: true },
    created_at: { type: Date, default: Date },
    updated_at: { type: Date, default: Date },
});

const AddOn: Model<IAddOn> = mongoose.model<IAddOn>("AddOn", addOnSchema);

export default AddOn;
