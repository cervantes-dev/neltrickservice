import { useState, useEffect } from "react";
import axios from "axios";

type DashboardStats = {
    totalBookings: number
    totalTrips: number
    totalCustomer: number
    totalRevenues: number
}

type TripStats = {
    totalTrips: number
    activeTrips: number
    totalCapacityKg: number
    avgFillRate: number
}


export function useDashboardStats({ refresh }: { refresh: number }) {
    const [stats, setStats] = useState<DashboardStats>({
        totalBookings: 0,
        totalTrips: 0,
        totalCustomer: 0,
        totalRevenues: 0,
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        axios.get("/api/dashboard/stats")
            .then(res => setStats(res.data.data))
            .finally(() => setLoading(false))
    }, [refresh])

    return { stats, loading }
}

export function useTripStats({ refresh }: { refresh: number }) {
    const [stats, setStats] = useState<TripStats>({
        totalTrips: 0,
        activeTrips: 0,
        totalCapacityKg: 0,
        avgFillRate: 0,
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        axios.get("/api/trips/stats")
            .then(res => setStats(res.data.data))
            .finally(() => setLoading(false))
    }, [refresh])

    return { stats, loading }
}