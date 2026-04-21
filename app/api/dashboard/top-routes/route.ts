import { successResponse, errorResponse } from "@/libs/helpers/api-response"
import connectionToDatabase from "@/libs/db"
import { Booking } from "@/libs/model/index"

export async function GET() {
    try {
        await connectionToDatabase()

        const result = await Booking.aggregate([
            {
                $group: {
                    _id:   { origin: "$origin", destination: "$destination" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $project: {
                    _id:         0,
                    origin:      "$_id.origin",
                    destination: "$_id.destination",
                    count:       1,
                },
            },
        ])

        // Attach a percentage relative to the top route for the progress bar
        const max = result[0]?.count ?? 1
        const routes = result.map(r => ({
            route:      `${r.origin} → ${r.destination}`,
            count:      r.count,
            percentage: Math.round((r.count / max) * 100),
        }))

        return successResponse({ routes })
    } catch (error) {
        console.error("[dashboard/top-routes] GET error:", error)
        return errorResponse("Failed to fetch top routes", 500)
    }
}