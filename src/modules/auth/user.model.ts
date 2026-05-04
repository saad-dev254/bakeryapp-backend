import mongoose, { Schema } from "mongoose";

export type UserRole = "ADMIN" | "USER" | "VENDOR" | "RIDER";

export interface IUser {
  email: string;
  name: string;
  phoneNumber: string;
  role: UserRole;
  isActive: boolean;
  isProfileComplete: boolean;
  passwordHash: string;
  passwordChangedAt?: Date;

  refreshTokenHash?: string;

  resetPasswordTokenHash?: string;
  resetPasswordExpiresAt?: Date;

  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    role: { type: String, enum: ["ADMIN", "USER", "VENDOR", "RIDER"], default: "USER", required: true },
    isActive: { type: Boolean, default: true },
    isProfileComplete: { type: Boolean, default: true },
    passwordHash: { type: String, required: true },
    passwordChangedAt: { type: Date },

    refreshTokenHash: { type: String },

    resetPasswordTokenHash: { type: String },
    resetPasswordExpiresAt: { type: Date },

    // createdBy: { type: Schema.Types.ObjectId, ref: "User" }
    createdBy: { type: String, required: false, trim: true },
  },
  { timestamps: true }
);

// UserSchema.index({ email: 1 });

export const User = mongoose.model<IUser>("User", UserSchema);
