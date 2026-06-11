import { z } from "zod";

const adOnItemSchema = z.object({
    name: z.string().min(1),
    price: z.string().min(1),
});

const productItemSchema = z.object({
    productId: z.string().min(2),
    productName: z.string().min(2),
    productImage: z.string().min(2),
    productDescription: z.string().min(2),
    originalAmount: z.string().min(1),
    discountedAmount: z.string().min(1),
    subTotal: z.string().min(1),
    finalAmount: z.string().min(1),
    discountAmount: z.string().min(1),
    discountType: z.string().min(1),
    quantity: z.string().min(1),
    adOnList: z.array(adOnItemSchema).optional().default([]),
});

export const createOrderSchema = z.object({
    // user keys
    userId: z.string().min(2),
    userName: z.string().min(2),
    userEmail: z.string().email(),
    userPhoneNumber: z.string().min(11),
    userImage: z.string().min(2),
    userAddress: z.string().min(2),
    userLatitude: z.coerce.number(),
    userLongitude: z.coerce.number(),

    // order keys
    orderStatus: z.string().min(2),
    deliveryAddress: z.string().min(2),
    deliveryLatitude: z.coerce.number(),
    deliveryLongitude: z.coerce.number(),
    orderInstructions: z.string().min(2),
    subTotalAmount: z.string().min(2),
    deliveryCharges: z.string().min(2),
    discountAmount: z.string().optional(),
    totalAmount: z.string().min(2),
    bookingDate: z.string().min(2),
    bookingTime: z.string().min(2),

    // product keys as array
    products: z.array(productItemSchema).min(1),

    // bakery/vendor keys
    vendorId: z.string().min(2),
    vendorName: z.string().min(2),
    vendorEmail: z.string().min(2),
    vendorPhoneNumber: z.string().min(2),
    bakeryImage: z.string().min(2),
    bakeryName: z.string().min(2),
    bakeryAddress: z.string().min(2),
    bakeryLatitude: z.coerce.number(),
    bakeryLongitude: z.coerce.number(),
    openingTime: z.string().min(2),
    closingTime: z.string().min(2),
    bakeryType: z.string().min(2),
    preOrder: z.string().min(2),
    deliveryTime: z.string().min(2),

    // rider keys
    riderId:  z.string().min(2),
    riderName: z.string().min(2),
    riderEmail: z.string().min(2),
    riderPhoneNumber: z.string().min(2),
    riderImage: z.string().min(2),
});

export const updateOrderSchema = z.object({
    // order keys
    orderStatus: z.string().optional(),
    orderInstructions: z.string().optional(),
});

export const orderAnalyticsSchema = z.object({
    userId: z.string().optional(),
    role: z.enum(["ADMIN", "USER", "RIDER", "VENDOR"]),
});
