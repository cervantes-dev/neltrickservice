'use server'
import z from "zod"
import { cookies } from "next/headers"
import { SignJWT } from "jose"
import connectionToDatabase from "@/libs/db"
import User from "@/libs/model/user"
import bcrypt from "bcrypt"

export type LoginState = {
    message: string | null
    success?: boolean
    errors: {
        email?: string[]
        password?: string[]
    }
}

const schema = z.object({
    email: z.email('Invalid email address'),
    password: z.string({ error: 'Invalid password' })
        .min(1, 'Password is required'),
})

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function validateLogin(initialState: LoginState, formData: FormData): Promise<LoginState> {
    const validatedFields = schema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!validatedFields.success) { 
        return {
            errors: z.flattenError(validatedFields.error).fieldErrors,
            message: null,
        }
    }

    const { email, password } = validatedFields.data

    try {
        await connectionToDatabase()

        const user = await User.findOne({ email })
        if (!user) {
            return { message: 'User not registered', errors: {} }
        }

        if (!user.isVerified) {
            return { message: 'Please verify your email first', errors: {} }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return { message: 'Wrong password', errors: {} }  
        }

        // Generate JWT
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

        return { message: 'Login successful', success: true, errors: {} }

    } catch (err) {
        return { message: 'Something went wrong. Please try again.', errors: {} }
    }
}