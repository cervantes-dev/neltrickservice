import connectionToDatabase from "@/libs/db";
import { Booking } from "@/libs/model/index";
import { successResponse, errorResponse } from "@/libs/helpers/api-response";

export async function GET(req: Request) {
  try {
    await connectionToDatabase();

    const bookings = await Booking.find().populate("userId");

    return successResponse(bookings, { message: "Booking records fetched successfully" }, 200);

  } catch (error) {
    return errorResponse("Failed to fetch booking records", 500);
  }
}