import { HttpError } from "../../utils/httpError";
import mongoose from "mongoose";
import Order from "./order.model";

type AdOnItem = {
  name: string;
  price: string;
};

type ProductItem = {
  productId?: string;
  productName?: string;
  productImage?: string;
  productDescription?: string;
  originalAmount?: string;
  discountedAmount?: string;
  subTotal?: string;
  finalAmount?: string;
  discountAmount?: string;
  discountType?: string;
  quantity?: string;
  adOnList: AdOnItem[];
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
    discountAmount?: string,
    totalAmount: string,
    bookingDate: string,
    bookingTime: string,

    // product keys (as array now)
    products: ProductItem[],

    // bakery/vendor keys
    vendorId: string,
    vendorName: string,
    vendorEmail: string,
    vendorPhoneNumber: string,
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

    // rider keys
    riderId: string,
    riderName: string,
    riderEmail: string,
    riderPhoneNumber: string,
    riderImage: string,
  }
) {
  // Generate random order number
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
    bookingDate: dto.bookingDate,
    bookingTime: dto.bookingTime,

    // product keys as array
    products: dto.products,

    // bakery/vendor keys
    vendorId: dto.vendorId,
    vendorName: dto.vendorName,
    vendorEmail: dto.vendorEmail,
    vendorPhoneNumber: dto.vendorPhoneNumber,
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

    // rider keys
    riderId: dto.riderId,
    riderName: dto.riderName,
    riderEmail: dto.riderEmail,
    riderPhoneNumber: dto.riderPhoneNumber,
    riderImage: dto.riderImage,
  });

  return sanitizeOrder(order);
}

export async function getAllOrders(vendorId: string, riderId: string, userId: string) {
    let order;
    if (vendorId) {
      order = await Order.find({ vendorId })
    } else if (riderId) {
      order = await Order.find({ riderId })
    } else if (userId) {
      order = await Order.find({ userId })
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

export async function getOrderAnalytics(dto: { role: "ADMIN" | "USER" | "RIDER" | "VENDOR"; userId?: string }) {
  const statusList = [
    "total",
    "pending",
    "processing",
    "preorder",
    "ready",
    "delivered",
    "cancelled",
    "refunded",
    "failed",
  ];

  const matchQuery: Record<string, any> = {};
  if (dto.role !== "ADMIN") {
    if (!dto.userId || !mongoose.Types.ObjectId.isValid(dto.userId)) {
      throw new HttpError(400, "Invalid or missing user ID");
    }
    matchQuery.userId = new mongoose.Types.ObjectId(dto.userId);
  }

  /* =========================
    STATUS COUNTS
  ========================= */
  const statusPipeline: any[] = [];
  if (Object.keys(matchQuery).length) statusPipeline.push({ $match: matchQuery });
  statusPipeline.push({
    $group: {
      _id: "$orderStatus",
      count: { $sum: 1 },
    },
  });

  const statusCounts = await Order.aggregate(statusPipeline);
  const statusMap: Record<string, number> = {};
  statusCounts.forEach((item: any) => {
    statusMap[item._id] = item.count;
  });

  const statusResult: Record<string, number> = {};
  statusList.forEach((status) => {
    statusResult[status] = statusMap[status] || 0;
  });

  const totalOrders = Object.keys(matchQuery).length
    ? await Order.countDocuments(matchQuery)
    : await Order.estimatedDocumentCount();

  // Count months wise orders and list monthly orders
  // We'll aggregate by month using $group and $dateToString to extract month and year
  const monthlyOrders = await Order.aggregate([
    ...(Object.keys(matchQuery).length ? [{ $match: matchQuery }] : []),
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        count: { $sum: 1 },
        orders: { $push: "$$ROOT" },
      },
    },
    {
      $sort: { "_id": 1 }
    }
  ]);

  // Format results as array of { month: "YYYY-MM", count, monthName }
  const months = monthlyOrders.map(m => {
    // m._id is 'YYYY-MM'
    const [year, month] = m._id.split("-");
    // Use JavaScript Date to get month name
    const dateTmp = new Date(Number(year), Number(month) - 1, 1);
    const monthName = dateTmp.toLocaleString('default', { month: 'long' });
    return {
      month: m._id,
      monthName: monthName,
      count: m.count,
    };
  });


  // Calculate count for today, this week, this month, and this year

  // Get today's date at midnight
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(todayStart.getDate() - todayStart.getDay()); // Sunday as first day of the week
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  // Only count "delivered" orders in these summary stats
  const deliveredMatch = { ...matchQuery, orderStatus: "delivered" };

  const todayCount = await Order.countDocuments({
    ...deliveredMatch,
    createdAt: { $gte: todayStart }
  });

  const thisWeekCount = await Order.countDocuments({
    ...deliveredMatch,
    createdAt: { $gte: weekStart }
  });

  const thisMonthCount = await Order.countDocuments({
    ...deliveredMatch,
    createdAt: { $gte: monthStart }
  });

  const thisYearCount = await Order.countDocuments({
    ...deliveredMatch,
    createdAt: { $gte: yearStart }
  });

  return {
    status_counts: {
      ...statusResult,
      allOrders: totalOrders,
    },
    monthly_orders: months,
    summary: {
      today: todayCount,
      thisWeek: thisWeekCount,
      thisMonth: thisMonthCount,
      thisYear: thisYearCount
    }
  };
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
    bookingDate: order.bookingDate,
    bookingTime: order.bookingTime,

    // product keys (array now)
    products: order.products,

    // bakery/vendor keys
    vendorId: String(order.vendorId),
    vendorName: order.vendorName,
    vendorEmail: order.vendorEmail,
    vendorPhoneNumber: order.vendorPhoneNumber,
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
