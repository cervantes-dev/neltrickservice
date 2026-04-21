import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

const protectedRoutes = ["/dashboard", "/trips", "/booking-record", "/tracking", "/customers", "/users", "/settings"]
const authRoutes = ["/"]

export default async function proxy(request: NextRequest) {  // 👈 default export named proxy
    const { pathname } = request.nextUrl
    const token = request.cookies.get("token")?.value

    const isProtected = protectedRoutes.some((r) => pathname.startsWith(r))
    const isAuthRoute = authRoutes.some((r) => pathname === r)

    let isValid = false

    if (token) {
        try {
            await jwtVerify(token, secret)
            isValid = true
        } catch {
            isValid = false
        }
    }

    if (isProtected && !isValid) {
        const url = request.nextUrl.clone()
        url.pathname = "/"
        const response = NextResponse.redirect(url)
        response.cookies.delete("token")
        return response
    }

    if (isAuthRoute && isValid) {
        const url = request.nextUrl.clone()
        url.pathname = "/dashboard"
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
    ],
}