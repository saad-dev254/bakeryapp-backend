import { HttpError } from "../../utils/httpError";
import Products from "./product.model";
import Vendors from "../vendor/vendor.model";
import Settings from "../settings/settings.model";

// Global helper to filter vendors within a certain KM radius, with approval check
async function getVendorsWithinRadius(latitude: number, longitude: number) {
  const setting = await Settings.findOne();
  const radiusKm = setting && setting.radiusInKM ? parseFloat(setting.radiusInKM) : 10;
  const EARTH_RADIUS = 6378.1;

  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    isNaN(latitude) ||
    isNaN(longitude)
  ) {
    throw new HttpError(400, "Invalid latitude or longitude");
  }

  const allVendors = await Vendors.find({
    bakeryLatitude: { $ne: null },
    bakeryLongitude: { $ne: null },
  }).lean();

  const approvedVendors = allVendors.filter((vendor: any) =>
    vendor.approvalStatus === "approved"
  );

  const vendorsWithinRadius = approvedVendors.filter((vendor: any) => {
    const vendorLat = parseFloat(vendor.bakeryLatitude);
    const vendorLng = parseFloat(vendor.bakeryLongitude);

    if (isNaN(vendorLat) || isNaN(vendorLng)) return false;

    const toRad = (v: number) => (v * Math.PI) / 180;
    const dLat = toRad(vendorLat - latitude);
    const dLon = toRad(vendorLng - longitude);
    const lat1 = toRad(latitude);
    const lat2 = toRad(vendorLat);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = EARTH_RADIUS * c;

    return distance <= radiusKm;
  });

  return vendorsWithinRadius;
}

export async function createProduct(vendorId: string,
dto: {
  productName?: string;
  productImage?: string;
  productDescription?: string;
  productPrice?: string;
  status?: string;
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
    status: dto.status,
  });

  // Get vendor detail for bakeryDetail object
  const vendorDetail = await Vendors.findOne({ vendorId }).populate("vendorId");
  const bakeryDetail = vendorDetail
    ? sanitizeBakeryDetail(vendorDetail)
    : null;

  return sanitizeProduct(product, bakeryDetail);
}

