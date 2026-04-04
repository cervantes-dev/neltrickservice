import { StatsCard } from "@/components/shared/stats-card";
import { DirectionsBoat, Inventory, Percent, WarningAmber } from "@mui/icons-material";
export default function TripStats() {
    return (
        <div className="grid sm:grid-cols-1 lg:grid-cols-4 gap-2 lg:gap-4 mb-5">
            <StatsCard
                title="Total trips"
                value={0}
                icon={<DirectionsBoat />}
            />

            <StatsCard
                title="Total capacity (slots)"
                value={0}
                icon={<Inventory className="text-blue-500" />}
            />
            <StatsCard
                title="Abg. fill rate"
                value={0}
                icon={<Percent className="text-amber-500" />}
            />
            <StatsCard
                title="Critically full"
                value={0}
                 icon={<WarningAmber className="text-red-500" />}
            />
        </div>
    )
}