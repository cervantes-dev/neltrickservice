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


export function useTrip({ refresh, page }: { refresh: number, page: number }) {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/trips?page=${page}&limit=10`)
            .then(res => {
                setTrips(res.data.data.trips)
                setTotalCount(res.data.data.totalCount)
                setTotalPages(res.data.data.totalPages)
            })
            .catch(() => setError("Failed to load trips"))
            .finally(() => setLoading(false));
    }, [refresh, page]); // ← idagdag ang page

    return { trips, totalCount, totalPages, loading, error };
}