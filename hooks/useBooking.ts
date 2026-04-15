import { useState, useEffect } from "react"
import axios from "axios"
import { BookingType } from "@/libs/types/booking.type"

export function useBooking({ refresh, page }: { refresh: number; page: number }) {
    const [bookings, setBookings] = useState<BookingType[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setLoading(true)
        axios.get(`/api/booking-record?page=${page}&limit=10`)
            .then(res => {
                setBookings(res.data.data.bookings)
                setTotalCount(res.data.data.totalCount)
                setTotalPages(res.data.data.totalPages)
            })
            .catch(() => setError("Failed to load bookings"))
            .finally(() => setLoading(false))
    }, [refresh, page])

    return { bookings, totalCount, totalPages, loading, error }
}