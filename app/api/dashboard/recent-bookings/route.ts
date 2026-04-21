import { successResponse, errorResponse } from "@/libs/helpers/api-response"
import connectionToDatabase from "@/libs/db"
import { Booking } from "@/libs/model/index"

export async function GET() {
    try {
        await connectionToDatabase()

        const bookings = await Booking.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("bookingRef origin destination totalAmount status paymentStatus createdAt")
            .lean()

        const data = bookings.map(b => ({
            bookingRef:    b.bookingRef,
            route:         `${b.origin} → ${b.destination}`,
            totalAmount:   b.totalAmount,
            status:        b.status,
            paymentStatus: b.paymentStatus,
            createdAt:     b.createdAt,
        }))

        return successResponse({ bookings: data })
    } catch (error) {
        console.error("[dashboard/recent-bookings] GET error:", error)
        return errorResponse("Failed to fetch recent bookings", 500)
    }
}