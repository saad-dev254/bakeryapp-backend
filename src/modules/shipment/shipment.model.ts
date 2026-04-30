import mongoose, { Schema, Document, Model } from "mongoose";

export interface IShipment extends Document {
    shipment_no: string,
    reference: string;
    receiver_name: string;
    shipment_quantity?: string;
    country: string;
    delivery_service: string;
    city: string;
    country_id?: mongoose.Types.ObjectId;
    delivery_service_id?: mongoose.Types.ObjectId;
    city_id?: mongoose.Types.ObjectId;
    country_code: string;
    phone_code: string;
    country_currency: string;
    customer_address: string;
    national_address: string;
    location_coordinates: string;
    customer_email: string;
    contact_number: string;
    whatsApp_number: string;
    cod_amount: string;
    branded_items: string;
    custom_duty: string;
    goods_description: string;
    insurance: string;
    reforward_shipment: string;
    warehousing_location: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    user_id?: mongoose.Types.ObjectId;
}

const shipmentsSchema: Schema = new mongoose.Schema({
    shipment_no: { type: String, required: true },
    reference: { type: String, required: true },
    receiver_name: { type: String, required: true },
    shipment_quantity: { type: String, required: false },
    country: { type: String, required: true },
    country_code: { type: String, required: false },
    phone_code: { type: String, required: false },
    country_currency: { type: String, required: false },
    delivery_service: { type: String, required: true },
    city: { type: String, required: true },
    customer_address: { type: String, required: true },
    national_address: { type: String, required: false },
    location_coordinates: { type: String, required: false },
    customer_email: { type: String, required: true },
    contact_number: { type: String, required: true },
    whatsApp_number: { type: String, required: false },
    cod_amount: { type: String, required: true },
    branded_items: { type: String, required: true },
    custom_duty: { type: String, required: false },
    goods_description: { type: String, required: true },
    insurance: { type: String, required: true },
    reforward_shipment: { type: String, required: true },
    warehousing_location: { type: String, required: true },
    status: { type: String, default: "pending" },
    created_at: { type: Date, default: Date },
    updated_at: { type: Date, default: Date },
    user_id: { type: Schema.Types.ObjectId, required: true },
    country_id: { type: Schema.Types.ObjectId, required: false },
    delivery_service_id: { type: Schema.Types.ObjectId, required: false },
    city_id: { type: Schema.Types.ObjectId, required: false },
});

const Shipments: Model<IShipment> = mongoose.model<IShipment>("Shipments", shipmentsSchema);

export default Shipments;
