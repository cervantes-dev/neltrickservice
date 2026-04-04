import connectionToDatabase from "@/libs/db";
import { Booking } from "@/libs/model/index";
import { successResponse, errorResponse } from "@/libs/helpers/api-response";

export async function GET() {
    try {
        await connectionToDatabase();

        const stats = await Booking.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                }
            }
        ]);

        const formatted = {
            pending: 0,
            inTransit: 0,
            delivered: 0,
            canceled: 0,

        }

        stats.forEach((item) => {
            if (item._id === "pending") formatted.pending = item.count;
            if (item._id === "in_transit") formatted.inTransit = item.count;
            if (item._id === "delivered") formatted.delivered = item.count;
            if (item._id === "canceled") formatted.canceled = item.count;
        });

        return successResponse(formatted, { message: "Booking stats fetched successfully" }, 200);
        
    } catch (error) {
        return errorResponse("Failed to fetch booking stats", 500);
    }
}