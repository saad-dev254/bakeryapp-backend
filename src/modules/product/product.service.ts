import { HttpError } from "../../utils/httpError";
import Products from "./product.model";

export async function createProduct(vendorId: string,
dto: {
  productName?: string;
  productImage?: string;
  productDescription?: string;
  productPrice?: string;
  discountAmount?: string;
  discountType?: string;
  categoryId?: any;
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
  });

  return sanitizeProduct(product);
}

export async function getAllProducts(vendorId: string) {
  let products;
  if (vendorId) {
    products = await Products.find({ vendorId })
      .populate("categoryId", "categoryName")
  } else {
    products = await Products.find()
      .populate("categoryId", "categoryName")
  }
  if (!products || products.length === 0) throw new HttpError(404, "No products found for this vendor");
  return products.map(sanitizeProduct);
}

export async function getSingleProduct(id: string) {
  const product = await Products.findById(id)
    .populate("categoryId", "categoryName")
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

  await product.save();
  return sanitizeProduct(product);
}

export async function deleteProduct(id: string) {
  await Products.findByIdAndDelete(id);
  return true;
}

function sanitizeProduct(product: any) {
  const category = product.categoryId && typeof product.categoryId === "object"
    ? {
        id: String(product.categoryId._id),
        categoryName: product.categoryId.categoryName,
      }
    : null;

  return {
    id: String(product._id),
    vendorId: String(product.vendorId),
    productName: product.productName,
    productImage: product.productImage,
    productDescription: product.productDescription,
    productPrice: product.productPrice,
    discountAmount: product.discountAmount,
    discountType: product.discountType,
    categoryId: product.categoryId && typeof product.categoryId === "object"
      ? String(product.categoryId._id)
      : String(product.categoryId),
    category,
  };
}
