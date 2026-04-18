import axios from "axios"

export async function fetchTripById(id: string) {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/trips/${id}`)
        return res.data
    } catch {
        return null
    }
}