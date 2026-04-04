import mongoose, { Schema } from "mongoose"

const bookingPackageSchema = new Schema(
    {
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },

        description: { type: String, required: true },
        weight: { type: Number, required: true },
        boxes: { type: Number, required: true },
        amount: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
)

const BookingPackage =
    mongoose.models.BookingPackage || mongoose.model("BookingPackage", bookingPackageSchema)
export default BookingPackage