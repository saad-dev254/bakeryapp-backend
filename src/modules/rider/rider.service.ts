import { HttpError } from "../../utils/httpError";
import { User } from "../auth/user.model";
import BankDetail from "../bankDetail/bankDetail.model";
import Riders from "./rider.model";

export async function createRider(riderId: string,
dto: { 
  riderCnicNumber?: string;
  riderImage?: string;
  riderCnicFrontImage?: string;
  riderCnicBackImage?: string;
  riderAddress?: string;
  riderLatitude?: number;
  riderLongitude?: number;
  riderDOB?: string;
  drivingLicense?: string;
  vehicleRegistrationCard?: string;
  riderSelfie?: string;
  policeCharacterCertificate?: string;
  vehicleModel?: string;
  vehicleRegistrationNumber?: string;
  vehicleNumberPlateImage?: string;
  vehicleType?: string;
  fuelType?: string;
  isOnline?: string;
  approvalStatus?: string;
  rejectReason?: string;
}) {
  const exists = await Riders.findOne({ 
    $or: [
      { riderId: riderId }
    ],
  });
  if (exists) throw new HttpError(409, `Rider already exists for this rider id.`);

  const rider = await Riders.create({
    riderId: riderId,
    riderCnicNumber: dto.riderCnicNumber,
    riderImage: dto.riderImage,
    riderCnicFrontImage: dto.riderCnicFrontImage,
    riderCnicBackImage: dto.riderCnicBackImage,
    riderAddress: dto.riderAddress,
    riderLatitude: dto.riderLatitude,
    riderLongitude: dto.riderLongitude,
    riderDOB: dto.riderDOB,
    drivingLicense: dto.drivingLicense,
    vehicleRegistrationCard: dto.vehicleRegistrationCard,
    riderSelfie: dto.riderSelfie,
    policeCharacterCertificate: dto.policeCharacterCertificate,
    vehicleModel: dto.vehicleModel,
    vehicleRegistrationNumber: dto.vehicleRegistrationNumber,
    vehicleNumberPlateImage: dto.vehicleNumberPlateImage,
    vehicleType: dto.vehicleType,
    fuelType: dto.fuelType,
    isOnline: dto.isOnline,
    approvalStatus: "pending",
    rejectReason: "",
  });

  return sanitizeRider(rider);
}

export async function updateRider(id: string,
dto: {
  riderName?: string;
  riderImage?: string;
  riderAddress?: string;
  riderLatitude?: number;
  riderLongitude?: number;
  isOnline?: string;
  riderDOB?: string;
  drivingLicense?: string;
  vehicleRegistrationCard?: string;
  riderSelfie?: string;
  policeCharacterCertificate?: string;
  vehicleModel?: string;
  vehicleRegistrationNumber?: string;
  vehicleNumberPlateImage?: string;
  vehicleType?: string;
  fuelType?: string;
  approvalStatus?: string;
  rejectReason?: string;
}) {
  const rider = await Riders.findById(id);
  if (!rider) throw new HttpError(404, "Rider not found");

  if (dto.riderName) {
    await User.findByIdAndUpdate(rider.riderId, { name: dto.riderName });
  }

  if (dto.riderImage) rider.riderImage = dto.riderImage;
  if (dto.riderAddress) rider.riderAddress = dto.riderAddress;
  if (dto.riderLatitude) rider.riderLatitude = dto.riderLatitude;
  if (dto.riderLongitude) rider.riderLongitude = dto.riderLongitude;
  if (dto.isOnline) rider.isOnline = dto.isOnline;
  if (dto.riderDOB) rider.riderDOB = dto.riderDOB;
  if (dto.drivingLicense) rider.drivingLicense = dto.drivingLicense;
  if (dto.vehicleRegistrationCard) rider.vehicleRegistrationCard = dto.vehicleRegistrationCard;
  if (dto.riderSelfie) rider.riderSelfie = dto.riderSelfie;
  if (dto.policeCharacterCertificate) rider.policeCharacterCertificate = dto.policeCharacterCertificate;
  if (dto.vehicleModel) rider.vehicleModel = dto.vehicleModel;
  if (dto.vehicleRegistrationNumber) rider.vehicleRegistrationNumber = dto.vehicleRegistrationNumber;
  if (dto.vehicleNumberPlateImage) rider.vehicleNumberPlateImage = dto.vehicleNumberPlateImage;
  if (dto.vehicleType) rider.vehicleType = dto.vehicleType;
  if (dto.fuelType) rider.fuelType = dto.fuelType;
  if (dto.approvalStatus) rider.approvalStatus = dto.approvalStatus;
  if (dto.rejectReason) rider.rejectReason = dto.rejectReason;

  await rider.save();
  const updatedRider = await Riders.findById(id).populate("riderId", "name email phoneNumber");
  if (!updatedRider) throw new HttpError(404, "Rider not found");
  return sanitizeRider(updatedRider);
}

