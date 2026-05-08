import { HttpError } from "../../utils/httpError";
import { User } from "../auth/user.model";
import Vendors from "./vendor.model";

export async function createVendor(vendorId: string,
dto: { 
    vendorDesignation?: string;
    vendorCnicNumber?: string;
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
    status?: string
}) {
  const exists = await Vendors.findOne({ 
    $or: [
        { vendorId: vendorId }
    ],
  });
  if (exists) throw new HttpError(409, `Vendor already exists for this vendor id.`);

  const vendor = await Vendors.create({
    vendorId: vendorId,
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
  });

  return sanitizeVendor(vendor);
}

export async function getAllVendors(
  isApproved?: boolean,
  page?: number,
  limit?: number
) {
  // Set default values only if not provided by api/client
  const resolvedPage = page && page > 0 ? page : 1;
  const resolvedLimit = limit && limit > 0 ? limit : 10; // Default limit 10

  // Calculate skip for pagination
  const skip = (resolvedPage - 1) * resolvedLimit;

  // Filter for Vendors based on isApproved status (against the joined User doc)
  // We'll collect vendorIds of Users with the correct isApproved if filter applied
  let vendorIdFilter: any = {};
  if (isApproved !== undefined) {
    // Find user IDs that match isApproved, then fetch vendors for those
    const users = await User.find({ isApproved }).select("_id").lean();
    const allowedVendorIds = users.map(u => u._id);
    if (!allowedVendorIds.length) {
      throw new HttpError(404, "No vendors found");
    }
    vendorIdFilter.vendorId = { $in: allowedVendorIds };
  }

  // Build the populate object
  const populate = {
    path: "vendorId",
    select: "name email phoneNumber isApproved",
  };

  // Find vendors and sort by creation (latest first)
  let vendors = await Vendors.find(vendorIdFilter)
    .populate(populate)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(resolvedLimit);

  // Filter out vendors if populated user field missing
  vendors = vendors.filter(v => v.vendorId);

  if (!vendors || vendors.length === 0) throw new HttpError(404, "No vendors found");

  // Get the total count for pagination
  const totalVendors = await Vendors.countDocuments(vendorIdFilter);

  return {
    data: vendors.map(sanitizeVendor),
    pagination: {
      page: resolvedPage,
      limit: resolvedLimit,
      total: totalVendors,
      totalPages: Math.ceil(totalVendors / resolvedLimit)
    }
  };
}

export async function getSingleVendor(id: string) {
  const vendor = await Vendors.findById(id).populate("vendorId", "name email phoneNumber isApproved");
  if (!vendor) throw new HttpError(404, "Vendor not found");
  return sanitizeVendor(vendor);
}

export async function updateVendor(id: string, 
dto: { 
  vendorName?: string;
  vendorDesignation?: string;
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
  status?: string 
}) {
  const vendor = await Vendors.findById(id);
  if (!vendor) throw new HttpError(404, "Vendor not found");

  if (dto.vendorName) {
    await User.findByIdAndUpdate(vendor.vendorId, { name: dto.vendorName });
  }

  if (dto.vendorDesignation) vendor.vendorDesignation = dto.vendorDesignation;
  if (dto.bakeryImage) vendor.bakeryImage = dto.bakeryImage;
  if (dto.bakeryName) vendor.bakeryName = dto.bakeryName;
  if (dto.bakeryAddress) vendor.bakeryAddress = dto.bakeryAddress;
  if (dto.bakeryLatitude) vendor.bakeryLatitude = dto.bakeryLatitude;
  if (dto.bakeryLongitude) vendor.bakeryLongitude = dto.bakeryLongitude;
  if (dto.openingTime) vendor.openingTime = dto.openingTime;
  if (dto.closingTime) vendor.closingTime = dto.closingTime;
  if (dto.bakeryType) vendor.bakeryType = dto.bakeryType;
  if (dto.preOrder) vendor.preOrder = dto.preOrder;
  if (dto.status) vendor.status = dto.status;

  await vendor.save();
  const updatedVendor = await Vendors.findById(id).populate("vendorId", "name email phoneNumber");
  if (!updatedVendor) throw new HttpError(404, "Vendor not found");
  return sanitizeVendor(updatedVendor);
}

export async function deleteVendor(vendorId: string) {
  await Vendors.findByIdAndDelete(vendorId);
  return true;
}

function sanitizeVendor(user: any) {
  const vendorUser = user.vendorId && typeof user.vendorId === "object"
    ? user.vendorId
    : null;

  return {
    id: String(user._id),
    vendorId: vendorUser ? String(vendorUser._id) : String(user.vendorId),
    vendorName: vendorUser?.name,
    vendorEmail: vendorUser?.email,
    vendorMobileNo: vendorUser?.phoneNumber,
    vendorDesignation: user.vendorDesignation,
    vendorCnicNumber: user.vendorCnicNumber,
    vendorIsApproved: vendorUser?.isApproved,
    bakeryImage: user.bakeryImage,
    bakeryName: user.bakeryName,
    bakeryAddress: user.bakeryAddress,
    bakeryLatitude: user.bakeryLatitude,
    bakeryLongitude: user.bakeryLongitude,
    openingTime: user.openingTime,
    closingTime: user.closingTime,
    bakeryType: user.bakeryType,
    preOrder: user.preOrder,
    deliveryTime: user.deliveryTime,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    status: user.status,
  };
}
