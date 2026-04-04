"use server"
import { StatsCard } from "../../shared/stats-card";
import { Pending, LocalShipping, DoneAll, WrongLocation } from "@mui/icons-material";

async function getStats() {
    const res = await fetch("http://localhost:3000/api/booking-record/stats", {
        cache: "no-store"
    });

    if (!res.ok) throw new Error("Failed to fetch");

    const json = await res.json();
    return json.data;
}

export default async function BookingStats() {
    const data = await getStats();

    return (
        <div className="grid sm:grid-cols-1 lg:grid-cols-4 gap-2 lg:gap-4 mb-5">
            <StatsCard
                title="Pending"
                value={data.pending}
                icon={<Pending className="text-amber-500" sx={{ fontSize: 30 }} />}
            />
            <StatsCard
                title="In Transit"
                value={data.inTransit}
                icon={<LocalShipping className="text-purple-500" sx={{ fontSize: 30 }} />}
            />
            <StatsCard
                title="Delivered"
                value={data.delivered}
                icon={<DoneAll className="text-brand-green" sx={{ fontSize: 30 }} />}
            />
            <StatsCard
                title="Canceled"
                value={data.canceled}
                icon={<WrongLocation className="text-red-500" sx={{ fontSize: 30 }} />}
            />
        </div>

    )
}