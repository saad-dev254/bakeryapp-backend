import { HttpError } from "../../utils/httpError";
import Settings from "./settings.model";

export async function createSettings(
dto: {
  deliveryCharges?: string;
  radiusInKM?: string;
}) {
  const settings = await Settings.create({
    deliveryCharges: dto.deliveryCharges,
    radiusInKM: dto.radiusInKM,
  });
  
  return sanitizeSettings(settings);
}

export async function updateSetting(id: string,
dto: {
  deliveryCharges?: string;
  radiusInKM?: string
}) {
  const settings = await Settings.findById(id);
  if (!settings) throw new HttpError(404, "Settings not found");

  if (dto.deliveryCharges) settings.deliveryCharges = dto.deliveryCharges;
  if (dto.radiusInKM) settings.radiusInKM = dto.radiusInKM;

  await settings.save();
  return sanitizeSettings(settings);
}

export async function getAllSettings() {
  let settings = await Settings.find();
  if (!settings || settings.length === 0) throw new HttpError(404, "No Settings found.");
  return settings.map(sanitizeSettings);
}

export async function getSingleASetting(id: string) {
  const settings = await Settings.findById(id);
  if (!settings) throw new HttpError(404, "Setting not found");
  return sanitizeSettings(settings);
}

export async function deleteSetting(id: string) {
  await Settings.findByIdAndDelete(id);
  return true;
}

function sanitizeSettings(adOn: any) {
  return {
    id: String(adOn._id),
    deliveryCharges: adOn.deliveryCharges,
    radiusInKM: adOn.radiusInKM,
  };
}
