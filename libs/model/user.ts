import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "moderator", "staff", "customer"], default: "customer" },
    isVerified: { type: Boolean, default: false },
    verifyOtp: { type: String },
    otpExpiry: { type: Date },
    tokenVersion: { type: Number, default: 0 },
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User