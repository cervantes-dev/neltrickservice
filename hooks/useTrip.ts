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


export function useTrip({ refresh }: { refresh: number }) {  // ← idagdag ang param
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        axios.get("/api/trips")
            .then(res => setTrips(res.data.data.trips))
            .catch(() => setError("Failed to load trips"))
            .finally(() => setLoading(false));
    }, [refresh]);

    return { trips, loading, error };  // ← idagdag ang return
}