import { cookies }   from "next/headers"
import { jwtVerify } from "jose"

export interface User {
  id:    string
  email: string
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export default async function getUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token       = cookieStore.get("token")?.value

    if (!token) return null

    const { payload } = await jwtVerify(token, secret)

    return {
      id:    payload.sub   as string,
      email: payload.email as string,
    }

  } catch {
    return null
  }
}