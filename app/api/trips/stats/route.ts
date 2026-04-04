import connectionToDatabase from "@/libs/db";
import { Trip, Booking } from "@/libs/model/index";
import { successResponse, errorResponse } from "@/libs/helpers/api-response";

export async function GET() {
    try {
        await connectionToDatabase();

        const trips = await Trip.find().lean();

        const totalTrips = trips.length;
        const activeTrips = trips.filter(t => t.status === "active").length;
        const totalCapacityKg = trips.reduce((sum, t) => sum + t.capacityKg, 0);

        // compute avg fill rate
        const fillRates = await Promise.all(
            trips.map(async (trip) => {
                const booked = await Booking.aggregate([
                    { $match: { tripId: trip.tripId } },
                    { $group: { _id: null, total: { $sum: "$totalWeight" } } }
                ]);
                const bookedKg = booked[0]?.total ?? 0;
                return trip.capacityKg > 0 ? (bookedKg / trip.capacityKg) * 100 : 0;
            })
        );

        const avgFillRate = fillRates.length > 0
            ? Math.round(fillRates.reduce((sum, r) => sum + r, 0) / fillRates.length)
            : 0;

        return successResponse(
            { totalTrips, activeTrips, totalCapacityKg, avgFillRate },
            { message: "OK" },
            200
        );
    } catch (err) {
        console.error(err);
        return errorResponse("Failed to fetch stats", 500);
    }
}