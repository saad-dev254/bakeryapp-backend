import { HttpError } from "../../utils/httpError";
import { User } from "../auth/user.model";
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
  bikeRegistrationCard?: string;
  riderSelfie?: string;
  policeCharacterCertificate?: string;
  bikeModel?: string;
  bikeRegistrationNumber?: string;
  bikeNumberPlateImage?: string;
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
    bikeRegistrationCard: dto.bikeRegistrationCard,
    riderSelfie: dto.riderSelfie,
    policeCharacterCertificate: dto.policeCharacterCertificate,
    bikeModel: dto.bikeModel,
    bikeRegistrationNumber: dto.bikeRegistrationNumber,
    bikeNumberPlateImage: dto.bikeNumberPlateImage,
    vehicleType: dto.vehicleType,
    fuelType: dto.fuelType,
    isOnline: dto.isOnline,
    approvalStatus: dto.approvalStatus,
    rejectReason: dto.rejectReason
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
  bikeRegistrationCard?: string;
  riderSelfie?: string;
  policeCharacterCertificate?: string;
  bikeModel?: string;
  bikeRegistrationNumber?: string;
  bikeNumberPlateImage?: string;
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
  if (dto.bikeRegistrationCard) rider.bikeRegistrationCard = dto.bikeRegistrationCard;
  if (dto.riderSelfie) rider.riderSelfie = dto.riderSelfie;
  if (dto.policeCharacterCertificate) rider.policeCharacterCertificate = dto.policeCharacterCertificate;
  if (dto.bikeModel) rider.bikeModel = dto.bikeModel;
  if (dto.bikeRegistrationNumber) rider.bikeRegistrationNumber = dto.bikeRegistrationNumber;
  if (dto.bikeNumberPlateImage) rider.bikeNumberPlateImage = dto.bikeNumberPlateImage;
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
  isApproved?: boolean,
  page?: number,
  limit?: number
) {
  // Default values for page & limit
  const resolvedPage = page && page > 0 ? page : 1;
  const resolvedLimit = limit && limit > 0 ? limit : 10;

  // Calculate skip for pagination
  const skip = (resolvedPage - 1) * resolvedLimit;

  // Filter for Riders based on isApproved status in User (joined doc)
  let riderIdFilter: any = {};
  if (isApproved !== undefined) {
    // Find users with isApproved and get their IDs for filter
    const users = await User.find({ isApproved }).select("_id").lean();
    const allowedRiderIds = users.map(u => u._id);
    if (!allowedRiderIds.length) {
      throw new HttpError(404, "No riders found");
    }
    riderIdFilter.riderId = { $in: allowedRiderIds };
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

  return {
    data: riders.map(sanitizeRider),
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
  return sanitizeRider(rider);
}

export async function deleteRider(riderId: string) {
  await Riders.findByIdAndDelete(riderId);
  return true;
}

function sanitizeRider(user: any) {
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
    riderStatus: user.riderStatus,
  };
}