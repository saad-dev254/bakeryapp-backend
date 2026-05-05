import { HttpError } from "../../utils/httpError";
import Order from "./order.model";

type AddOnItem = {
  name: string;
  price: string;
};

export async function createOrder(
dto: { 
  // user keys
  userId: string,
  userName: string,
  userEmail: string,
  userPhoneNumber: string,
  userImage: string,
  userAddress: string,
  userLatitude: number,
  userLongitude: number,

  // order keys
  orderStatus: string,
  deliveryAddress: string,
  deliveryLatitude: number,
  deliveryLongitude: number,
  orderInstructions: string,
  subTotalAmount: string,
  deliveryCharges: string,
  discountAmount: string,
  totalAmount: string,

  // product keys
  productName: string,
  productImage: string,
  productDescription: string,
  productPrice: string,
  addOnList: AddOnItem[],

  // bakery/vendor keys
  vendorId: string,
  vendorName: string,
  vendorEmail: string,
  vendorPhoneNumber: string,
  vendorDesignation: string,
  vendorCnicNumber: string,
  bakeryImage: string,
  bakeryName: string,
  bakeryAddress: string,
  bakeryLatitude: number,
  bakeryLongitude: number,
  openingTime: string,
  closingTime: string,
  bakeryType: string,
  preOrder: string,
  deliveryTime: string,
  status: string,

  // rider keys
  riderId: string,
  riderName: string,
  riderEmail: string,
  riderPhoneNumber: string,
  riderImage: string,
}) {
  // Generate random order number orders
  const order_number = 'ORD-' + Math.floor(100000 + Math.random() * 900000).toString();
  const order = await Order.create({
    userId: dto.userId,
    userName: dto.userName,
    userEmail: dto.userEmail,
    userPhoneNumber: dto.userPhoneNumber,
    userImage: dto.userImage,
    userAddress: dto.userAddress,
    userLatitude: dto.userLatitude,
    userLongitude: dto.userLongitude,

    // order keys
    orderStatus: dto.orderStatus,
    orderNumber: order_number,
    deliveryAddress: dto.deliveryAddress,
    deliveryLatitude: dto.deliveryLatitude,
    deliveryLongitude: dto.deliveryLongitude,
    orderInstructions: dto.orderInstructions,
    subTotalAmount: dto.subTotalAmount,
    deliveryCharges: dto.deliveryCharges,
    discountAmount: dto.discountAmount,
    totalAmount: dto.totalAmount,

    // product keys
    productName: dto.productName,
    productImage: dto.productImage,
    productDescription: dto.productDescription,
    productPrice: dto.productPrice,
    addOnList: dto.addOnList,

    // bakery/vendor keys
    vendorId: dto.vendorId,
    vendorName: dto.vendorName,
    vendorEmail: dto.vendorEmail,
    vendorPhoneNumber: dto.vendorPhoneNumber,
    vendorDesignation: dto.vendorDesignation,
    vendorCnicNumber: dto.vendorCnicNumber,
    bakeryImage: dto.bakeryImage,
    bakeryName: dto.bakeryName,
    bakeryAddress: dto.bakeryAddress,
    bakeryLatitude: dto.bakeryLatitude,
    bakeryLongitude: dto.bakeryLongitude,
    openingTime: dto.openingTime,
    closingTime: dto.closingTime,
    bakeryType: dto.bakeryType,
    preOrder: dto.preOrder,
    deliveryTime: dto.deliveryTime,
    status: dto.status,

    // rider keys
    riderId: dto.riderId,
    riderName: dto.riderName,
    riderEmail: dto.riderEmail,
    riderPhoneNumber: dto.riderPhoneNumber,
    riderImage: dto.riderImage,
  });

  return sanitizeOrder(order);
}

export async function getAllOrders(vendorId: string) {
    let order;
    if (vendorId) {
      order = await Order.find({ vendorId })
    } else {
      order = await Order.find()
    }
    if (!order || order.length === 0) throw new HttpError(404, "No order found.");
    return order.map(sanitizeOrder);
}

export async function getSingleOrder(id: string) {
    const order = await Order.findById(id);
    if (!order) throw new HttpError(404, "Order not found");
    return sanitizeOrder(order);
}

export async function updateOrder(id: string, dto: { orderStatus?: string }) {
  const order = await Order.findById(id);
  if (!order) throw new HttpError(404, "Order not found");

  if (dto.orderStatus) order.orderStatus = dto.orderStatus;

  await order.save();
  return sanitizeOrder(order);
}

export async function deleteOrder(id: string) {
  await Order.findByIdAndDelete(id);
  return true;
}

function sanitizeOrder(order: any) {
  return {
    id: String(order._id),
    // user keys
    userId: String(order.userId),
    userName: order.userName,
    userEmail: order.userEmail,
    userPhoneNumber: order.userPhoneNumber,
    userImage: order.userImage,
    userAddress: order.userAddress,
    userLatitude: order.userLatitude,
    userLongitude: order.userLongitude,

    // order keys
    orderStatus: order.orderStatus,
    orderNumber: order.orderNumber,
    deliveryAddress: order.deliveryAddress,
    deliveryLatitude: order.deliveryLatitude,
    deliveryLongitude: order.deliveryLongitude,
    orderInstructions: order.orderInstructions,
    subTotalAmount: order.subTotalAmount,
    deliveryCharges: order.deliveryCharges,
    discountAmount: order.discountAmount,
    totalAmount: order.totalAmount,

    // product keys
    productName: order.productName,
    productImage: order.productImage,
    productDescription: order.productDescription,
    productPrice: order.productPrice,
    addOnList: order.addOnList,

    // bakery/vendor keys
    vendorId: String(order.vendorId),
    vendorName: order.vendorName,
    vendorEmail: order.vendorEmail,
    vendorPhoneNumber: order.vendorPhoneNumber,
    vendorDesignation: order.vendorDesignation,
    vendorCnicNumber: order.vendorCnicNumber,
    bakeryImage: order.bakeryImage,
    bakeryName: order.bakeryName,
    bakeryAddress: order.bakeryAddress,
    bakeryLatitude: order.bakeryLatitude,
    bakeryLongitude: order.bakeryLongitude,
    openingTime: order.openingTime,
    closingTime: order.closingTime,
    bakeryType: order.bakeryType,
    preOrder: order.preOrder,
    deliveryTime: order.deliveryTime,
    status: order.status,

    // rider keys
    riderId: String(order.riderId),
    riderName: order.riderName,
    riderEmail: order.riderEmail,
    riderPhoneNumber: order.riderPhoneNumber,
    riderImage: order.riderImage,
  };
}
