"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"

type MonthRevenue = {
    month: string
    revenue: number
    count: number
}

type Range = "6months" | "this_year"

function useRevenueOverview({ refresh, range }: { refresh: number; range: Range }) {
    const [data, setData] = useState<MonthRevenue[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        axios
            .get(`/api/dashboard/revenue?range=${range}`)
            .then(res => setData(res.data.data.months))
            .finally(() => setLoading(false))
    }, [refresh, range])

    return { data, loading }
}

function formatPeso(value: number) {
    if (value >= 1_000_000) return `₱${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000)     return `₱${(value / 1_000).toFixed(0)}K`
    return `₱${value}`
}

type CustomTooltipProps = {
    active?: boolean
    payload?: { value: number }[]
    label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm text-xs">
            <p className="text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-gray-800 font-medium">
                ₱{payload[0].value.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}
            </p>
        </div>
    )
}

const RANGE_OPTIONS: { value: Range; label: string }[] = [
    { value: "6months",   label: "Last 6 months" },
    { value: "this_year", label: "This year"      },
]

export default function RevenueOverview({ refresh }: { refresh: number }) {
    const [range, setRange] = useState<Range>("6months")
    const [mounted, setMounted] = useState(false)                    // ← added
    const { data, loading } = useRevenueOverview({ refresh, range })

    useEffect(() => { setMounted(true) }, [])                        // ← added

    const total         = data.reduce((sum, d) => sum + d.revenue, 0)
    const totalBookings = data.reduce((sum, d) => sum + d.count, 0)

    return (
        <div className="w-full bg-white border border-gray-100 rounded-xl p-4 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-1">
                        Revenue overview
                    </p>
                    {loading ? (
                        <div className="h-6 w-32 bg-gray-100 rounded-md animate-pulse" />
                    ) : (
                        <h2 className="text-xl font-medium text-gray-800 leading-none">
                            ₱{total.toLocaleString("en-PH", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </h2>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {!loading && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                            {totalBookings} bookings
                        </span>
                    )}
                    <select
                        value={range}
                        onChange={e => setRange(e.target.value as Range)}
                        className="text-[11px] text-gray-500 border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 cursor-pointer"
                    >
                        {RANGE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Chart */}
            <div className="w-full h-48">
                {loading || !mounted ? (
                    <div className="w-full h-full bg-gray-50 rounded-lg animate-pulse" />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
                            barSize={range === "this_year" ? 18 : 28}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f3f4f6"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 10, fill: "#9ca3af" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tickFormatter={formatPeso}
                                tick={{ fontSize: 10, fill: "#9ca3af" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: "#f9fafb", radius: 6 }}
                            />
                            <Bar
                                dataKey="revenue"
                                fill="#16a34a"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 pt-2">
                <p className="text-[10px] text-gray-400">
                    {range === "this_year" ? `Jan – present · ${new Date().getFullYear()}` : "Last 6 months"} · updated live
                </p>
            </div>
        </div>
    )
}