import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
    vendorId?: mongoose.Types.ObjectId;
    productName?: string;
    productImage?: string;
    productDescription?: string;
    productPrice?: string;
    discountAmount?: string;
    discountType?: string;
    status?: Boolean;
    categoryId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const productsSchema: Schema = new mongoose.Schema({
    vendorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    productDescription: { type: String, required: true },
    productPrice: { type: String, required: true },
    discountAmount: { type: String },
    discountType: { type: String },
    status: { type: Boolean, required: true },
    categoryId: { type: Schema.Types.ObjectId, required: true, ref: "Category" },
    createdAt: { type: Date, default: Date },
    updatedAt: { type: Date, default: Date },
});

const Products: Model<IProduct> = mongoose.model<IProduct>("Products", productsSchema);

export default Products;
