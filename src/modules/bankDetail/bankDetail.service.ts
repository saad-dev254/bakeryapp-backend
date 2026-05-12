import { HttpError } from "../../utils/httpError";
import BankDetail from "./bankDetail.model";

export async function createBankDetail(
  userId: string,
  dto: {
    accountNumber?: string;
    ibanNumber?: string;
    bankName?: string;
    accountHolderName?: string;
    branchName?: string;
    isPrimary?: boolean;
  }
) {
  // If this account is being created as primary, set all other user's accounts to not primary
  if (dto.isPrimary === true) {
    await BankDetail.updateMany(
      { userId: userId, isPrimary: true },
      { $set: { isPrimary: false } }
    );
  }

  // If isPrimary is not supplied or is false, we need to check if user already has a primary, otherwise force this to primary to ensure at least one primary per user
  let actualIsPrimary = dto.isPrimary;
  if (dto.isPrimary !== true) {
    // Check if there's a primary account already for the user
    const existingPrimary = await BankDetail.findOne({
      userId: userId,
      isPrimary: true,
    });
    // If no other primary exists, force this to primary
    if (!existingPrimary) {
      actualIsPrimary = true;
    }
  }

  const bankDetail = await BankDetail.create({
    userId: userId,
    accountNumber: dto.accountNumber,
    ibanNumber: dto.ibanNumber,
    bankName: dto.bankName,
    accountHolderName: dto.accountHolderName,
    branchName: dto.branchName,
    isPrimary: actualIsPrimary,
  });

  return sanitizeBankDetail(bankDetail);
}

export async function updateBankDetail(
  id: string,
  dto: {
    accountNumber?: string;
    ibanNumber?: string;
    bankName?: string;
    accountHolderName?: string;
    branchName?: string;
    isPrimary?: boolean;
  }
) {
  const bankDetail = await BankDetail.findById(id);
  if (!bankDetail) throw new HttpError(404, "Bank Detail not found");

  if (dto.accountNumber) bankDetail.accountNumber = dto.accountNumber;
  if (dto.ibanNumber) bankDetail.ibanNumber = dto.ibanNumber;
  if (dto.bankName) bankDetail.bankName = dto.bankName;
  if (dto.accountHolderName) bankDetail.accountHolderName = dto.accountHolderName;
  if (dto.branchName) bankDetail.branchName = dto.branchName;

  // Ensure at least one bank account remains primary
  if (dto.isPrimary !== undefined) {
    if (dto.isPrimary === true) {
      // If this is being set to primary, set all other bank accounts for the user to isPrimary = false
      await BankDetail.updateMany(
        { userId: bankDetail.userId, _id: { $ne: id }, isPrimary: true },
        { $set: { isPrimary: false } }
      );
      bankDetail.isPrimary = true;
    } else if (dto.isPrimary === false) {
      // If this is being set to not primary, check if at least one other primary bank account remains
      const otherPrimaryBank = await BankDetail.findOne({
        userId: bankDetail.userId,
        _id: { $ne: id },
        isPrimary: true,
      });

      if (!otherPrimaryBank) {
        // If this is the only primary bank, prevent removal of last primary
        throw new HttpError(
          400,
          "At least one bank account must be primary. Cannot unset isPrimary."
        );
      }
      bankDetail.isPrimary = false;
    }
  }

  await bankDetail.save();
  return sanitizeBankDetail(bankDetail);
}

export async function getAllBankDetails(userId?: string | null) {
  let bankDetail;
  if (userId) {
    bankDetail = await BankDetail.find({ userId }).populate("userId", "name email phoneNumber role");
  } else {
    bankDetail = await BankDetail.find().populate("userId", "name email phoneNumber role");
  }
  if (!bankDetail || bankDetail.length === 0) throw new HttpError(404, "No Bank Detail found.");
  return bankDetail.map(sanitizeBankDetail);
}

export async function getSingleBankDetail(id: string) {
  const bankDetail = await BankDetail.findById(id);
  if (!bankDetail) throw new HttpError(404, "Bank Detail not found");
  return sanitizeBankDetail(bankDetail);
}

export async function deleteBankDetail(id: string) {
  await BankDetail.findByIdAndDelete(id);
  return true;
}

function sanitizeBankDetail(bankDetail: any) {
  const bankUser = bankDetail.userId && typeof bankDetail.userId === "object"
    ? bankDetail.userId
    : null;

  return {
    id: String(bankDetail._id),
    userId: bankUser ? String(bankUser._id) : String(bankDetail.userId),
    userName: bankUser?.name,
    userEmail: bankUser?.email,
    userMobileNo: bankUser?.phoneNumber,
    userRole: bankUser?.role,
    accountNumber: bankDetail.accountNumber,
    ibanNumber: bankDetail.ibanNumber,
    bankName: bankDetail.bankName,
    accountHolderName: bankDetail.accountHolderName,
    branchName: bankDetail.branchName,
    isPrimary: bankDetail.isPrimary,
  };
}
