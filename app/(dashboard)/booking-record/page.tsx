import Link from "next/link";
import BookingRecordTable from "@/components/admin/booking-record/booking-record-table"
import BookingRecordPagination from "@/components/admin/booking-record/booking-record-pagination"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card"
import BookingStats from "@/components/admin/booking-record/booking-stats";
import Button from "@/components/ui/Button";
import { Add } from "@mui/icons-material";
import BookingRecordClient from "@/components/admin/booking-record/booking-record-client";

interface Props {
    searchParams: Promise<{ page?: string }>;
}

export default async function BookingRecord({ searchParams }: Props) {
    const { page: pageParam } = await searchParams;  // ← await it
    const page = Number(pageParam ?? 1);
    const { data, total } = await BookingRecordTable({ page });

    return (
        <section className="flex flex-col gap-4">
            <BookingStats />
            <Card>
                <CardHeader action={
                    <Link href="/booking-record/create">
                        <Button size="xs" icon={<Add fontSize="small" />}>
                            Create Booking
                        </Button>
                    </Link>
                }>
                    Booking Record
                </CardHeader>
                <CardContent>
                    <BookingRecordClient bookings={data} />
                </CardContent>
                <CardFooter>
                    <BookingRecordPagination total={total} perPage={10} />
                </CardFooter>
            </Card>
        </section>
    )
}
