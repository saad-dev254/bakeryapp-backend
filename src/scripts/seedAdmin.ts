import { connectDB } from "../db/connect";
import { User } from "../modules/auth/user.model";
import { hashValue } from "../modules/auth/auth.tokens";
import { env } from "../config/env";
import { logger } from "../utils/logger";

async function seedAdmin() {
  await connectDB();

  const email = "admin@bakeryapp.com";
  const password = "Admin@123";
  const name = "Super Admin";

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    logger.info("✅ Admin already exists: " + exists.email);
    process.exit(0);
  }

  const passwordHash = await hashValue(password);

  const admin = await User.create({
    email: email.toLowerCase(),
    name,
    role: "ADMIN",
    isActive: true,
    passwordHash
  });

  logger.info("✅ Admin created");
  logger.info({ email: admin.email, password }, "LOGIN CREDENTIALS (save it)");
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
