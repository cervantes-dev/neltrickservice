"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { ErrorOutline } from "@mui/icons-material"

type PendingPayments = {
    totalUnpaid: number
    count: number
}

function usePendingPayments({ refresh }: { refresh: number }) {
    const [data, setData] = useState<PendingPayments>({ totalUnpaid: 0, count: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        axios
            .get("/api/dashboard/pending-payments")
            .then(res => setData(res.data.data))
            .finally(() => setLoading(false))
    }, [refresh])

    return { data, loading }
}

export default function PendingPayments({ refresh }: { refresh: number }) {
    const { data, loading } = usePendingPayments({ refresh })

    return (
        <div className="w-full bg-white border border-gray-100 rounded-xl p-4 flex flex-col gap-3">
            {/* Header */}
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
                Pending payments
            </p>

            {/* Content */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    {loading ? (
                        <>
                            <div className="h-6 w-36 bg-gray-100 rounded-md animate-pulse" />
                            <div className="h-3 w-28 bg-gray-100 rounded animate-pulse mt-1" />
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl font-medium text-red-600 leading-none">
                                ₱{data.totalUnpaid.toLocaleString("en-PH", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </h2>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                                across {data.count} unpaid {data.count === 1 ? "booking" : "bookings"}
                            </p>
                        </>
                    )}
                </div>

                {!loading && (
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-red-50 text-red-500">
                        <ErrorOutline sx={{ fontSize: 20 }} />
                    </div>
                )}
            </div>

            {/* Footer badge */}
            <div className="border-t border-gray-100 pt-2">
                {loading ? (
                    <div className="h-4 w-20 bg-gray-100 rounded-full animate-pulse" />
                ) : (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                        {data.count > 0 ? "Needs attention" : "All cleared"}
                    </span>
                )}
            </div>
        </div>
    )
}