export async function getAllRiders(
  approvalStatus?: string,
  page?: number,
  limit?: number
) {
  // Default values for page & limit
  const resolvedPage = page && page > 0 ? page : 1;
  const resolvedLimit = limit && limit > 0 ? limit : 10;

  // Calculate skip for pagination
  const skip = (resolvedPage - 1) * resolvedLimit;

  // Custom filter logic for "reject": show both 'reject' and 'blocked' riders
  let riderIdFilter: any = {};
  if (approvalStatus && approvalStatus !== "") {
    if (approvalStatus === "reject") {
      riderIdFilter.approvalStatus = { $in: ["reject", "blocked"] };
    } else {
      riderIdFilter.approvalStatus = approvalStatus;
    }
  }

  // Build the populate object
  const populate = {
    path: "riderId",
    select: "name email phoneNumber isApproved",
  };

  // Find riders with pagination and population
  let riders = await Riders.find(riderIdFilter)
    .populate(populate)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(resolvedLimit);

  // Filter out riders without populated user field
  riders = riders.filter(r => r.riderId);

  if (!riders || riders.length === 0) throw new HttpError(404, "No riders found");

  // Total count for pagination metadata
  const totalRiders = await Riders.countDocuments(riderIdFilter);

  // Fetch bank details for these riders (bankDetail.userId === riders.riderId)
  const riderUserIds = riders
    .map((v: any) => (v.riderId && typeof v.riderId === "object" ? v.riderId._id : v.riderId))
    .filter(Boolean);

  const bankDetails = await BankDetail.find({ userId: { $in: riderUserIds } }).lean();
  const bankDetailMap = new Map<string, any[]>();
  bankDetails.forEach((bd: any) => {
    const key = String(bd.userId);
    const list = bankDetailMap.get(key) || [];
    list.push(bd);
    bankDetailMap.set(key, list);
  });

  return {
    data: riders.map((v: any) => {
      const key = String(v.riderId && typeof v.riderId === "object" ? v.riderId._id : v.riderId);
      return sanitizeRider(v, bankDetailMap.get(key) || []);
    }),
    pagination: {
      page: resolvedPage,
      limit: resolvedLimit,
      total: totalRiders,
      totalPages: Math.ceil(totalRiders / resolvedLimit)
    }
  };
}

export async function getSingleRider(id: string) {
  const rider = await Riders.findById(id).populate("riderId", "name email phoneNumber");
  if (!rider) throw new HttpError(404, "Rider not found");
  const riderUserId =
    rider.riderId && typeof rider.riderId === "object" ? (rider.riderId as any)._id : rider.riderId;
  const bankDetails = riderUserId ? await BankDetail.find({ userId: riderUserId }).lean() : [];
  return sanitizeRider(rider, bankDetails || []);
}

export async function deleteRider(riderId: string) {
  await Riders.findByIdAndDelete(riderId);
  return true;
}

function sanitizeRider(user: any, bankDetails?: any[] | null) {
  const riderUser = user.riderId && typeof user.riderId === "object"
    ? user.riderId
    : null;

  return {
    id: String(user._id),
    riderId: riderUser ? String(riderUser._id) : String(user.riderId),
    riderName: riderUser?.name,
    riderEmail: riderUser?.email,
    riderMobileNo: riderUser?.phoneNumber,
    riderIsApproved: riderUser?.isApproved,
    riderCnicNumber: user.riderCnicNumber,
    riderImage: user.riderImage,
    riderCnicFrontImage: user.riderCnicFrontImage,
    riderCnicBackImage: user.riderCnicBackImage,
    riderAddress: user.riderAddress,
    riderLatitude: user.riderLatitude,
    riderLongitude: user.riderLongitude,
    riderDOB: user.riderDOB,
    drivingLicense: user.drivingLicense,
    riderSelfie: user.riderSelfie,
    policeCharacterCertificate: user.policeCharacterCertificate,
    vehicleModel: user.vehicleModel,
    vehicleRegistrationCard: user.vehicleRegistrationCard,
    vehicleRegistrationNumber: user.vehicleRegistrationNumber,
    vehicleNumberPlateImage: user.vehicleNumberPlateImage,
    vehicleType: user.vehicleType,
    fuelType: user.fuelType,
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