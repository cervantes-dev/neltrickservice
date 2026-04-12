import { Skeleton } from "@/components/ui/Skeleton"
import { Table, TableHeader, TableHead, TableBody, TableCell, TableRow } from "@/components/ui/Table"

export default function CustomersTableSkeleton() {
    return (
        <>
            {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>

                    {/* Customer */}
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                        </div>
                    </TableCell>

                    {/* Total Bookings */}
                    <TableCell>
                        <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" />
                    </TableCell>

                    {/* Last Booking */}
                    <TableCell>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </TableCell>

                    {/* Joined */}
                    <TableCell>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                        <div className="h-6 w-6 bg-gray-200 rounded animate-pulse ml-auto" />
                    </TableCell>

                </TableRow>
            ))}
        </>
    )
}