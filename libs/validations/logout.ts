'use server'
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { jwtVerify } from "jose"
import connectionToDatabase from "@/libs/db"
import User from "@/libs/model/user"

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function logout() {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (token) {
        try {
            const { payload } = await jwtVerify(token, secret)

            // Bump tokenVersion in DB — invalidates all old tokens
            await connectionToDatabase()
            await User.findByIdAndUpdate(payload.sub, {
                $inc: { tokenVersion: 1 }
            })
        } catch {
            // token already invalid, just continue to clear cookie
        }
    }

    cookieStore.delete("token")
    redirect("/")
}