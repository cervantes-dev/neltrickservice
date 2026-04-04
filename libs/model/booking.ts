import mongoose, { Schema } from "mongoose"

const bookingSchema = new Schema(
    {
        bookingRef: {
            type: String,
            required: true,
            unique: true,
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "in_transit", "delivered", "cancelled"],
            default: "pending",
        },

        // ── Step 1 ──────────────────────────────
        tripId: { type: String, required: true },
        origin: { type: String, required: true },
        destination: { type: String, required: true },
        departure: { type: String, required: true },

        // ── Step 3 — sender ─────────────────────
        senderName: { type: String, required: true },
        senderContact: { type: String, required: true },
        senderAddress: { type: String, required: true },
        senderCity: { type: String, required: true },
        pickupTime: { type: String, required: true },

        // ── Step 3 — recipient ──────────────────
        recipientName: { type: String, required: true },
        recipientContact: { type: String, required: true },
        recipientAddress: { type: String, required: true },
        instructions: { type: String, default: "" },

        // ── Step 4 — payment ────────────────────
        paymentMethod: {
            type: String,
            enum: ["cash", "gcash", "maya", "bank"],
            default: "cash",
        },
        paymentStatus: {
            type: String,
            enum: ["unpaid", "paid"],
            default: "unpaid",
        },

        // ── Pricing ─────────────────────────────
        totalWeight: { type: Number, required: true },
        deliveryFee: { type: Number, required: true },
        handlingFee: { type: Number, required: true },
        totalAmount: { type: Number, required: true },

        // ── Relation to User ────────────────────
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

export const Booking =
    mongoose.models.Booking || mongoose.model("Booking", bookingSchema)
export default Booking
