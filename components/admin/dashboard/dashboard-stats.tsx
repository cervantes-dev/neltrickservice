import { StatsCard } from "@/components/shared/stats-card";
import {
    Inventory2,
    BookOnline,
    People,
    StarRate,
} from "@mui/icons-material";
import { GraphHelpers } from "next/dist/compiled/webpack/webpack";

export default function DashboardStats() {
    return (
        <div className="grid sm:grid-cols-1 lg:grid-cols-4 gap-2 lg:gap-4 mb-5">
            <StatsCard
                title="Total Bookings"
                value={0}
                icon={<BookOnline sx={{ fontSize: 24 }} />}
                iconBg="bg-green-50" iconColor="text-green-600"
                sub="Month of January" badgeColor="green"
            />
            <StatsCard
                title="Total Shipments"
                value={0}
                icon={<Inventory2 sx={{ fontSize: 24 }} />}
                iconBg="bg-blue-50" iconColor="text-blue-600"
                sub="Month of January" badgeColor="blue"
            />
            <StatsCard
                title="Total Customers"
                value={0}
                icon={<People sx={{ fontSize: 24 }} />}
                iconBg="bg-amber-50" iconColor="text-amber-600"
                sub="Month of January" badgeColor="amber"
            />
            <StatsCard
                title="Revenues"
                value={0}
                icon={<StarRate sx={{ fontSize: 24 }} />}
                iconBg="bg-blue-50" iconColor="text-blue-600"
                sub="Month of January" badgeColor="blue"
            />

        </div >
    )
}
