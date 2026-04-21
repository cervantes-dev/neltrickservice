import { successResponse, errorResponse } from "@/libs/helpers/api-response"
import connectionToDatabase from "@/libs/db"
import { Booking } from "@/libs/model/index"

export async function GET() {
    try {
        await connectionToDatabase()

        const result = await Booking.aggregate([
            {
                $group: {
                    _id:   "$status",
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id:    0,
                    status: "$_id",
                    count:  1,
                },
            },
        ])

        // Ensure all statuses are always present even if count is 0
        const statuses = ["pending", "in_transit", "delivered", "cancelled"]
        const breakdown = statuses.map(status => ({
            status,
            count: result.find(r => r.status === status)?.count ?? 0,
        }))

        const total = breakdown.reduce((sum, r) => sum + r.count, 0)

        return successResponse({ breakdown, total })
    } catch (error) {
        console.error("[dashboard/booking-status] GET error:", error)
        return errorResponse("Failed to fetch booking status breakdown", 500)
    }
}