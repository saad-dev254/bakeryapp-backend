import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
    vendorId?: mongoose.Types.ObjectId;
    productName?: string;
    productImage?: string;
    productDescription?: string;
    productPrice?: string;
    discountAmount?: string;
    discountType?: string;
    categoryId?: mongoose.Types.ObjectId;
    addOnIds?: mongoose.Types.ObjectId[];
}

const productsSchema: Schema = new mongoose.Schema({
    vendorId: { type: Schema.Types.ObjectId, required: true },
    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    productDescription: { type: String, required: true },
    productPrice: { type: String, required: true },
    discountAmount: { type: String },
    discountType: { type: String },
    categoryId: { type: Schema.Types.ObjectId, required: true },
    addOnIds: [{ type: Schema.Types.ObjectId }],
});

const Products: Model<IProduct> = mongoose.model<IProduct>("Products", productsSchema);

export default Products;
