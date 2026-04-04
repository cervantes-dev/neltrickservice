"use client"
import { useState, useRef, useEffect } from "react"
import { FilterList, Close } from "@mui/icons-material"
import Button from "@/components/ui/Button"

interface TripFilterProps {
    filters: {
        status: string
        origin: string
        destination: string
        dateFrom: string
        dateTo: string
    }
    onChange: (filters: TripFilterProps["filters"]) => void
    onClear: () => void
    hasActive: boolean
}

export default function TripFilter({ filters, onChange, onClear, hasActive }: TripFilterProps) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    // close kapag nag-click sa labas
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    function handleChange(key: keyof TripFilterProps["filters"], value: string) {
        onChange({ ...filters, [key]: value })
    }

    return (
        <div className="relative" ref={ref}>
            <Button
                variant="outline"
                size="xs"
                onClick={() => setOpen(prev => !prev)}
            >
                <FilterList fontSize="small" />
                Filter
                {hasActive && (
                    <span className="ml-1 w-2 h-2 rounded-full bg-green-500 inline-block" />
                )}
            </Button>

            {open && (
                <div className="absolute right-0 top-10 z-50 w-72 bg-white border border-gray-100 rounded-xl shadow-lg p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">Filters</p>
                        {hasActive && (
                            <button
                                onClick={onClear}
                                className="text-xs text-red-500 hover:text-red-600 flex items-center gap-0.5"
                            >
                                <Close sx={{ fontSize: 12 }} /> Clear all
                            </button>
                        )}
                    </div>

                    {/* Status */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">Status</label>
                        <select
                            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-400"
                            value={filters.status}
                            onChange={e => handleChange("status", e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="draft">Draft</option>
                            <option value="active">Active</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    {/* Origin */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">Origin</label>
                        <input
                            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-400"
                            placeholder="e.g. Leyte"
                            value={filters.origin}
                            onChange={e => handleChange("origin", e.target.value)}
                        />
                    </div>

                    {/* Destination */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">Destination</label>
                        <input
                            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-400"
                            placeholder="e.g. Manila"
                            value={filters.destination}
                            onChange={e => handleChange("destination", e.target.value)}
                        />
                    </div>

                    {/* Date range */}
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] text-gray-400">From</span>
                            <input
                                type="date"
                                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-400"
                                value={filters.dateFrom}
                                onChange={e => handleChange("dateFrom", e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] text-gray-400">To</span>
                            <input
                                type="date"
                                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-400"
                                value={filters.dateTo}
                                onChange={e => handleChange("dateTo", e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}