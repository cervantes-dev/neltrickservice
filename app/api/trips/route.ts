import { successResponse, errorResponse } from "@/libs/helpers/api-response";
import connectionToDatabase from "@/libs/db";
import { Trip, Booking } from "@/libs/model/index";

export async function GET(req: Request) {
    try {
        await connectionToDatabase();

        const { searchParams } = new URL(req.url);
        const upcoming = searchParams.get("upcoming");

        const filter = upcoming === "true"
            ? {
                status: "active",
                "schedule.departureDate": { $gte: new Date() }
            }
            : {};

        const [trips, count] = await Promise.all([
            Trip.find(filter).sort({ "schedule.departureDate": 1 }).lean(),
            Trip.countDocuments(),
        ]);

        const nextTripId = `NLT-TRP-${String(count + 1).padStart(3, "0")}`;

        // ← ito ang natanggal mo
        const tripsWithUsage = await Promise.all(
            trips.map(async (trip) => {
                const booked = await Booking.aggregate([
                    { $match: { tripId: trip.tripId } },
                    { $group: { _id: null, total: { $sum: "$totalWeight" } } }
                ]);
                const bookedKg = booked[0]?.total ?? 0;
                return { ...trip, bookedCapacityKg: bookedKg };
            })
        );

        return successResponse({ trips: tripsWithUsage, nextTripId }, { message: "OK" }, 200);
    } catch (err) {
        console.error(err) // ← para makita ang exact error next time
        return errorResponse("Failed to fetch trips", 500);
    }
}

export async function POST(req: Request) {
    try {
        await connectionToDatabase();

        const { tripId, origin, destination, departureDate, departureTime, capacityKg } = await req.json();

        const trip = await Trip.create({
            tripId,
            route: {
                origin,
                destination,
            },
            schedule: {
                departureDate,
                departureTime,
            },
            capacityKg,
        });

        return successResponse({ tripId: trip.tripId }, { message: "Trip created" }, 201);
    } catch (err: any) {
        // Mongoose duplicate key error
        if (err.code === 11000) {
            return errorResponse("Trip ID already exists", 409);
        }

        return errorResponse("Internal server error", 500);
    }
}