"use client"

import { useEffect, useState } from "react"
import axios from "axios"

type RouteItem = {
    route: string
    count: number
    percentage: number
}

function useTopRoutes({ refresh }: { refresh: number }) {
    const [routes, setRoutes] = useState<RouteItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        axios
            .get("/api/dashboard/top-routes")
            .then(res => setRoutes(res.data.data.routes))
            .finally(() => setLoading(false))
    }, [refresh])

    return { routes, loading }
}

export default function TopRoutes({ refresh }: { refresh: number }) {
    const { routes, loading } = useTopRoutes({ refresh })

    return (
        <div className="w-full bg-white border border-gray-100 rounded-xl p-4 flex flex-col gap-4">
            {/* Header */}
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
                Top routes
            </p>

            {/* Routes */}
            <div className="flex flex-col gap-3">
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex flex-col gap-1.5">
                            <div className="flex justify-between">
                                <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                                <div className="h-3 w-6 bg-gray-100 rounded animate-pulse" />
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full animate-pulse" />
                        </div>
                    ))
                    : routes.length === 0
                        ? (
                            <div className="py-6 text-center text-[11px] text-gray-400">
                                No route data yet
                            </div>
                        )
                        : routes.map(r => (
                            <div key={r.route} className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-gray-500 truncate max-w-[75%]">
                                        {r.route}
                                    </span>
                                    <span className="text-[11px] font-medium text-gray-700">
                                        {r.count}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                        style={{ width: `${r.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))
                }
            </div>
        </div>
    )
}