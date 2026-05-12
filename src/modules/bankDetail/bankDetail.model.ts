import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBankDetail extends Document {
    accountNumber: string;
    ibanNumber: string;
    bankName: string;
    accountHolderName: string;
    userId?: mongoose.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
}

const bankDetailSchema: Schema = new mongoose.Schema({
    accountNumber: { type: String, required: true },
    ibanNumber: { type: String, required: true },
    bankName: { type: String, required: true },
    accountHolderName: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    created_at: { type: Date, default: Date },
    updated_at: { type: Date, default: Date },
});

const BankDetail: Model<IBankDetail> = mongoose.model<IBankDetail>("BankDetail", bankDetailSchema);

export default BankDetail;
