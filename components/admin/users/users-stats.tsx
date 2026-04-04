"use client"
import { StatsCard } from "../../shared/stats-card";
import { Person2, People, HowToReg } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Spinner } from "../../ui/loader/spinner";
import axios from "axios";

type UserStatsData = {
    staff: number,
    customer: number,
    verified: number
}

export function UserStats() {
    const [stats, setStats] = useState<UserStatsData | null>(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await axios.get("/api/users/stats");
                setStats(res.data)
            } catch (err) {
                console.error("Failed to fetch stats")
            } finally {
                setLoading(false)
            }
        } fetchStats();

    }, []);

    if (loading) return <span><Spinner /></span>;
    if (!stats) return <p>Failed to load stats</p>;

   return (
     <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-4 mb-5">
        <StatsCard
            title="Staff"
            value={stats.staff}
            icon={<Person2 className="text-brand-green" sx={{ fontSize: 30 }} />}
        />
        <StatsCard
            title="Customers"
            value={stats.customer}
            icon={<People className="text-brand-green" sx={{ fontSize: 30 }} />}
        />
        <StatsCard
            title="Verified"
            value={stats.verified}
            icon={<HowToReg className="text-brand-green" sx={{ fontSize: 30 }} />}
        />
    </div>

   )
}