import { HttpError } from "../../utils/httpError";
import AdOn from "./adOns.model";

export async function createAdOn(vendorId: string, dto: { adOnName?: string; adOnPrice?: string }) {
  const adOn = await AdOn.create({
    vendorId: vendorId,
    adOnName: dto.adOnName,
    adOnPrice: dto.adOnPrice,
  });

  return sanitizeAdOn(adOn);
}

export async function getAllAdOn(vendorId?: string | null) {
  let adOn;
  if (vendorId) {
    adOn = await AdOn.find({ vendorId });
  } else {
    adOn = await AdOn.find();
  }
  if (!adOn || adOn.length === 0) throw new HttpError(404, "No AdOn found.");
  return adOn.map(sanitizeAdOn);
}

export async function getSingleAdOn(id: string) {
  const adOn = await AdOn.findById(id);
  if (!adOn) throw new HttpError(404, "AdOn not found");
  return sanitizeAdOn(adOn);
}

export async function updateAdOn(id: string, dto: { adOnName?: string; adOnPrice?: string }) {
  const adOn = await AdOn.findById(id);
  if (!adOn) throw new HttpError(404, "AdOn not found");

  if (dto.adOnName) adOn.adOnName = dto.adOnName;
  if (dto.adOnPrice) adOn.adOnPrice = dto.adOnPrice;

  await adOn.save();
  return sanitizeAdOn(adOn);
}

export async function deleteAdOn(id: string) {
  await AdOn.findByIdAndDelete(id);
  return true;
}

function sanitizeAdOn(adOn: any) {
  return {
    id: String(adOn._id),
    vendorId: String(adOn.vendorId),
    adOnName: adOn.adOnName,
    adOnPrice: adOn.adOnPrice,
  };
}
