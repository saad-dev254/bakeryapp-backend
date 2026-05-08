"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.adminCreateUser = adminCreateUser;
exports.login = login;
exports.refresh = refresh;
exports.logout = logout;
exports.changePassword = changePassword;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
exports.getMe = getMe;
exports.updateMe = updateMe;
exports.deleteMe = deleteMe;
const httpError_1 = require("../../utils/httpError");
const user_model_1 = require("./user.model");
const auth_tokens_1 = require("./auth.tokens");
const mail_service_1 = require("./mail.service");
const env_1 = require("../../config/env");
async function createUser(dto) {
    const exists = await user_model_1.User.findOne({
        $or: [
            { email: dto.email.toLowerCase() },
            { phoneNumber: dto.phoneNumber }
        ],
        role: dto.role
    });
    if (exists)
        throw new httpError_1.HttpError(409, `Email or phone number already exists for this ${dto.role}`);
    const passwordHash = await (0, auth_tokens_1.hashValue)(dto.password);
    const user = await user_model_1.User.create({
        email: dto.email.toLowerCase(),
        name: dto.name,
        phoneNumber: dto.phoneNumber,
        role: dto.role,
        isActive: true,
        isProfileComplete: dto.role === "VENDOR" || dto.role === "RIDER" ? false : true,
        isApproved: dto.role === "VENDOR" || dto.role === "RIDER" ? false : true,
        passwordHash,
        createdBy: "self"
    });
    return sanitizeUser(user);
}
async function updateUser(id, dto) {
    const user = await user_model_1.User.findById(id);
    if (!user)
        throw new httpError_1.HttpError(404, "User not found");
    if (dto.name)
        user.name = dto.name;
    if (dto.userImage)
        user.userImage = dto.userImage;
    await user.save();
    return sanitizeUser(user);
}
async function adminCreateUser(adminId, dto) {
    const exists = await user_model_1.User.findOne({
        $or: [{ email: dto.email.toLowerCase() }, { phoneNumber: dto.phoneNumber.trim() }]
    });
    if (exists)
        throw new httpError_1.HttpError(409, "Email or phone number already exists");
    const passwordHash = await (0, auth_tokens_1.hashValue)(dto.password);
    const user = await user_model_1.User.create({
        email: dto.email.toLowerCase(),
        name: dto.name,
        phoneNumber: dto.phoneNumber.trim(),
        role: dto.role,
        isActive: dto.isActive ?? true,
        isProfileComplete: dto.isProfileComplete ?? true,
        passwordHash,
        createdBy: adminId
    });
    return sanitizeUser(user);
}
async function login(dto) {
    // const user = await User.findOne({ phoneNumber: dto.phoneNumber.trim(), role: dto.role });
    let user;
    if (dto.email && dto.role === "ADMIN") {
        user = await user_model_1.User.findOne({ email: dto.email?.toLowerCase(), role: dto.role });
        if (!user)
            throw new httpError_1.HttpError(401, "Invalid email, role, or password");
    }
    else {
        user = await user_model_1.User.findOne({ phoneNumber: dto.phoneNumber?.trim(), role: dto.role });
        if (!user)
            throw new httpError_1.HttpError(401, "Invalid phone number, role, or password");
    }
    if (!user.isActive)
        throw new httpError_1.HttpError(403, "Account is disabled");
    const ok = await (0, auth_tokens_1.compareHash)(dto.password, user.passwordHash);
    if (dto.email && dto.role === "ADMIN") {
        if (!ok)
            throw new httpError_1.HttpError(401, "Invalid email, role, or password");
    }
    else {
        if (!ok)
            throw new httpError_1.HttpError(401, "Invalid phone number, role, or password");
    }
    const payload = { sub: String(user._id), role: user.role, email: user.email };
    const accessToken = (0, auth_tokens_1.signAccessToken)(payload);
    const refreshToken = (0, auth_tokens_1.signRefreshToken)(payload);
    // store hashed refresh token for rotation
    user.refreshTokenHash = (0, auth_tokens_1.sha256)(refreshToken);
    await user.save();
    return { accessToken, refreshToken, user: sanitizeUser(user) };
}
async function refresh(refreshToken) {
    const payload = (0, auth_tokens_1.verifyRefreshToken)(refreshToken);
    const user = await user_model_1.User.findById(payload.sub);
    if (!user)
        throw new httpError_1.HttpError(401, "Invalid refresh token");
    if (!user.isActive)
        throw new httpError_1.HttpError(403, "Account is disabled");
    if (!user.refreshTokenHash || user.refreshTokenHash !== (0, auth_tokens_1.sha256)(refreshToken)) {
        throw new httpError_1.HttpError(401, "Refresh token revoked");
    }
    const newPayload = { sub: String(user._id), role: user.role, email: user.email };
    const accessToken = (0, auth_tokens_1.signAccessToken)(newPayload);
    const newRefreshToken = (0, auth_tokens_1.signRefreshToken)(newPayload);
    user.refreshTokenHash = (0, auth_tokens_1.sha256)(newRefreshToken);
    await user.save();
    return { accessToken, refreshToken: newRefreshToken };
}
async function logout(userId) {
    await user_model_1.User.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: 1 } });
    return true;
}
async function changePassword(userId, dto) {
    const user = await user_model_1.User.findById(userId);
    if (!user)
        throw new httpError_1.HttpError(404, "User not found");
    const ok = await (0, auth_tokens_1.compareHash)(dto.currentPassword, user.passwordHash);
    if (!ok)
        throw new httpError_1.HttpError(401, "Current password incorrect");
    user.passwordHash = await (0, auth_tokens_1.hashValue)(dto.newPassword);
    user.passwordChangedAt = new Date();
    user.refreshTokenHash = undefined;
    await user.save();
    return true;
}
async function forgotPassword(email) {
    const user = await user_model_1.User.findOne({ email: email.toLowerCase() });
    // security: do not reveal
    if (!user)
        return true;
    const { raw, hash } = (0, auth_tokens_1.createResetToken)();
    user.resetPasswordTokenHash = hash;
    user.resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    const resetUrl = `${env_1.env.APP_URL}/reset-password?token=${raw}`;
    await (0, mail_service_1.sendResetPasswordEmail)(user.email, resetUrl);
    return true;
}
async function resetPassword(dto) {
    const tokenHash = (0, auth_tokens_1.sha256)(dto.token);
    const user = await user_model_1.User.findOne({
        resetPasswordTokenHash: tokenHash,
        resetPasswordExpiresAt: { $gt: new Date() }
    });
    if (!user)
        throw new httpError_1.HttpError(400, "Invalid or expired reset token");
    user.passwordHash = await (0, auth_tokens_1.hashValue)(dto.newPassword);
    user.passwordChangedAt = new Date();
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpiresAt = undefined;
    user.refreshTokenHash = undefined;
    await user.save();
    return true;
}
async function getMe(userId) {
    const user = await user_model_1.User.findById(userId);
    if (!user)
        throw new httpError_1.HttpError(404, "User not found");
    return sanitizeUser(user);
}
async function updateMe(userId, dto) {
    const user = await user_model_1.User.findById(userId);
    if (!user)
        throw new httpError_1.HttpError(404, "User not found");
    if (dto.name)
        user.name = dto.name;
    if (dto.userImage !== undefined)
        user.userImage = dto.userImage;
    if (dto.isProfileComplete !== undefined)
        user.isProfileComplete = dto.isProfileComplete;
    if (dto.isApproved !== undefined)
        user.isApproved = dto.isApproved;
    await user.save();
    return sanitizeUser(user);
}
async function deleteMe(userId) {
    await user_model_1.User.findByIdAndDelete(userId);
    return true;
}
function sanitizeUser(user) {
    return {
        id: String(user._id),
        email: user.email,
        name: user.name,
        userImage: user.userImage,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isActive: user.isActive,
        isProfileComplete: user.isProfileComplete,
        isApproved: user.isApproved,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}
