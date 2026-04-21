"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import axios from "axios"

type RecentBooking = {
    bookingRef: string
    route: string
    totalAmount: number
    status: "pending" | "in_transit" | "delivered" | "cancelled"
    paymentStatus: "unpaid" | "paid"
    createdAt: string
}

function useRecentBookings({ refresh }: { refresh: number }) {
    const [bookings, setBookings] = useState<RecentBooking[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        axios
            .get("/api/dashboard/recent-bookings")
            .then(res => setBookings(res.data.data.bookings))
            .finally(() => setLoading(false))
    }, [refresh])

    return { bookings, loading }
}

const STATUS_STYLES: Record<string, string> = {
    pending:    "bg-amber-50 text-amber-700",
    in_transit: "bg-blue-50 text-blue-700",
    delivered:  "bg-green-50 text-green-700",
    cancelled:  "bg-red-50 text-red-600",
}

const STATUS_LABELS: Record<string, string> = {
    pending:    "Pending",
    in_transit: "In transit",
    delivered:  "Delivered",
    cancelled:  "Cancelled",
}

const PAYMENT_STYLES: Record<string, string> = {
    unpaid: "bg-red-50 text-red-600",
    paid:   "bg-green-50 text-green-700",
}

export default function RecentBookings({ refresh }: { refresh: number }) {
    const { bookings, loading } = useRecentBookings({ refresh })

    return (
        <div className="w-full bg-white border border-gray-100 rounded-xl p-4 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
                    Recent bookings
                </p>
                <Link
                    href="/booking-record"
                    className="text-[10px] font-medium text-blue-600 hover:underline"
                >
                    View all
                </Link>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-left pb-2 font-medium text-gray-400 pr-4">Ref</th>
                            <th className="text-left pb-2 font-medium text-gray-400 pr-4">Route</th>
                            <th className="text-left pb-2 font-medium text-gray-400 pr-4">Amount</th>
                            <th className="text-left pb-2 font-medium text-gray-400 pr-4">Status</th>
                            <th className="text-left pb-2 font-medium text-gray-400">Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="border-b border-gray-50">
                                    <td className="py-2.5 pr-4"><div className="h-3.5 w-16 bg-gray-100 rounded animate-pulse" /></td>
                                    <td className="py-2.5 pr-4"><div className="h-3.5 w-28 bg-gray-100 rounded animate-pulse" /></td>
                                    <td className="py-2.5 pr-4"><div className="h-3.5 w-16 bg-gray-100 rounded animate-pulse" /></td>
                                    <td className="py-2.5 pr-4"><div className="h-4 w-16 bg-gray-100 rounded-full animate-pulse" /></td>
                                    <td className="py-2.5">    <div className="h-4 w-12 bg-gray-100 rounded-full animate-pulse" /></td>
                                </tr>
                            ))
                            : bookings.map(b => (
                                <tr key={b.bookingRef} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="py-2.5 pr-4 font-medium text-gray-700">{b.bookingRef}</td>
                                    <td className="py-2.5 pr-4 text-gray-500">{b.route}</td>
                                    <td className="py-2.5 pr-4 font-medium text-gray-700">
                                        ₱{b.totalAmount.toLocaleString("en-PH", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </td>
                                    <td className="py-2.5 pr-4">
                                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[b.status]}`}>
                                            {STATUS_LABELS[b.status]}
                                        </span>
                                    </td>
                                    <td className="py-2.5">
                                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${PAYMENT_STYLES[b.paymentStatus]}`}>
                                            {b.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                {/* Empty state */}
                {!loading && bookings.length === 0 && (
                    <div className="py-8 text-center text-[11px] text-gray-400">
                        No bookings yet
                    </div>
                )}
            </div>
        </div>
    )
}