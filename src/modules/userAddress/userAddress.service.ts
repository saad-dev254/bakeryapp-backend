import { HttpError } from "../../utils/httpError";
import UserAddress from "./userAddress.model";

export async function createUserAddress(userId: string, dto: { address?: string; latitude?: string; longitude?: string }) {
  const addresses = await UserAddress.create({
    userId: userId,
    address: dto.address,
    latitude: dto.latitude,
    longitude: dto.longitude,
  });

  return sanitizeUserAddress(addresses);
}

export async function getAllUserAddresses(userId?: string | null) {
  let addresses;
  if (userId) {
    addresses = await UserAddress.find({ userId });
  } else {
    addresses = await UserAddress.find();
  }
  if (!addresses || addresses.length === 0) throw new HttpError(404, "No addresses found.");
  return addresses.map(sanitizeUserAddress);
}

export async function getSingleUserAddress(id: string) {
  const addresses = await UserAddress.findById(id);
  if (!addresses) throw new HttpError(404, "Address not found");
  return sanitizeUserAddress(addresses);
}

export async function updateUserAddress(id: string, dto: { address?: string; latitude?: string; longitude?: string }) {
  const address = await UserAddress.findById(id);
  if (!address) throw new HttpError(404, "Address not found");

  if (dto.address) address.address = dto.address;
  if (dto.latitude) address.latitude = dto.latitude;
  if (dto.longitude) address.longitude = dto.longitude;

  await address.save();
  return sanitizeUserAddress(address);
}

export async function deleteUserAddress(id: string) {
  await UserAddress.findByIdAndDelete(id);
  return true;
}

function sanitizeUserAddress(address: any) {
  return {
    id: String(address._id),
    userId: String(address.userId),
    address: address.address,
    latitude: address.latitude,
    longitude: address.longitude,
  };
}
