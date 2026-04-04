import mongoose, { Schema } from "mongoose"

const tripSchema = new Schema(
    {
        tripId: { type: String, required: true, unique: true, uppercase: true, trim: true },
        route: {
            origin: { type: String, required: true, trim: true },
            destination: { type: String, required: true, trim: true },
        },
        schedule: {
            departureDate: { type: Date, required: true },
            departureTime: {
                type: String,
                required: true,
                trim: true,
                match: [/^\d{2}:\d{2}$/, "departureTime must be in HH:mm format"],
            },
        },
        capacityKg: { type: Number, required: true, min: 1 },  // e.g. 5000 kg total
        status: {
            type: String,
            enum: ["draft", "active", "cancelled", "completed"],
            default: "draft"
        }
    },
    { timestamps: true }
)

export const Trip =
    mongoose.models.Trip || mongoose.model("Trip", tripSchema)
export default Trip