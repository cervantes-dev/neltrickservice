'use server'
import z from "zod"
import connectionToDatabase from "../db"
import User from "../model/user"
import bcrypt from "bcrypt"
import { sendVerificationEmail } from "@/libs/mailer";

export type RegisterState = {
    message: string | null
    success?: boolean
    email?: string

    errors: {
        email?: string[],
        password?: string[]
    }
}

const schema = z.object({
    email: z.email('Invalid email address'),
    password: z.string({ error: 'Invalid password' })
        .min(8, 'Password must contain 8 characters')
})

export async function validateRegister(initialState: RegisterState, formData: FormData): Promise<RegisterState> {
    const validatedFields = schema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!validatedFields.success) {
        return {
            errors: z.flattenError(validatedFields.error).fieldErrors,
            message: null
        }
    }

    const { email, password } = validatedFields.data

    try {
        await connectionToDatabase()

        const isRegistered = await User.findOne({ email })
        if (isRegistered) {
            return { message: 'Email already exist.', errors: {} }
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const otp = Math.floor(100000 + Math.random() * 900000).toString() // ✅ 6-digit code
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // ✅ 10 minutes from now

        const newUser = new User({
            email,
            password: hashedPassword,
            role: "customer",
            verifyOtp: otp,
            otpExpiry
        })

        await newUser.save()
        await sendVerificationEmail(email, otp)

        return { message: 'Register Successfully', success: true, email, errors: {} }

    } catch (err) {
        return { message: 'Something went wrong. Please try again.', errors: {} }
    }

}