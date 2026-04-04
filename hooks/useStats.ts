import { useState, useEffect } from "react";
import axios from "axios";

type TripStats = {
    totalTrips: number
    activeTrips: number
    totalCapacityKg: number
    avgFillRate: number
}

export function useStats({ refresh }: { refresh: number }) {
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