export async function updateProduct(id: string,
dto: {
  productName?: string;
  productImage?: string;
  productDescription?: string;
  productPrice?: string;
  status?: string;
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
  if (dto.status) product.status = dto.status;

  await product.save();

  // Get vendor detail for bakeryDetail
  const vendorDetail = await Vendors.findOne({ vendorId: product.vendorId }).populate("vendorId");
  const bakeryDetail = vendorDetail
    ? sanitizeBakeryDetail(vendorDetail)
    : null;

  return sanitizeProduct(product, bakeryDetail);
}

export async function getAllProducts(vendorId: string) {
  let products;
  let bakeryDetail = null;

  if (vendorId) {
    products = await Products.find({ vendorId })
      .populate("categoryId", "categoryName");

    // Fetch and sanitize vendor detail once for all products if vendorId passed
    const vendor = await Vendors.findOne({ vendorId }).populate("vendorId");
    bakeryDetail = vendor ? sanitizeBakeryDetail(vendor) : null;
  } else {
    products = await Products.find()
      .populate("categoryId", "categoryName");
  }

  if (!products || products.length === 0)
    throw new HttpError(404, "No products found for this vendor");

  // For each product, optionally fetch bakeryDetail if not constant
  return await Promise.all(
    products.map(async (product: any) => {
      let bakeryInfo = bakeryDetail;
      // If vendorId not provided, fetch vendor per product
      if (!vendorId) {
        const singleVendor = await Vendors.findOne({ vendorId: product.vendorId }).populate("vendorId");
        bakeryInfo = singleVendor ? sanitizeBakeryDetail(singleVendor) : null;
      }
      return sanitizeProduct(product, bakeryInfo);
    })
  );
}

export async function getSingleProduct(id: string) {
  const product = await Products.findById(id).populate(
    "categoryId",
    "categoryName"
  );
  if (!product) throw new HttpError(404, "Product not found");

  // Get vendor detail for bakeryDetail
  const vendorDetail = await Vendors.findOne({ vendorId: product.vendorId }).populate("vendorId");
  const bakeryDetail = vendorDetail
    ? sanitizeBakeryDetail(vendorDetail)
    : null;

  return sanitizeProduct(product, bakeryDetail);
}

export async function deleteProduct(id: string) {
  await Products.findByIdAndDelete(id);
  return true;
}

// Find products for bakeries within a provided km radius of provided user lat/lng
export async function getNearbyBakeryProducts(latitude: number, longitude: number) {
  const vendorsWithinRadius = await getVendorsWithinRadius(latitude, longitude);

  if (vendorsWithinRadius.length === 0) {
    throw new HttpError(404, "No bakery available in your location");
  }

  const vendorIds = vendorsWithinRadius.map((v: any) =>
    v.vendorId ? v.vendorId.toString() : ""
  ).filter(Boolean);

  if (vendorIds.length === 0) {
    throw new HttpError(404, "No bakery available in your location");
  }

  // Fetch all products for found vendor IDs
  const products = await Products.find({ vendorId: { $in: vendorIds } }).populate("categoryId", "categoryName");

  // Organize products into home and shop bakeryTypes
  const homeBaseBakeries: any[] = [];
  const shopBaseBakeries: any[] = [];

  await Promise.all(
    products.map(async (product: any) => {
      // Find the vendor of this product
      let vendor = vendorsWithinRadius.find((v: any) =>
        v.vendorId && v.vendorId.toString() === product.vendorId.toString()
      );
      let fullVendor = vendor;
      if (fullVendor && !fullVendor.vendorId) {
        const found = await Vendors.findOne({ vendorId: product.vendorId }).populate("vendorId");
        fullVendor = found === null ? undefined : found;
      }
      const bakeryDetail = fullVendor ? sanitizeBakeryDetail(fullVendor) : null;
      const prodObj = sanitizeProduct(product, bakeryDetail);

      // Split into home/shop
      if (fullVendor && fullVendor.bakeryType && fullVendor.bakeryType.toLowerCase() === "home") {
        homeBaseBakeries.push(prodObj);
      } else if (fullVendor && fullVendor.bakeryType && fullVendor.bakeryType.toLowerCase() === "shop") {
        shopBaseBakeries.push(prodObj);
      }
    })
  );

  return { homeBaseBakeries, shopBaseBakeries };
}

// Find products for bakeries within a provided km radius of provided user lat/lng and category ID
export async function getNearbyBakeryProductsByCategory(
  latitude: number,
  longitude: number,
  categoryId: string
) {
  if (!categoryId) {
    throw new HttpError(400, "Category Id is required");
  }

  // Use global helper to get vendors within radius
  const vendorsWithinRadius = await getVendorsWithinRadius(latitude, longitude);

  if (vendorsWithinRadius.length === 0) {
    throw new HttpError(404, "No bakery available in your location");
  }

  const vendorIds = vendorsWithinRadius.map((v: any) =>
    v.vendorId ? v.vendorId.toString() : ""
  ).filter(Boolean);

  if (vendorIds.length === 0) {
    throw new HttpError(404, "No bakery available in your location");
  }

  // Fetch only products of the given category and vendorIds within radius
  const products = await Products.find({
    vendorId: { $in: vendorIds },
    categoryId: categoryId
  }).populate("categoryId", "categoryName");

  return await Promise.all(
    products.map(async (product: any) => {
      const vendor = vendorsWithinRadius.find((v: any) =>
        v.vendorId && v.vendorId.toString() === product.vendorId.toString()
      );
      let fullVendor = vendor;
      if (fullVendor && !fullVendor.vendorId) {
        const found = await Vendors.findOne({ vendorId: product.vendorId }).populate("vendorId");
        fullVendor = found === null ? undefined : found;
      }
      const bakeryDetail = fullVendor ? sanitizeBakeryDetail(fullVendor) : null;
      return sanitizeProduct(product, bakeryDetail);
    })
  );
}

// Accept bakeryDetail as argument and attach to return object
function sanitizeProduct(product: any, bakeryDetail?: any) {
  const category =
    product.categoryId && typeof product.categoryId === "object"
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
    status: product.status,
    categoryId:
      product.categoryId && typeof product.categoryId === "object"
        ? String(product.categoryId._id)
        : String(product.categoryId),
    category,
    bakeryDetail: bakeryDetail || null,
  };
}

// Helper function to sanitize complete vendor as needed for bakeryDetail
function sanitizeBakeryDetail(vendor: any) {
  // vendor.vendorId may be populated user object
  let userObj = vendor.vendorId && typeof vendor.vendorId === "object"
    ? vendor.vendorId
    : {};

  return {
    id: String(vendor._id),
    vendorId: String(vendor.vendorId && vendor.vendorId._id ? vendor.vendorId._id : vendor.vendorId),
    vendorName: userObj?.name,
    // vendorEmail: userObj?.email,
    // vendorMobileNo: userObj?.phoneNumber,
    // vendorIsApproved: userObj?.isApproved,
    // vendorDesignation: vendor.vendorDesignation,
    // vendorCnicNumber: vendor.vendorCnicNumber,
    // vendorCnicFrontImage: vendor.vendorCnicFrontImage,
    // vendorCnicBackImage: vendor.vendorCnicBackImage,
    bakeryLogo: vendor.bakeryLogo,
    bakeryImage: vendor.bakeryImage,
    bakeryName: vendor.bakeryName,
    bakeryAddress: vendor.bakeryAddress,
    bakeryLatitude: vendor.bakeryLatitude,
    bakeryLongitude: vendor.bakeryLongitude,
    city: vendor.city,
    area: vendor.area,
    // ntnNumber: vendor.ntnNumber,
    // ntnImage: vendor.ntnImage,
    // foodLicenseImage: vendor.foodLicenseImage,
    openingTime: vendor.openingTime,
    closingTime: vendor.closingTime,
    bakeryType: vendor.bakeryType,
    preOrder: vendor.preOrder,
    deliveryTime: vendor.deliveryTime,
    isOnline: vendor.isOnline,
    kitchenImages: vendor.kitchenImages,
    // approvalStatus: vendor.approvalStatus,
    // rejectReason: vendor.rejectReason,
    // createdAt: vendor.createdAt,
    // updatedAt: vendor.updatedAt,
  };
}