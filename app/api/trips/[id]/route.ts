import connectionToDatabase from "@/libs/db";
import { Booking, Trip } from "@/libs/model/index";
import { successResponse, errorResponse } from "@/libs/helpers/api-response";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectionToDatabase();

        const { id } = await params;

        const trip = await Trip.findById(id).lean() as any;
        if (!trip) return errorResponse("Trip not found", 404);

        // query by the human-readable tripId, not the MongoDB _id
        const bookings = await Booking.find({ tripId: trip.tripId }).lean();

        return successResponse(
            { ...trip, bookings },
            { message: "Trip fetched successfully" },
            200
        );
    } catch (err: unknown) {
        console.error(err);
        return errorResponse("Failed to fetch trip", 500);
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectionToDatabase();

        const { id } = await params;
        const { origin, destination, departureDate, departureTime, capacityKg } = await req.json();

        const trip = await Trip.findByIdAndUpdate(
            id,
            {
                $set: {
                    "route.origin": origin,
                    "route.destination": destination,
                    "schedule.departureDate": departureDate,
                    "schedule.departureTime": departureTime,
                    capacityKg,
                },
            },
            { new: true }
        );

        if (!trip) return errorResponse("Trip not found", 404);

        return successResponse({ trip }, { message: "Trip updated" }, 200);
    } catch (err: unknown) {
        console.error(err);
        return errorResponse("Failed to update trip", 500);
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectionToDatabase();

        const { id } = await params;

        // ← i-check muna kung may bookings ang trip
        const bookingCount = await Booking.countDocuments({ tripId: id });

        if (bookingCount > 0) {
            return errorResponse(
                `Cannot delete — this trip has ${bookingCount} existing booking/s.`,
                400
            );
        }

        const trip = await Trip.findByIdAndDelete(id);

        if (!trip) return errorResponse("Trip not found", 404);

        return successResponse(null, { message: "Trip deleted" }, 200);
    } catch (err: unknown) {
        console.error(err);
        return errorResponse("Failed to delete trip", 500);
    }
}