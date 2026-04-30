import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICountry extends Document {
    country_name: string;
    country_code: string;
    phone_code: string;
    currency_code: string;
    created_at: Date;
    updated_at: Date;
}

const countrySchema: Schema = new mongoose.Schema({
    country_name: { type: String, required: true },
    country_code: { type: String, required: true },
    phone_code: { type: String, required: true },
    currency_code: { type: String, required: true },
    created_at: { type: Date, default: Date },
    updated_at: { type: Date, default: Date },
});

const Country: Model<ICountry> = mongoose.model<ICountry>("Countries", countrySchema);

export default Country;
