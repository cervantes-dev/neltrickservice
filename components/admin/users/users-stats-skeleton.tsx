// components/users/users-stats-skeleton.tsx
import { Card } from "@/components/ui/Card"

export function UsersStatsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[0, 1, 2].map((i) => (
        <Card key={i}>
          <div className="flex items-center justify-between">

            <div className="space-y-2">
              <div className="animate-pulse bg-gray-200 rounded h-3 w-16" />
              <div className="animate-pulse bg-gray-200 rounded h-6 w-10" />
            </div>

            <div className="animate-pulse bg-gray-200 rounded-full h-8 w-8" />

          </div>
        </Card>
      ))}
    </div>
  )
}