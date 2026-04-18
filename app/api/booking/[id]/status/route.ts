import mongoose from "mongoose"
import connectionToDatabase from "@/libs/db"
import { Booking } from "@/libs/model/index"
import { successResponse, errorResponse } from "@/libs/helpers/api-response"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectionToDatabase()

        const { id } = await params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse("Invalid booking ID", 400)
        }

        const { status } = await req.json()

        const validStatuses = ["pending", "in_transit", "delivered", "cancelled"]
        if (!validStatuses.includes(status)) {
            return errorResponse("Invalid status value", 400)
        }

        const booking = await Booking.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).lean()

        if (!booking) return errorResponse("Booking not found", 404)

        return successResponse(booking, { message: "Booking status updated" }, 200)
    } catch (err: unknown) {
        console.error(err)
        return errorResponse("Failed to update booking status", 500)
    }
}