"use client"
import Link from "next/link"
import { Card, CardHeader, CardContent } from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import { Add } from "@mui/icons-material"
import BookingRecordTable from "@/components/admin/booking-record/booking-record-table"

export default function BookingRecord() {
    return (
        <section className="flex flex-col gap-4">
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
                    <BookingRecordTable />
                </CardContent>
            </Card>
        </section>
    )
}