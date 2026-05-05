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
  riderStatus: string;
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
    riderStatus: dto.riderStatus,
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
  riderStatus: string;
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
  if (dto.riderStatus) rider.riderStatus = dto.riderStatus;

  await rider.save();
  const updatedRider = await Riders.findById(id).populate("riderId", "name email phoneNumber");
  if (!updatedRider) throw new HttpError(404, "Rider not found");
  return sanitizeRider(updatedRider);
}

export async function getAllRiders() {
  const riders = await Riders.find().populate("riderId", "name email phoneNumber");
  if (!riders || riders.length === 0) throw new HttpError(404, "No riders found");
  return riders.map(sanitizeRider);
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