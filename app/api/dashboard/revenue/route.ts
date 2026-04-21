import { successResponse, errorResponse } from "@/libs/helpers/api-response"
import connectionToDatabase from "@/libs/db"
import { Booking } from "@/libs/model/index"
import { NextRequest } from "next/server"

type Range = "6months" | "this_year"

function getDateRange(range: Range): { from: Date; slots: { year: number; month: number; label: string }[] } {
    const now = new Date()
    const slots: { year: number; month: number; label: string }[] = []

    if (range === "this_year") {
        const from = new Date(now.getFullYear(), 0, 1) // Jan 1 of current year
        for (let m = 0; m <= now.getMonth(); m++) {
            const d = new Date(now.getFullYear(), m, 1)
            slots.push({
                year:  d.getFullYear(),
                month: d.getMonth() + 1,
                label: d.toLocaleString("en-PH", { month: "short" }),
            })
        }
        return { from, slots }
    }

    // Default: last 6 months
    const from = new Date()
    from.setMonth(from.getMonth() - 5)
    from.setDate(1)
    from.setHours(0, 0, 0, 0)

    for (let i = 5; i >= 0; i--) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        slots.push({
            year:  d.getFullYear(),
            month: d.getMonth() + 1,
            label: d.toLocaleString("en-PH", { month: "short", year: "2-digit" }),
        })
    }
    return { from, slots }
}

export async function GET(req: NextRequest) {
    try {
        await connectionToDatabase()

        const { searchParams } = new URL(req.url)
        const range = (searchParams.get("range") ?? "6months") as Range

        const { from, slots } = getDateRange(range)

        const result = await Booking.aggregate([
            { $match: { createdAt: { $gte: from } } },
            {
                $group: {
                    _id:     { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    revenue: { $sum: "$totalAmount" },
                    count:   { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            {
                $project: {
                    _id:     0,
                    year:    "$_id.year",
                    month:   "$_id.month",
                    revenue: 1,
                    count:   1,
                },
            },
        ])

        const months = slots.map(slot => {
            const found = result.find(r => r.year === slot.year && r.month === slot.month)
            return {
                month:   slot.label,
                revenue: found?.revenue ?? 0,
                count:   found?.count   ?? 0,
            }
        })

        return successResponse({ months, range })
    } catch (error) {
        console.error("[dashboard/revenue] GET error:", error)
        return errorResponse("Failed to fetch revenue overview", 500)
    }
}