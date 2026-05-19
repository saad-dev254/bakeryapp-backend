import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
    categoryName: string;
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema: Schema = new mongoose.Schema({
    categoryName: { type: String, required: true },
    createdAt: { type: Date, default: Date },
    updatedAt: { type: Date, default: Date },
});

const Category: Model<ICategory> = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
