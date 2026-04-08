import { successResponse, errorResponse } from "@/libs/helpers/api-response";
import connectionToDatabase from "@/libs/db";
import User from "@/libs/model/user";

export async function GET(req: Request) {
  try {
    await connectionToDatabase();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const limit  = Number(searchParams.get("limit")) || 10;

    const query: Record<string, unknown> = {
      role:       "customer",
      isVerified: true,
    };

    if (search.trim()) {
      query.email = { $regex: search, $options: "i" }
    }

    const users = await User.find(query)
      .select("email")
      .limit(limit)

    return successResponse(users)  // 👈 data lang, walang meta

  } catch (error) {
    return errorResponse("Failed to search customers")  // 👈 message lang
  }
}