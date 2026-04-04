import { successResponse, errorResponse } from "@/libs/helpers/api-response";
import connectionToDatabase from "@/libs/db";
import { Trip, Booking } from "@/libs/model/index";

export async function GET(req: Request) {
    try {
        await connectionToDatabase();

        const { searchParams } = new URL(req.url);
        const upcoming = searchParams.get("upcoming");
        const page = parseInt(searchParams.get("page") ?? "1");
        const limit = parseInt(searchParams.get("limit") ?? "10");
        const skip = (page - 1) * limit; // ← page 1 = skip 0, page 2 = skip 10

        const filter = upcoming === "true"
            ? { status: "active", "schedule.departureDate": { $gte: new Date() } }
            : {};

        const [trips, totalCount] = await Promise.all([
            Trip.find(filter)
                .sort({ "schedule.departureDate": 1 })
                .skip(skip)   // ← idagdag
                .limit(limit) // ← idagdag
                .lean(),
            Trip.countDocuments(filter), // ← filter din, hindi lahat
        ]);

        const totalPages = Math.ceil(totalCount / limit); // ← compute dito
        const nextTripId = `NLT-TRP-${String(totalCount + 1).padStart(3, "0")}`;

        const tripsWithUsage = await Promise.all(
            trips.map(async (trip) => {
                const booked = await Booking.aggregate([
                    { $match: { tripId: trip.tripId } },
                    { $group: { _id: null, total: { $sum: "$totalWeight" } } }
                ]);
                return { ...trip, bookedCapacityKg: booked[0]?.total ?? 0 };
            })
        );

        return successResponse(
            { trips: tripsWithUsage, nextTripId, totalCount, totalPages, currentPage: page }, // ← idagdag
            { message: "OK" },
            200
        );
    } catch (err) {
        console.error(err);
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