// app/(dashboard)/trips/[id]/page.tsx
import TripViewWrapper from "@/components/admin/trips/trip-view-wrapper"

interface Props {
    params: Promise<{ id: string }>
}

export default async function TripDetailPage({ params }: Props) {
    const { id } = await params
    return <TripViewWrapper id={id} />
}