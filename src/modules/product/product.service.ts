import mongoose, { Types } from "mongoose";
import { HttpError } from "../../utils/httpError";
import Products from "./product.model";

function stringIdsToObjectIds(ids?: string[]): Types.ObjectId[] | undefined {
  if (ids === undefined) return undefined;
  return ids.map((id) => new mongoose.Types.ObjectId(id));
}

export async function createProduct(vendorId: string,
dto: { 
  productName?: string;
  productImage?: string;
  productDescription?: string;
  productPrice?: string;
  discountAmount?: string;
  discountType?: string;
  categoryId?: any;
  addOnIds?: string[];
}) {
  const product = await Products.create({
    vendorId: vendorId,
    productName: dto.productName,
    productImage: dto.productImage,
    productDescription: dto.productDescription,
    productPrice: dto.productPrice,
    discountAmount: dto.discountAmount,
    discountType: dto.discountType,
    categoryId: dto.categoryId,
    addOnIds: stringIdsToObjectIds(dto.addOnIds),
  });

  return sanitizeProduct(product);
}

export async function getAllProducts(vendorId: string) {
  const products = await Products.find({ vendorId });
  if (!products || products.length === 0) throw new HttpError(404, "No products found for this vendor");
  return products.map(sanitizeProduct);
}

export async function getSingleProduct(id: string) {
  const product = await Products.findById(id);
  if (!product) throw new HttpError(404, "Product not found");
  return sanitizeProduct(product);
}

export async function updateProduct(id: string, 
dto: { 
    productName?: string;
    productImage?: string;
    productDescription?: string;
    productPrice?: string;
    discountAmount?: string;
    discountType?: string;
    categoryId?: any;
    addOnIds?: string[];
}) {
  const product = await Products.findById(id);
  if (!product) throw new HttpError(404, "Product not found");

  if (dto.productName) product.productName = dto.productName;
  if (dto.productImage) product.productImage = dto.productImage;
  if (dto.productDescription) product.productDescription = dto.productDescription;
  if (dto.productPrice) product.productPrice = dto.productPrice;
  if (dto.discountAmount) product.discountAmount = dto.discountAmount;
  if (dto.discountType) product.discountType = dto.discountType;
  if (dto.categoryId) product.categoryId = dto.categoryId;
  if (dto.addOnIds !== undefined) product.addOnIds = stringIdsToObjectIds(dto.addOnIds);

  await product.save();
  return sanitizeProduct(product);
}

export async function deleteProduct(id: string) {
  await Products.findByIdAndDelete(id);
  return true;
}

function sanitizeProduct(product: any) {
  return {
    id: String(product._id),
    vendorId: String(product.vendorId),
    productImage: product.productImage,
    productDescription: product.productDescription,
    productPrice: product.productPrice,
    discountAmount: product.discountAmount,
    discountType: product.discountType,
    categoryId: product.categoryId,
    addOnIds: product.addOnIds?.map((id: Types.ObjectId) => String(id)),
  };
}
