import { HttpError } from "../../utils/httpError";
import { User } from "../auth/user.model";
import Vendors from "./vendor.model";
import BankDetail from "../bankDetail/bankDetail.model";

export async function createVendor(
  vendorId: string,
  dto: { 
    vendorDesignation?: string;
    vendorCnicNumber?: string;
    vendorCnicFrontImage?: string;
    vendorCnicBackImage?: string;
    bakeryLogo?: string;
    bakeryImage?: string;
    bakeryName?: string;
    bakeryAddress?: string;
    bakeryLatitude?: string;
    bakeryLongitude?: string;
    city?: string;
    area?: string;
    ntnNumber?: string;
    ntnImage?: string;
    foodLicenseImage?: string;
    openingTime?: string;
    closingTime?: string;
    bakeryType?: string;
    preOrder?: string;
    deliveryTime?: string;
    isOnline?: string;
    kitchenImages?: string[];
    approvalStatus?: string;
    rejectReason?: string;
  }
) {
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
    vendorCnicFrontImage: dto.vendorCnicFrontImage,
    vendorCnicBackImage: dto.vendorCnicBackImage,
    bakeryLogo: dto.bakeryLogo,
    bakeryImage: dto.bakeryImage,
    bakeryName: dto.bakeryName,
    bakeryAddress: dto.bakeryAddress,
    bakeryLatitude: dto.bakeryLatitude,
    bakeryLongitude: dto.bakeryLongitude,
    city: dto.city,
    area: dto.area,
    ntnNumber: dto.ntnNumber,
    ntnImage: dto.ntnImage,
    foodLicenseImage: dto.foodLicenseImage,
    openingTime: dto.openingTime,
    closingTime: dto.closingTime,
    bakeryType: dto.bakeryType,
    preOrder: dto.preOrder,
    deliveryTime: dto.deliveryTime,
    isOnline: dto.isOnline,
    kitchenImages: dto.kitchenImages,
  });

  // Update the corresponding user's isProfileComplete to true using vendorId
  await User.updateOne(
    { _id: vendorId },
    { $set: { isProfileComplete: true } }
  );

  return sanitizeVendor(vendor);
}

