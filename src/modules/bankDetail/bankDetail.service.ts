import { HttpError } from "../../utils/httpError";
import BankDetail from "./bankDetail.model";

export async function createBankDetail(userId: string, 
dto: { 
  accountNumber?: string;
  ibanNumber?: string;
  bankName?: string;
  accountHolderName?: string;
}) {
  const bankDetail = await BankDetail.create({
    userId: userId,
    accountNumber: dto.accountNumber,
    ibanNumber: dto.ibanNumber,
    bankName: dto.bankName,
    accountHolderName: dto.accountHolderName,
  });

  return sanitizeBankDetail(bankDetail);
}

export async function updateBankDetail(id: string, 
dto: { 
  accountNumber?: string;
  ibanNumber?: string;
  bankName?: string;
  accountHolderName?: string;
}) {
  const bankDetail = await BankDetail.findById(id);
  if (!bankDetail) throw new HttpError(404, "Bank Detail not found");

  if (dto.accountNumber) bankDetail.accountNumber = dto.accountNumber;
  if (dto.ibanNumber) bankDetail.ibanNumber = dto.ibanNumber;
  if (dto.bankName) bankDetail.bankName = dto.bankName;
  if (dto.accountHolderName) bankDetail.accountHolderName = dto.accountHolderName;

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
  };
}
