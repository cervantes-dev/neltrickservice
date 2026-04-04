// components/admin/trips/trips-stats-skeleton.tsx
import { Skeleton } from "@/components/ui/Skeleton"
export default function TripStatsSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 sm:p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-7 w-7 rounded-lg" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                    <div className="border-t border-gray-100 pt-1.5">
                        <Skeleton className="h-4 w-24 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    )
}