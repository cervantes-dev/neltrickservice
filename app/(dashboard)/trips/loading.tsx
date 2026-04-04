import TripStatsSkeleton from "@/components/admin/trips/trip-stats-skeleton"
import TripTableSkeleton from "@/components/admin/trips/table-row-skeleton"
import { Card, CardHeader, CardContent } from "@/components/ui/Card"

export default function TripsLoading() {
    return (
        <section>
            <TripStatsSkeleton />
            <Card>
                <CardHeader>
                    Trips <br />
                    <span className="text-xs text-gray-400">Manage scheduled ferry routes and capacity</span>
                </CardHeader>
                <CardContent>
                    <TripTableSkeleton />
                </CardContent>
            </Card>
        </section>
    )
}