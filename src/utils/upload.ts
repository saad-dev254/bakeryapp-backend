import fs from "fs";
import path from "path";
import multer from "multer";

const uploadsRoot = path.join(process.cwd(), "uploads");
const userUploadsDir = path.join(uploadsRoot, "users");
const vendorUploadsDir = path.join(uploadsRoot, "vendors");
const riderUploadsDir = path.join(uploadsRoot, "riders");
const productUploadsDir = path.join(uploadsRoot, "products");

[uploadsRoot, userUploadsDir, vendorUploadsDir, riderUploadsDir, productUploadsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function makeStorage(folderName: "users" | "vendors" | "products" | "riders") {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, path.join(uploadsRoot, folderName));
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname) || ".jpg";
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, uniqueName);
    },
  });
}

function imageFileFilter(_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
    return;
  }
  cb(new Error("Only image files are allowed"));
}

export const userImageUpload = multer({
  storage: makeStorage("users"),
  fileFilter: imageFileFilter,
});

export const vendorImageUpload = multer({
  storage: makeStorage("vendors"),
  fileFilter: imageFileFilter,
});

export const riderImageUpload = multer({
  storage: makeStorage("riders"),
  fileFilter: imageFileFilter,
});

export const productImageUpload = multer({
  storage: makeStorage("products"),
  fileFilter: imageFileFilter,
});
