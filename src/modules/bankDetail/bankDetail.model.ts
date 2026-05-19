import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBankDetail extends Document {
    accountNumber: string;
    ibanNumber: string;
    bankName: string;
    accountHolderName: string;
    branchName: string;
    isPrimary: boolean;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const bankDetailSchema: Schema = new mongoose.Schema({
    accountNumber: { type: String, required: true },
    ibanNumber: { type: String, required: true },
    bankName: { type: String, required: true },
    accountHolderName: { type: String, required: true },
    branchName: { type: String, required: true },
    isPrimary: { type: Boolean, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    createdAt: { type: Date, default: Date },
    updatedAt: { type: Date, default: Date },
});

const BankDetail: Model<IBankDetail> = mongoose.model<IBankDetail>("BankDetail", bankDetailSchema);

export default BankDetail;
