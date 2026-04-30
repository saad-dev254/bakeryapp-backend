import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
    category_name: string;
    created_at: Date;
    updated_at: Date;
}

const categorySchema: Schema = new mongoose.Schema({
    category_name: { type: String, required: true },
    created_at: { type: Date, default: Date },
    updated_at: { type: Date, default: Date },
});

const Category: Model<ICategory> = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
