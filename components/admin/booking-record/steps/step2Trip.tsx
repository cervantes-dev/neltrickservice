"use client"
import { useState } from "react"
import Select from "@/components/ui/Select"
import Button from "@/components/ui/Button"

interface Trip {
    id: string
    route: string
    departure: string
    datetime: string
    capacity: number
    available: number
}

const TRIPS: Trip[] = [
    { id: "NLT-TRP-001", route: "Leyte → Manila", departure: "Mar 29, 2026", datetime: "Sat 6:00 AM", capacity: 62, available: 380 },
    { id: "NLT-TRP-002", route: "Leyte → Manila", departure: "Apr 1, 2026", datetime: "Tue 6:00 AM", capacity: 85, available: 150 },
    { id: "NLT-TRP-003", route: "Leyte → Manila", departure: "Apr 5, 2026", datetime: "Sat 6:00 AM", capacity: 20, available: 800 },
    { id: "NLT-TRP-004", route: "Leyte → Manila", departure: "Apr 8, 2026", datetime: "Tue 6:00 AM", capacity: 5, available: 1000 },
]

interface Step2Props {
    data: {
        tripId: string
        origin: string
        destination: string
        departure: string
    }
    onNext: (fields: {
        tripId: string
        origin: string
        destination: string
        departure: string
    }) => void
    onBack: () => void
}

export default function Step2Trip({ data, onNext, onBack }: Step2Props) {
    const [selectedId, setSelectedId] = useState<string>(data.tripId)

    function handleNext() {
        const trip = TRIPS.find(t => t.id === selectedId)
        if (!trip) return
        onNext({
            tripId: trip.id,
            departure: `${trip.departure} · ${trip.datetime}`,
            origin: data.origin,
            destination: data.destination,
        })
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">

            <h2 className="text-base font-semibold text-gray-900 mb-1">
                Select a scheduled trip
            </h2>
            <p className="text-xs text-gray-400 mb-6">
                Each truck carries packages from multiple clients.
                You only pay for the space the cargo needs.
            </p>

            {/* Origin & Destination */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Select
                    label="Origin"
                    value={data.origin}
                    options={[
                        { value: "Leyte", label: "Leyte" },
                        { value: "Cebu", label: "Cebu" },
                        { value: "Davao", label: "Davao" },
                        { value: "Iloilo", label: "Iloilo" },
                    ]}
                    onChange={() => { }}
                />
                <Select
                    label="Destination"
                    value={data.destination}
                    options={[
                        { value: "Manila (NCR)", label: "Manila (NCR)" },
                        { value: "Cebu City", label: "Cebu City" },
                        { value: "Cagayan de Oro", label: "Cagayan de Oro" },
                    ]}
                    onChange={() => { }}
                />
            </div>

            {/* Trip cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {TRIPS.map((trip) => (
                    <div
                        key={trip.id}
                        onClick={() => setSelectedId(trip.id)}
                        className={`
              border rounded-xl p-4 cursor-pointer transition-colors duration-150
              ${selectedId === trip.id
                                ? "border-green-600 bg-green-50"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            }
            `}
                    >
                        <p className={`text-sm font-medium mb-0.5
              ${selectedId === trip.id ? "text-green-700" : "text-gray-900"}
            `}>
                            {trip.route}
                        </p>
                        <p className="text-xs text-gray-400 mb-3">
                            Departs {trip.departure} · {trip.datetime}
                        </p>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full mb-1">
                            <div
                                className={`h-1.5 rounded-full
                  ${trip.capacity >= 85 ? "bg-amber-400" : "bg-green-600"}
                `}
                                style={{ width: `${trip.capacity}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-400">
                            {trip.capacity}% full · {trip.available} kg available
                        </p>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <Button variant="ghost" onClick={onBack}>
                    Back
                </Button>
                <div className="flex items-center gap-3">
                    <p className="text-xs text-gray-400">Step 2 of 5</p>
                    <Button
                        onClick={handleNext}
                        disabled={!selectedId}
                    >
                        Continue
                    </Button>
                </div>
            </div>

        </div>
    )
}