import connectionToDatabase from "@/libs/db"
import { Trip, Booking } from "@/libs/model/index"
import { successResponse, errorResponse } from "@/libs/helpers/api-response"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectionToDatabase()

        const { id } = await params
        const body = await req.json()

        // If it's a status update, handle cascade
        if (body.status) {
            const ALLOWED_STATUS = ["draft", "active", "in_transit", "completed", "cancelled"]
            if (!ALLOWED_STATUS.includes(body.status)) {
                return errorResponse("Invalid status", 400)
            }

            const trip = await Trip.findByIdAndUpdate(
                id,
                { $set: { status: body.status } },
                { new: true }
            )

            if (!trip) return errorResponse("Trip not found", 404)

            // Cascade to bookings
            if (body.status === "in_transit") {
                await Booking.updateMany(
                    { tripId: trip.tripId, status: "pending" },
                    { $set: { status: "in_transit" } }
                )
            }

            if (body.status === "cancelled") {
                await Booking.updateMany(
                    { tripId: trip.tripId, status: { $in: ["pending", "in_transit"] } },
                    { $set: { status: "cancelled" } }
                )
            }

            return successResponse({ trip }, { message: "Trip status updated" }, 200)
        }

        // Otherwise it's a regular edit (route, schedule, capacity)
        // Block edit if trip is no longer draft
        const existing = await Trip.findById(id)
        if (!existing) return errorResponse("Trip not found", 404)

        if (existing.status !== "draft") {
            return errorResponse("Only draft trips can be edited", 400)
        }

        const trip = await Trip.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true }
        )

        return successResponse({ trip }, { message: "Trip updated" }, 200)

    } catch (err) {
        console.error(err)
        return errorResponse("Failed to update trip", 500)
    }
}