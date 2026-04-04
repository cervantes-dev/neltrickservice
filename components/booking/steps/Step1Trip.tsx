"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import Button from "@/components/ui/Button"

interface Trip {
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
    capacityKg: number
    bookedKg: number
}

interface Step1Props {
    data: {
        origin: string
        destination: string
        tripId: string
        departure: string
    }
    onNext: (fields: {
        tripId: string
        departure: string
        origin: string
        destination: string
    }) => void
}

export default function Step1Trip({ data, onNext }: Step1Props) {
    const [selectedId, setSelectedId] = useState<string>(data.tripId)
    const [trips, setTrips] = useState<Trip[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setLoading(true)
        axios.get("/api/trips?upcoming=true")
            .then(res => setTrips(res.data.data.trips))
            .catch(() => setError("Failed to load trips"))
            .finally(() => setLoading(false))
    }, [])

    function handleNext() {
        const trip = trips.find(t => t.tripId === selectedId)
        if (!trip) return
        onNext({
            tripId: trip.tripId,
            departure: `${new Date(trip.schedule.departureDate).toLocaleDateString("en-US", {
                month: "short", day: "2-digit", year: "numeric"
            })} · ${new Date(`1970-01-01T${trip.schedule.departureTime}`).toLocaleTimeString("en-US", {
                hour: "numeric", minute: "2-digit", hour12: true
            })}`,
            origin: trip.route.origin,
            destination: trip.route.destination,
        })
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-1">
                Select a scheduled trip
            </h2>
            <p className="text-xs text-gray-400 mb-6">
                Each truck carries packages from multiple clients.
                You only pay for the space your cargo needs.
            </p>

            {loading && <p className="text-xs text-gray-400 text-center py-6">Loading trips...</p>}
            {error && <p className="text-xs text-red-500 text-center py-6">{error}</p>}

            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {trips.map((trip) => (
                        <div
                            key={trip._id}
                            onClick={() => setSelectedId(trip.tripId)}
                            className={`
                                border rounded-xl p-4 cursor-pointer transition-colors duration-150
                                ${selectedId === trip.tripId
                                    ? "border-green-600 bg-green-50"
                                    : "border-gray-200 hover:border-gray-300 bg-white"
                                }
                            `}
                        >
                            <p className={`text-sm font-medium mb-0.5
                                ${selectedId === trip.tripId ? "text-green-700" : "text-gray-900"}
                            `}>
                                {trip.route.origin} → {trip.route.destination}
                            </p>
                            <p className="text-xs text-gray-400 mb-3">
                                Departs {new Date(trip.schedule.departureDate).toLocaleDateString("en-US", {
                                    month: "short", day: "2-digit", year: "numeric"
                                })} · {new Date(`1970-01-01T${trip.schedule.departureTime}`).toLocaleTimeString("en-US", {
                                    hour: "numeric", minute: "2-digit", hour12: true
                                })}
                            </p>
                            {(() => {
                                const usedPercent = Math.round((trip.bookedKg / trip.capacityKg) * 100);
                                const availableKg = trip.capacityKg - trip.bookedKg;
                                return (
                                    <>
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full mb-1">
                                            <div
                                                className={`h-1.5 rounded-full transition-all
                                                    ${usedPercent >= 85 ? "bg-amber-400" : "bg-green-600"}
                                                `}
                                                style={{ width: `${usedPercent}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            {usedPercent}% full · {availableKg} kg available
                                        </p>
                                    </>
                                );
                            })()}
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">Step 1 of 4</p>
                <Button onClick={handleNext} disabled={!selectedId || loading}>
                    Continue
                </Button>
            </div>
        </div>
    )
}