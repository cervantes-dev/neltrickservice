import { StatsCard } from "@/components/shared/stats-card";
import { DirectionsBoat, DirectionsBus, Inventory2, BarChart } from "@mui/icons-material";
import { useTripStats } from "@/hooks/useStats";
import TripStatsSkeleton from "./trip-stats-skeleton";

export default function TripStats({ refresh }: { refresh: number }) {
    const { stats, loading } = useTripStats({ refresh })
 if (loading) return <TripStatsSkeleton />

    return (
        <div className="grid sm:grid-cols-1 lg:grid-cols-4 gap-2 lg:gap-4 mb-5">

            <StatsCard
                title="Total Trips"
                value={stats.totalTrips}
                icon={<DirectionsBoat sx={{ fontSize: 16 }} />}
                iconBg="bg-green-50" iconColor="text-green-700"
                sub="+2 this week" badgeColor="green"
            />
            <StatsCard
                title="Active Trips"
                value={stats.activeTrips}
                icon={<DirectionsBus sx={{ fontSize: 16 }} />}
                iconBg="bg-blue-50" iconColor="text-blue-700"
                sub="2 draft · 0 completed" badgeColor="blue"
            />
            <StatsCard
                title="Total Capacity"
                value={`${stats.totalCapacityKg.toLocaleString()} kg`}
                icon={<Inventory2 sx={{ fontSize: 16 }} />}
                iconBg="bg-amber-50" iconColor="text-amber-700"
                sub={`across ${stats.totalTrips} trips`} badgeColor="amber"
            />
            <StatsCard
                title="Avg. Fill Rate"
                value={`${stats.avgFillRate}%`}
                icon={<BarChart sx={{ fontSize: 16 }} />}
                iconBg="bg-red-50" iconColor="text-red-600"
                sub="no bookings yet" badgeColor="red"
            />
        </div>
    )
}