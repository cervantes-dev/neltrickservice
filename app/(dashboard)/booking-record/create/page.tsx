"use client"
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { ArrowBack } from "@mui/icons-material";
import BookingForm from "@/components/admin/booking-record/booking-form";

export default function BookingCreatePage() {
    const router = useRouter()

    return (
        < section>
            <Card>
                <CardHeader>
                    <Button
                        icon={<ArrowBack sx={{ fontSize: 18 }} />}
                        size="xs"
                        variant="outline"
                        onClick={() => router.back()}
                    />

                </CardHeader>
                <CardContent>
                    <BookingForm />
                </CardContent>
            </Card>
        </section >
    )

}