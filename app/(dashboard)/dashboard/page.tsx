"use client"
import { useState } from "react"
import DashboardStats    from "@/components/admin/dashboard/dashboard-stats"
import RevenueOverview   from "@/components/admin/dashboard/revenue-overview"
import BookingStatusChart from "@/components/admin/dashboard/booking-status-chart"
import RecentBookings    from "@/components/admin/dashboard/recent-bookings"
import TopRoutes         from "@/components/admin/dashboard/top-routes"
import PendingPayments   from "@/components/admin/dashboard/pending-payments"

export default function DashboardPage() {
    const [refresh, setRefresh] = useState(0)

    return (
        <section className="flex flex-col gap-4">

            {/* Row 1 — stat cards */}
            <DashboardStats refresh={refresh} />

            {/* Row 2 — revenue chart + booking status donut */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <RevenueOverview refresh={refresh} />
                </div>
                <div className="lg:col-span-1">
                    <BookingStatusChart refresh={refresh} />
                </div>
            </div>

            {/* Row 3 — recent bookings + sidebar (top routes + pending payments) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <RecentBookings refresh={refresh} />
                </div>
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <TopRoutes refresh={refresh} />
                    <PendingPayments refresh={refresh} />
                </div>
            </div>

        </section>
    )
}