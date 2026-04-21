import { successResponse, errorResponse } from "@/libs/helpers/api-response"
import connectionToDatabase from "@/libs/db"
import { Trip, Booking, User } from "@/libs/model/index"

export async function GET() {
    try {
        await connectionToDatabase()

        const [totalBookings, totalTrips, totalCustomer, revenueResult] =
            await Promise.all([
                Booking.countDocuments(),
                Trip.countDocuments({ status: { $ne: "draft" } }),
                User.countDocuments({ role: "customer" }),
                Booking.aggregate([
                    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
                ]),
            ])

        const totalRevenues = revenueResult[0]?.total ?? 0

        return successResponse({
            totalBookings,
            totalTrips,
            totalCustomer,
            totalRevenues,
        })
    } catch (error) {
        console.error("[dashboard/stats] GET error:", error)
        return errorResponse("Failed to fetch dashboard stats", 500)
    }
}