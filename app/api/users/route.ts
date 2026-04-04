import { NextResponse } from "next/server";
import connectionToDatabase from "@/libs/db";
import User from "@/libs/model/user";

export async function GET(req: Request) {
  try {
    await connectionToDatabase();

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const verified = searchParams.get("verified"); // 👈 added
    
    // Build query
    const query: Record<string, unknown> = {};

    // Add search filter
    if (search) {
      query.email = { $regex: search, $options: "i" };
    }

    // Add verified filter
    if (verified === "true") {
      query.isVerified = true;
    } else if (verified === "false") {
      query.isVerified = false;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}