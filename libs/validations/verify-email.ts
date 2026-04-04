'use server'
import z from "zod"
import { cookies } from "next/headers"
import { SignJWT } from "jose"
import connectionToDatabase from "../db"
import User from "../model/user"

export type VerifyState = {
    message: string | null
    success?: boolean
    errors: {
        otp?: string[]
    }
}

const schema = z.object({
    otp: z.string().length(6, 'Code must be 6 digits'),
    email: z.string()
})

const secret     = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function validateVerification(initialState: VerifyState, formData: FormData): Promise<VerifyState> {
    const validatedFields = schema.safeParse({
        otp: formData.get('otp'),
        email: formData.get('email'),
    })

    if (!validatedFields.success) {
        return {
            errors: z.flattenError(validatedFields.error).fieldErrors,
            message: null
        }
    }

    const { otp, email } = validatedFields.data

    try {
        await connectionToDatabase()

        const user = await User.findOne({ email })
        if (!user) {
            return { message: 'User not found', errors: {} }
        }

        if (user.verifyOtp !== otp) {
            return { message: 'Invalid code. Please try again.', errors: {} }
        }

        if (user.otpExpiry < new Date()) {
            return { message: 'Code has expired. Please request a new one.', errors: {} }
        }

        user.isVerified = true
        user.verifyOtp = null
        user.otpExpiry = null
        await user.save()

        const token = await new SignJWT({ sub: user._id.toString(), email: user.email })
                    .setProtectedHeader({ alg: 'HS256' })
                    .setIssuedAt()
                    .setExpirationTime('7d')
                    .sign(secret)
        
                // Set httpOnly cookie
                const cookieStore = await cookies()
                cookieStore.set('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                })
        
        return { message: 'Email verified successfully!', success: true, errors: {} }

    } catch (err) {
        return { message: 'Something went wrong. Please try again.', errors: {} }
    }
}