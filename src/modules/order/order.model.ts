import mongoose, { Schema, Document, Model } from "mongoose";

interface IAdOnItem {
    name: string;
    price: string;
}

export interface IOrder extends Document {
    // user keys
    userId?: mongoose.Types.ObjectId;
    userName?: string;
    userEmail?: string;
    userPhoneNumber?: string;
    userImage?: string;
    userAddress?: string;
    userLatitude?: number;
    userLongitude?: number;

    // order keys
    orderStatus?: string;
    orderNumber?: string;
    deliveryAddress?: string;
    deliveryLatitude?: number;
    deliveryLongitude?: number;
    orderInstructions?: string;
    subTotalAmount?: string;
    deliveryCharges?: string;
    discountAmount?: string;
    totalAmount?: string;
    bookingDate?: Date;
    bookingTime?: Date;

    // product keys
    productName?: string;
    productImage?: string;
    productDescription?: string;
    productPrice?: string;
    adOnList?: IAdOnItem[];

    // bakery/vendor keys
    vendorId?: mongoose.Types.ObjectId;
    vendorName?: string;
    vendorEmail?: string;
    vendorPhoneNumber?: string;
    bakeryImage?: string;
    bakeryName?: string;
    bakeryAddress?: string;
    bakeryLatitude?: number;
    bakeryLongitude?: number;
    openingTime?: string;
    closingTime?: string;
    bakeryType?: string;
    preOrder?: string;
    deliveryTime?: string;

    // rider keys
    riderId?: mongoose.Types.ObjectId;
    riderName?: string;
    riderEmail?: string;
    riderPhoneNumber?: string;
    riderImage?: string;

    createdAt: Date;
    updatedAt: Date;
}

const orderSchema: Schema = new mongoose.Schema({
    // user keys
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userPhoneNumber: { type: String, required: true },
    userImage: { type: String, required: true },
    userAddress: { type: String, required: true },
    userLatitude: { type: Number, required: true },
    userLongitude: { type: Number, required: true },

    // order keys
    orderStatus: { type: String, required: true },
    orderNumber: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    deliveryLatitude: { type: Number, required: true },
    deliveryLongitude: { type: Number, required: true },
    orderInstructions: { type: String, required: true },
    subTotalAmount: { type: String, required: true },
    deliveryCharges: { type: String, required: true },
    discountAmount: { type: String, required: true },
    totalAmount: { type: String, required: true },

    // product keys
    bookingDate: { type: Date },
    bookingTime: { type: Date },
    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    productDescription: { type: String, required: true },
    productPrice: { type: String, required: true },
    adOnList: {
        type: [
            {
                name: { type: String, required: true },
                price: { type: String, required: true },
            },
        ],
        required: false,
        default: [],
    },

    // bakery/vendor keys
    vendorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    vendorName: { type: String, required: true },
    vendorEmail: { type: String, required: true },
    vendorPhoneNumber: { type: String, required: true },
    bakeryImage: { type: String, required: true },
    bakeryName: { type: String, required: true },
    bakeryAddress: { type: String, required: true },
    bakeryLatitude: { type: Number, required: true },
    bakeryLongitude: { type: Number, required: true },
    openingTime: { type: String, required: true },
    closingTime: { type: String, required: true },
    bakeryType: { type: String, required: true },
    preOrder: { type: String, required: true },
    deliveryTime: { type: String, required: true },

    // rider keys
    riderId: { type: Schema.Types.ObjectId, required: true, ref: "Rider" },
    riderName: { type: String, required: true },
    riderEmail: { type: String, required: true },
    riderPhoneNumber: { type: String, required: true },
    riderImage: { type: String, required: true },

    createdAt: { type: Date, default: Date },
    updatedAt: { type: Date, default: Date },
});

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
