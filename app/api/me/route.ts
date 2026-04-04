import { NextResponse } from "next/server"
import { cookies }      from "next/headers"
import { jwtVerify }    from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token       = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json(
        { user: null },
        { status: 401 }
      )
    }

    const { payload } = await jwtVerify(token, secret)

    return NextResponse.json({
      user: {
        id:    payload.sub,        // matches "sub" from login
        email: payload.email,      // matches "email" from login
      }
    })

  } catch {
    return NextResponse.json(
      { user: null },
      { status: 401 }
    )
  }
}