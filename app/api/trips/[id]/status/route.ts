import connectionToDatabase from "@/libs/db";
import Trip from "@/libs/model/trip";
import { successResponse, errorResponse } from "@/libs/helpers/api-response";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectionToDatabase();

        const { id } = await params 
        const body = await req.json();

        const trip = await Trip.findByIdAndUpdate(
            id,
            { $set: body },
            { returnDocument: "after" } 
        );

        if (!trip) return errorResponse("Trip not found", 404);

        return successResponse({ trip }, { message: "Trip updated" }, 200);
    } catch (err: unknown) {
        console.error(err);
        return errorResponse("Failed to update trip", 500);
    }
}