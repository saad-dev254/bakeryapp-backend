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

export async function getAllVendors(isApproved?: boolean) {
  // let vendors;
  // if (isApproved) {
  //   vendors = await Vendors.find({ isApproved: isApproved }).populate("vendorId", "name email phoneNumber");
  // } else {
  //   vendors = await Vendors.find().populate("vendorId", "name email phoneNumber");
  // }
  const vendors = await Vendors.find().populate("vendorId", "name email phoneNumber");
  if (!vendors || vendors.length === 0) throw new HttpError(404, "No vendors found");
  return vendors.map(sanitizeVendor);
}

export async function getSingleVendor(id: string) {
  const vendor = await Vendors.findById(id).populate("vendorId", "name email phoneNumber");
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
