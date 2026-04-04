import connectionToDatabase from "@/libs/db";
import { Booking, Trip } from "@/libs/model/index";

import { successResponse, errorResponse } from "@/libs/helpers/api-response";

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