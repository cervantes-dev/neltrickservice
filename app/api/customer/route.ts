import { successResponse, errorResponse } from "@/libs/helpers/api-response"
import connectionToDatabase from "@/libs/db"
import User from "@/libs/model/user"

export async function GET(req: Request) {
  try {
    await connectionToDatabase()

    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get("page")) || 1
    const limit = Number(searchParams.get("limit")) || 10
    const search = searchParams.get("search") || ""

    const matchStage: Record<string, unknown> = {
      role: "customer",
      isVerified: true
    }

    if (search.trim()) {
      matchStage.email = { $regex: search, $options: "i" }
    }

    const [result] = await User.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "userId",
          as: "bookings"
        }
      },
      {
        $addFields: {
          bookingCount: { $size: "$bookings" },
          lastBookingDate: { $max: "$bookings.createdAt" }
        }
      },
      {
        $project: {
          password: 0,
          verifyOtp: 0,
          otpExpiry: 0,
          bookings: 0,
        }
      },
      {
        $facet: {
          data: [
            { $skip: (page - 1) * limit },
            { $limit: limit }
          ],
          total: [
            { $count: "count" }
          ]
        }
      }
    ])

    const customers = result.data
    const total = result.total[0]?.count ?? 0

    return successResponse(customers, {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })

  } catch (error) {
    return errorResponse("Failed to fetch customers")
  }
}