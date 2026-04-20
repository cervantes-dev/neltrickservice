// components/admin/trips/trip-view-skeleton.tsx
export default function TripViewSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50/60">
            <div className="max-w-5xl mx-auto px-4 py-6 space-y-5 animate-pulse">
                <div className="h-8 w-48 bg-gray-200 rounded-lg" />
                <div className="h-40 bg-gray-200 rounded-2xl" />
                <div className="grid grid-cols-3 gap-5">
                    <div className="col-span-2 h-64 bg-gray-200 rounded-2xl" />
                    <div className="h-64 bg-gray-200 rounded-2xl" />
                </div>
            </div>
        </div>
    )
}