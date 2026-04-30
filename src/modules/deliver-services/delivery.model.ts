import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDeliveryService extends Document {
    delivery_service_name: string;
    city_ids: mongoose.Types.ObjectId[];
    created_at: Date;
    updated_at: Date;
}

const deliveryServiceSchema: Schema = new mongoose.Schema({
    delivery_service_name: { type: String, required: true },
    created_at: { type: Date, default: Date },
    updated_at: { type: Date, default: Date },
    city_ids: [{ type: Schema.Types.ObjectId, required: true }],
});

const DeliveryService: Model<IDeliveryService> = mongoose.model<IDeliveryService>("DeliveryService", deliveryServiceSchema);

export default DeliveryService;
