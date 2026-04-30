import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICity extends Document {
    city_name: string;
    created_at: Date;
    updated_at: Date;
    country_id?: mongoose.Types.ObjectId;
}

const citySchema: Schema = new mongoose.Schema({
    city_name: { type: String, required: true },
    created_at: { type: Date, default: Date },
    updated_at: { type: Date, default: Date },
    country_id: { type: Schema.Types.ObjectId, required: true },
});

const City: Model<ICity> = mongoose.model<ICity>("Cities", citySchema);

export default City;
