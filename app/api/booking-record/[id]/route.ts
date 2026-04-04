import connectionToDatabase from "@/libs/db";
import { Booking, BookingPackage } from "@/libs/model/index";
import { successResponse, errorResponse } from "@/libs/helpers/api-response";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectionToDatabase();

        const booking = await Booking.findById(params.id).populate("userId").lean();

        if (!booking) {
            return errorResponse("Booking not found", 404);
        }

        const packages = await BookingPackage.find({ bookingId: params.id }).lean();

        return successResponse(
            { ...booking, packages },
            { message: "Booking fetched successfully" },
            200
        );
    } catch (error) {
        return errorResponse("Failed to fetch booking", 500);
    }
}