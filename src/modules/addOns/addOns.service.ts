import { HttpError } from "../../utils/httpError";
import AddOn from "./addOns.model";

export async function createAddOn(vendorId: string, dto: { addOnName?: string; addOnPrice?: string }) {
  const addOn = await AddOn.create({
    vendorId: vendorId,
    addOnName: dto.addOnName,
    addOnPrice: dto.addOnPrice,
  });

  return sanitizeAddOn(addOn);
}

export async function getAllAddOn(vendorId?: string | null) {
  let addOn;
  if (vendorId) {
    addOn = await AddOn.find({ vendorId });
  } else {
    addOn = await AddOn.find();
  }
  if (!addOn || addOn.length === 0) throw new HttpError(404, "No AddOn found.");
  return addOn.map(sanitizeAddOn);
}

export async function getSingleAddOn(id: string) {
  const addOn = await AddOn.findById(id);
  if (!addOn) throw new HttpError(404, "AddOn not found");
  return sanitizeAddOn(addOn);
}

export async function updateAddOn(id: string, dto: { addOnName?: string; addOnPrice?: string }) {
  const addOn = await AddOn.findById(id);
  if (!addOn) throw new HttpError(404, "AddOn not found");

  if (dto.addOnName) addOn.addOnName = dto.addOnName;
  if (dto.addOnPrice) addOn.addOnPrice = dto.addOnPrice;

  await addOn.save();
  return sanitizeAddOn(addOn);
}

export async function deleteAddOn(id: string) {
  await AddOn.findByIdAndDelete(id);
  return true;
}

function sanitizeAddOn(addOn: any) {
  return {
    id: String(addOn._id),
    vendorId: String(addOn.vendorId),
    addOnName: addOn.addOnName,
    addOnPrice: addOn.addOnPrice,
  };
}
