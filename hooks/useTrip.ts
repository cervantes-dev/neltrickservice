import { useState, useEffect } from "react";
import axios from "axios";

type Trip = {
    _id: string
    tripId: string
    route: {
        origin: string
        destination: string
    }
    schedule: {
        departureDate: string
        departureTime: string
    }
    capacityKg: number,
    bookedCapacityKg: number
    status: string
    createdAt: string
}

export function useTrip({ refresh, page, filters }: { 
    refresh: number
    page: number
    filters?: {
        status?: string
        origin?: string
        destination?: string
        dateFrom?: string
        dateTo?: string
    }
}) {
    const [trips, setTrips] = useState<Trip[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setLoading(true)

        const params = new URLSearchParams()
        params.set("page", String(page))
        params.set("limit", "10")
        if (filters?.status) params.set("status", filters.status)
        if (filters?.origin) params.set("origin", filters.origin)
        if (filters?.destination) params.set("destination", filters.destination)
        if (filters?.dateFrom) params.set("dateFrom", filters.dateFrom)
        if (filters?.dateTo) params.set("dateTo", filters.dateTo)

        axios.get(`/api/trips?${params.toString()}`)
            .then(res => {
                setTrips(res.data.data.trips)
                setTotalCount(res.data.data.totalCount)
                setTotalPages(res.data.data.totalPages)
            })
            .catch(() => setError("Failed to load trips"))
            .finally(() => setLoading(false))
    }, [refresh, page, filters])

    return { trips, totalCount, totalPages, loading, error }
}