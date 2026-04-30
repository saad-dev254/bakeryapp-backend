"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connect_1 = require("../db/connect");
const user_model_1 = require("../modules/auth/user.model");
const auth_tokens_1 = require("../modules/auth/auth.tokens");
const logger_1 = require("../utils/logger");
async function seedAdmin() {
    await (0, connect_1.connectDB)();
    const email = "admin@bakeryapp.com";
    const password = "Admin@123";
    const name = "Super Admin";
    const exists = await user_model_1.User.findOne({ email: email.toLowerCase() });
    if (exists) {
        logger_1.logger.info("✅ Admin already exists: " + exists.email);
        process.exit(0);
    }
    const passwordHash = await (0, auth_tokens_1.hashValue)(password);
    const admin = await user_model_1.User.create({
        email: email.toLowerCase(),
        name,
        role: "ADMIN",
        isActive: true,
        passwordHash
    });
    logger_1.logger.info("✅ Admin created");
    logger_1.logger.info({ email: admin.email, password }, "LOGIN CREDENTIALS (save it)");
    process.exit(0);
}
seedAdmin().catch((err) => {
    console.error(err);
    process.exit(1);
});
