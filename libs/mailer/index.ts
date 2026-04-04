import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD,
    }
})

export const sendVerificationEmail = async (email: string, otp: string) => {
    await transporter.sendMail({
        from: process.env.MAILER_EMAIL,
        to: email,
        subject: "Your verification code",
        html: `
            <h2>Email Verification</h2>
            <p>Your 6-digit verification code is:</p>
            <h1 style="letter-spacing: 8px">${otp}</h1>
            <p>This code expires in 10 minutes.</p>
        `
    })
}