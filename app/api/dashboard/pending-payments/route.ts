import { successResponse, errorResponse } from "@/libs/helpers/api-response"
import connectionToDatabase from "@/libs/db"
import { Booking } from "@/libs/model/index"

export async function GET() {
    try {
        await connectionToDatabase()

        const [result, count] = await Promise.all([
            Booking.aggregate([
                { $match: { paymentStatus: "unpaid" } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } },
            ]),
            Booking.countDocuments({ paymentStatus: "unpaid" }),
        ])

        const totalUnpaid = result[0]?.total ?? 0

        return successResponse({ totalUnpaid, count })
    } catch (error) {
        console.error("[dashboard/pending-payments] GET error:", error)
        return errorResponse("Failed to fetch pending payments", 500)
    }
}