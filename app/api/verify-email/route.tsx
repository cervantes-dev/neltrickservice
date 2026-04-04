// app/api/verify-email/route.ts
import connectionToDatabase from "@/libs/db";
import User from "@/libs/model/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await connectionToDatabase()
        const { email, otp } = await request.json()

        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            )
        }

        if (user.verifyOtp !== otp) {
            return NextResponse.json(
                { message: "Invalid code" },
                { status: 400 }
            )
        }

        if (user.otpExpiry < new Date()) {
            return NextResponse.json(
                { message: "Code has expired" },
                { status: 400 }
            )
        }

        user.isVerified = true
        user.verifyOtp = undefined  // ✅ clear otp
        user.otpExpiry = undefined  // ✅ clear expiry
        await user.save()

        return NextResponse.json(
            { message: "Email verified successfully" },
            { status: 200 }
        )

    } catch (err) {
        console.log(err)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}