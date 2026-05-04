import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
    product_name: string;
    product_brand: string;
    product_size: string;
    product_color: string;
    product_details: string;
    created_at: Date;
    updated_at: Date;
    user_id?: mongoose.Types.ObjectId;
    category_id?: mongoose.Types.ObjectId;
}

const productSchema: Schema = new mongoose.Schema({
    product_name: { type: String, required: true },
    product_brand: { type: String, required: true },
    product_size: { type: String, required: true },
    product_color: { type: String, required: true },
    product_details: { type: String, required: true },
    created_at: { type: Date, default: Date },
    updated_at: { type: Date, default: Date },
    user_id: { type: Schema.Types.ObjectId, required: true },
    category_id: { type: Schema.Types.ObjectId, required: true },
});

const Products: Model<IProduct> = mongoose.model<IProduct>("Products", productSchema);

export default Products;
