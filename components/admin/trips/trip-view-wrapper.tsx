// components/admin/trips/trip-view-wrapper.tsx
"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import TripViewClient from "./trip-view-client"

interface Props {
    id: string
}

export default function TripViewWrapper({ id }: Props) {
    const [trip, setTrip] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    async function fetchTrip() {
        try {
            const res = await axios.get(`/api/trips/${id}`)
            
            // API might return { data: trip } or { data: { trip } } — adjust accordingly
            const payload = res.data?.data ?? res.data
            
            if (!payload || !payload.route) {
                console.error("Unexpected API shape:", res.data)
                setNotFound(true)
                return
            }

            setTrip(payload)
        } catch (err) {
            console.error(err)
            setNotFound(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTrip()
    }, [id])

    if (loading) return <TripViewSkeleton />
    if (notFound || !trip) return (
        <div className="min-h-screen bg-gray-50/60 flex items-center justify-center">
            <p className="text-sm text-gray-400">Trip not found.</p>
        </div>
    )

    return <TripViewClient trip={trip} onRefresh={fetchTrip} />
}

function TripViewSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50/60">
            <div className="max-w-5xl mx-auto px-4 py-6 space-y-5 animate-pulse">
                <div className="h-8 w-48 bg-gray-200 rounded-lg" />
                <div className="h-40 bg-gray-200 rounded-2xl" />
                <div className="grid grid-cols-3 gap-5">
                    <div className="col-span-2 h-64 bg-gray-200 rounded-2xl" />
                    <div className="h-64 bg-gray-200 rounded-2xl" />
                </div>
            </div>
        </div>
    )
}