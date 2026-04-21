"use client"

import { StatsCard } from "@/components/shared/stats-card"
import { Inventory2, BookOnline, People, Assessment } from "@mui/icons-material"
import { useDashboardStats } from "@/hooks/useStats";

function formatPeso(amount: number) {
    return "₱" + amount.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

export default function DashboardStats({ refresh }: { refresh: number }) {
    const { stats, loading } = useDashboardStats({ refresh })

    return (
        <div className="grid sm:grid-cols-1 lg:grid-cols-4 gap-2 lg:gap-4 mb-5">
            <StatsCard
                title="Total Bookings"
                value={stats.totalBookings}
                icon={<BookOnline sx={{ fontSize: 24 }} />}
                iconBg="bg-green-50" iconColor="text-green-600"
                sub="Month of January" badgeColor="green"
            />
            <StatsCard
                title="Total Active Trips"
                value={stats.totalTrips}
                icon={<Inventory2 sx={{ fontSize: 24 }} />}
                iconBg="bg-blue-50" iconColor="text-blue-600"
                sub="Month of January" badgeColor="blue"
            />
            <StatsCard
                title="Total Customers"
                value={stats.totalCustomer}
                icon={<People sx={{ fontSize: 24 }} />}
                iconBg="bg-amber-50" iconColor="text-amber-600"
                sub="Month of January" badgeColor="amber"
            />
            <StatsCard
                title="Revenues"
                value={formatPeso(stats.totalRevenues)}
                icon={<Assessment sx={{ fontSize: 24 }} />}
                iconBg="bg-blue-50" iconColor="text-red-600"
                sub="Month of January" badgeColor="red"
            />
        </div>
    )
}