export async function updateVendor(id: string, 
dto: { 
  vendorName?: string;
  vendorDesignation?: string;
  vendorCnicNumber?: string;
  vendorCnicFrontImage?: string;
  vendorCnicBackImage?: string;
  bakeryLogo?: string;
  bakeryImage?: string;
  bakeryName?: string;
  bakeryAddress?: string;
  bakeryLatitude?: string;
  bakeryLongitude?: string;
  city?: string;
  area?: string;
  ntnNumber?: string;
  ntnImage?: string;
  foodLicenseImage?: string;
  openingTime?: string;
  closingTime?: string;
  bakeryType?: string;
  preOrder?: string;
  deliveryTime?: string;
  isOnline?: string;
  kitchenImages?: string[];
  approvalStatus?: string;
  rejectReason?: string;
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
  if (dto.isOnline) vendor.isOnline = dto.isOnline;
  if (dto.approvalStatus) vendor.approvalStatus = dto.approvalStatus;
  if (dto.rejectReason) vendor.rejectReason = dto.rejectReason;
  if (dto.vendorCnicNumber) vendor.vendorCnicNumber = dto.vendorCnicNumber;
  if (dto.vendorCnicFrontImage) vendor.vendorCnicFrontImage = dto.vendorCnicFrontImage;
  if (dto.vendorCnicBackImage) vendor.vendorCnicBackImage = dto.vendorCnicBackImage;
  if (dto.bakeryLogo) vendor.bakeryLogo = dto.bakeryLogo;
  if (dto.city) vendor.city = dto.city;
  if (dto.area) vendor.area = dto.area;
  if (dto.ntnNumber) vendor.ntnNumber = dto.ntnNumber;
  if (dto.ntnImage) vendor.ntnImage = dto.ntnImage;
  if (dto.foodLicenseImage) vendor.foodLicenseImage = dto.foodLicenseImage;
  if (dto.deliveryTime) vendor.deliveryTime = dto.deliveryTime;
  if (dto.approvalStatus) vendor.approvalStatus = dto.approvalStatus;
  if (dto.rejectReason) vendor.rejectReason = dto.rejectReason;

  await vendor.save();
  const updatedVendor = await Vendors.findById(id).populate("vendorId", "name email phoneNumber");
  if (!updatedVendor) throw new HttpError(404, "Vendor not found");
  return sanitizeVendor(updatedVendor);
}

export async function getAllVendors(
  approvalStatus?: string,
  page?: number,
  limit?: number
) {
  // Set default values only if not provided by api/client
  const resolvedPage = page && page > 0 ? page : 1;
  const resolvedLimit = limit && limit > 0 ? limit : 10; // Default limit 10

  // Calculate skip for pagination
  const skip = (resolvedPage - 1) * resolvedLimit;

  // Custom filter logic for "reject": show both 'reject' and 'blocked' vendors
  let vendorFilter: any = {};
  if (approvalStatus && approvalStatus !== "") {
    if (approvalStatus === "reject" || approvalStatus === "blocked") {
      vendorFilter.approvalStatus = { $in: ["reject", "blocked"] };
    } else {
      vendorFilter.approvalStatus = approvalStatus;
    }
  }

  // Build the populate object
  const populate = {
    path: "vendorId",
    select: "name email phoneNumber isApproved",
  };

  // Find vendors by status if provided, otherwise fetch all. Sort by latest.
  let vendors = await Vendors.find(vendorFilter)
    .populate(populate)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(resolvedLimit);

  // Filter out vendors if populated user field missing
  vendors = vendors.filter(v => v.vendorId);

  if (!vendors || vendors.length === 0) throw new HttpError(404, "No vendors found");

  // Get the total count for pagination, filtered by approvalStatus if provided
  // Fix: Only count vendors that actually have a populated vendorId (consistent with what is returned above)
  // Otherwise total may include deleted users' vendors not returned in `data`
  // So, fetch all vendors with current filter and populated vendorId and use that length as total
  const allVendorsWithUser = await Vendors.find(vendorFilter)
    .populate(populate)
    .then(list => list.filter(v => v.vendorId));
  const totalVendors = allVendorsWithUser.length;

  // Fetch bank details for these vendors (bankDetail.userId === vendor.vendorId)
  const vendorUserIds = vendors
    .map((v: any) => (v.vendorId && typeof v.vendorId === "object" ? v.vendorId._id : v.vendorId))
    .filter(Boolean);

  const bankDetails = await BankDetail.find({ userId: { $in: vendorUserIds } }).lean();
  const bankDetailMap = new Map<string, any[]>();
  bankDetails.forEach((bd: any) => {
    const key = String(bd.userId);
    const list = bankDetailMap.get(key) || [];
    list.push(bd);
    bankDetailMap.set(key, list);
  });

  return {
    data: vendors.map((v: any) => {
      const key = String(v.vendorId && typeof v.vendorId === "object" ? v.vendorId._id : v.vendorId);
      return sanitizeVendor(v, bankDetailMap.get(key) || []);
    }),
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
  const vendorUserId =
    vendor.vendorId && typeof vendor.vendorId === "object" ? (vendor.vendorId as any)._id : vendor.vendorId;
  const bankDetails = vendorUserId ? await BankDetail.find({ userId: vendorUserId }).lean() : [];
  return sanitizeVendor(vendor, bankDetails || []);
}

export async function deleteVendor(vendorId: string) {
  await Vendors.findByIdAndDelete(vendorId);
  return true;
}

function sanitizeVendor(user: any, bankDetails?: any[] | null) {
  const vendorUser = user.vendorId && typeof user.vendorId === "object"
    ? user.vendorId
    : null;

  return {
    id: String(user._id),
    vendorId: vendorUser ? String(vendorUser._id) : String(user.vendorId),
    vendorName: vendorUser?.name,
    vendorEmail: vendorUser?.email,
    vendorMobileNo: vendorUser?.phoneNumber,
    vendorIsApproved: vendorUser?.isApproved,
    vendorDesignation: user.vendorDesignation,
    vendorCnicNumber: user.vendorCnicNumber,
    vendorCnicFrontImage: user.vendorCnicFrontImage,
    vendorCnicBackImage: user.vendorCnicBackImage,
    bakeryLogo: user.bakeryLogo,
    city: user.city,
    area: user.area, 
    ntnNumber: user.ntnNumber,
    ntnImage: user.ntnImage,
    foodLicenseImage: user.foodLicenseImage,
    kitchenImages: user.kitchenImages,
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
    isOnline: user.isOnline,
    approvalStatus: user.approvalStatus,
    rejectReason: user.rejectReason,
    bankDetails: Array.isArray(bankDetails)
      ? bankDetails.map((bankDetail: any) => ({
          id: String(bankDetail._id),
          userId: String(bankDetail.userId),
          accountNumber: bankDetail.accountNumber,
          ibanNumber: bankDetail.ibanNumber,
          bankName: bankDetail.bankName,
          branchName: bankDetail.branchName,
          isPrimary: bankDetail.isPrimary,
          accountHolderName: bankDetail.accountHolderName,
        }))
      : [],
  };
}
