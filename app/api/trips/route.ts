import { successResponse, errorResponse } from "@/libs/helpers/api-response";
import connectionToDatabase from "@/libs/db";
import { Trip, Booking } from "@/libs/model/index";

export async function GET(req: Request) {
    try {
        await connectionToDatabase()

        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get("page") ?? "1")
        const limit = parseInt(searchParams.get("limit") ?? "10")
        const skip = (page - 1) * limit

        // Move filters to server
        const status = searchParams.get("status")
        const origin = searchParams.get("origin")
        const destination = searchParams.get("destination")
        const dateFrom = searchParams.get("dateFrom")
        const dateTo = searchParams.get("dateTo")
        const upcoming = searchParams.get("upcoming")

        const filter: Record<string, any> = {}

        if (upcoming === "true") {
            filter.status = "active"
            filter["schedule.departureDate"] = { $gte: new Date() }
        } else {
            if (status) filter.status = status
            if (origin) filter["route.origin"] = { $regex: origin, $options: "i" }
            if (destination) filter["route.destination"] = { $regex: destination, $options: "i" }
            if (dateFrom || dateTo) {
                filter["schedule.departureDate"] = {}
                if (dateFrom) filter["schedule.departureDate"].$gte = new Date(dateFrom)
                if (dateTo) filter["schedule.departureDate"].$lte = new Date(dateTo)
            }
        }

        const [trips, totalCount] = await Promise.all([
            Trip.find(filter).sort({ "schedule.departureDate": 1 }).skip(skip).limit(limit).lean(),
            Trip.countDocuments(filter),
        ])

        const totalPages = Math.ceil(totalCount / limit)
        const allTripsCount = await Trip.countDocuments()
        const nextTripId = `NLT-TRP-${String(allTripsCount + 1).padStart(3, "0")}`

        const tripsWithUsage = await Promise.all(
            trips.map(async (trip) => {
                const booked = await Booking.aggregate([
                    { $match: { tripId: trip.tripId } },
                    { $group: { _id: null, total: { $sum: "$totalWeight" } } }
                ])
                return { ...trip, bookedCapacityKg: booked[0]?.total ?? 0 }
            })
        )

        return successResponse(
            { trips: tripsWithUsage, nextTripId, totalCount, totalPages, currentPage: page },
            { message: "OK" },
            200
        )
    } catch (err) {
        console.error(err)
        return errorResponse("Failed to fetch trips", 500)
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