import { Skeleton } from "@/components/ui/Skeleton"
import { Table, TableHeader, TableHead, TableBody, TableCell, TableRow } from "@/components/ui/Table"

export default function TripTableSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableHead>Trip Id</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Cargo Fill</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
            </TableHeader>
            <TableBody>
                {Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell>
                            <div className="flex items-center gap-1">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-3 w-3 rounded-full" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col gap-1">
                                <Skeleton className="h-5 w-24 rounded-full" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-2 w-32 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-4 rounded-full" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}