import connectionToDatabase from "@/libs/db"
import { Booking, BookingPackage } from "@/libs/model/index"
import { successResponse, errorResponse } from "@/libs/helpers/api-response"

export async function GET(req: Request) {
    try {
        await connectionToDatabase()

        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get("page") ?? "1")
        const limit = parseInt(searchParams.get("limit") ?? "10")
        const skip = (page - 1) * limit

        const [bookings, totalCount] = await Promise.all([
            Booking.find()
                .populate("userId")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Booking.countDocuments(),
        ])

        const bookingIds = bookings.map((b: any) => b._id)

        const packages = await BookingPackage.find({
            bookingId: { $in: bookingIds }
        }).lean()

        const withPackages = bookings.map((b: any) => ({
            ...b,
            packages: packages.filter(
                (p: any) => p.bookingId.toString() === b._id.toString()
            ),
        }))

        const totalPages = Math.ceil(totalCount / limit)

        return successResponse(
            { bookings: withPackages, totalCount, totalPages, currentPage: page },
            { message: "Booking records fetched successfully" },
            200
        )
    } catch (error) {
        return errorResponse("Failed to fetch booking records", 500)
    }
}