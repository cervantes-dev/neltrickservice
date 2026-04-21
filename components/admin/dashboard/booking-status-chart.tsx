"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

type StatusBreakdown = {
    status: string
    count: number
}

function useBookingStatus({ refresh }: { refresh: number }) {
    const [breakdown, setBreakdown] = useState<StatusBreakdown[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        axios
            .get("/api/dashboard/booking-status")
            .then(res => {
                setBreakdown(res.data.data.breakdown)
                setTotal(res.data.data.total)
            })
            .finally(() => setLoading(false))
    }, [refresh])

    return { breakdown, total, loading }
}

const STATUS_CONFIG: Record<
    string,
    { label: string; color: string; badge: string }
> = {
    pending:    { label: "Pending",    color: "#f59e0b", badge: "bg-amber-50 text-amber-700" },
    in_transit: { label: "In transit", color: "#3b82f6", badge: "bg-blue-50 text-blue-700"   },
    delivered:  { label: "Delivered",  color: "#16a34a", badge: "bg-green-50 text-green-700" },
    cancelled:  { label: "Cancelled",  color: "#ef4444", badge: "bg-red-50 text-red-600"     },
}

type CustomTooltipProps = {
    active?: boolean
    payload?: { name: string; value: number }[]
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
    if (!active || !payload?.length) return null
    const cfg = STATUS_CONFIG[payload[0].name] ?? { label: payload[0].name, badge: "" }
    return (
        <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm text-xs">
            <p className="text-gray-400 uppercase tracking-widest mb-1">{cfg.label}</p>
            <p className="text-gray-800 font-medium">{payload[0].value} bookings</p>
        </div>
    )
}

export default function BookingStatusChart({ refresh }: { refresh: number }) {
    const { breakdown, total, loading } = useBookingStatus({ refresh })
    const [mounted, setMounted] = useState(false)
    useEffect(() => { setMounted(true) }, [])

    return (
        <div className="w-full bg-white border border-gray-100 rounded-xl p-4 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-1">
                        Booking status
                    </p>
                  
                </div>
                {!loading && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        {total} Total
                    </span>
                )}
            </div>

            {/* Donut chart */}
            <div className="w-full h-40 relative">
                {loading || !mounted ? (
                    <div className="w-full h-full bg-gray-50 rounded-lg animate-pulse" />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={breakdown}
                                dataKey="count"
                                nameKey="status"
                                cx="50%"
                                cy="50%"
                                innerRadius={44}
                                outerRadius={64}
                                paddingAngle={3}
                                strokeWidth={0}
                            >
                                {breakdown.map(entry => (
                                    <Cell
                                        key={entry.status}
                                        fill={STATUS_CONFIG[entry.status]?.color ?? "#d1d5db"}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                )}
                {/* Center label */}
                {!loading && mounted && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <p className="text-base font-medium text-gray-800 leading-none">{total}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">bookings</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />
                    ))
                ) : (
                    breakdown.map(item => {
                        const cfg = STATUS_CONFIG[item.status]
                        const pct = total > 0 ? Math.round((item.count / total) * 100) : 0
                        return (
                            <div key={item.status} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-2 h-2 rounded-full shrink-0"
                                        style={{ background: cfg.color }}
                                    />
                                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cfg.badge}`}>
                                        {cfg.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] text-gray-400">{pct}%</span>
                                    <span className="text-[11px] font-medium text-gray-700 w-4 text-right">
                                        {item.count}
                                    </span>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}