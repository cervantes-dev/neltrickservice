import { UsersStatsSkeleton } from "@/components/admin/users/users-stats-skeleton"
import { UsersTablesSkeleton } from "@/components/admin/users/users-tables-skeleton"
import { UsersPaginationSkeleton } from "@/components/admin/users/users-pagination-skeleton"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card"

export default function Loading() {
  return (
    <section>
      <UsersStatsSkeleton />
      <Card>
        <CardHeader>User List</CardHeader>
        <CardContent>
          <UsersTablesSkeleton />
        </CardContent>
        <CardFooter>
          <UsersPaginationSkeleton />
        </CardFooter>
      </Card>
    </section>
  )
}