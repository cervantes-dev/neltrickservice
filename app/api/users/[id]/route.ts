import connectionToDatabase from "@/libs/db";
import User from "@/libs/model/user";
import { successResponse, errorResponse } from "@/libs/helpers/api-response";

type Params = { params: Promise<{ id: string }> }; // 👈 params is now a Promise

export async function DELETE(req: Request, { params }: Params) {
  try {
    await connectionToDatabase();

    const { id } = await params;

    const user = await User.findByIdAndDelete(id);

    if (!user) return errorResponse("User not found", 404);
    return successResponse({ id });

  } catch (error) {
    return errorResponse("Failed to delete user");
  }
}