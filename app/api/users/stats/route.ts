import { NextResponse } from "next/server";
import connectionToDatabase from "@/libs/db";
import User from "@/libs/model/user";

export async function GET(req: Request) {
  try {
    await connectionToDatabase();

    const staff = await User.countDocuments({ role: "staff" });
    const customer = await User.countDocuments({ role: "customer"});
    const verified = await User.countDocuments({ isVerified: true });

    return NextResponse.json({
      success: true,
      staff,
      customer,
      verified,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user stats" },
      { status: 500 }
    );
  }
}