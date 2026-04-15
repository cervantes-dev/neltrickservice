"use client";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { BookingType, BookingPackageType } from "@/libs/types/booking.type";
import { ArrowBack, Edit, Delete } from "@mui/icons-material";
import Button from "@/components/ui/Button";

interface Props {
    booking: BookingType;
}

const STATUS_STYLES: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    in_transit: "bg-purple-50 text-purple-700",
    delivered: "bg-green-50 text-green-700",
    cancelled: "bg-red-50 text-red-700",
}

export default function BookingViewClient({ booking }: Props) {
    const router = useRouter();

    return (
        <section className="max-w-full mx-auto space-y-4 bg-white px-5 py-4 rounded-2xl">

            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <Button size="xs" variant="outline" onClick={() => router.back()}>
                        <ArrowBack sx={{ fontSize: 16 }} />
                    </Button>
                    <div>
                        <p className="font-mono text-sm font-medium text-brand-green">
                            {booking.bookingRef}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{booking.tripId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[booking.status] ?? ""}`}>
                        {booking.status.replace("_", " ")}
                    </span>
                    {booking.status === "pending" && (
                        <Button
                            size="xs"
                            variant="outline"
                            onClick={() => router.push(`/booking-record/${booking._id}/edit`)}
                            icon={<Edit sx={{ fontSize: 14 }} />}
                        >
                            Edit
                        </Button>
                    )}
                    {booking.status === "pending" && (
                        <Button
                            size="xs"
                            variant="danger"
                            icon={<Delete sx={{ fontSize: 14 }} />}
                        >
                            Delete
                        </Button>
                    )}
                </div>
            </div>

            {/* Top row — Trip + Payment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Section title="Trip details">
                    <Row label="Trip ID" value={booking.tripId} mono />
                    <Row label="Origin" value={booking.origin} />
                    <Row label="Destination" value={booking.destination} />
                    <Row label="Departure" value={booking.departure} />
                </Section>

                <Section title="Payment">
                    <Row label="Method" value={booking.paymentMethod} capitalize />
                    <Row
                        label="Status"
                        value={booking.paymentStatus}
                        capitalize
                        valueClass={booking.paymentStatus === "paid" ? "text-green-600" : "text-red-500"}
                    />
                    <Row label="Delivery fee" value={`₱${booking.deliveryFee.toLocaleString()}`} />
                    <Row label="Handling fee" value={`₱${booking.handlingFee.toLocaleString()}`} />
                    <div className="border-t border-gray-100 pt-2 mt-1">
                        <Row label="Total" value={`₱${booking.totalAmount.toLocaleString()}`} bold />
                    </div>
                </Section>
            </div>

            {/* Sender + Recipient */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Section title="Sender">
                    <Row label="Name" value={booking.senderName} />
                    <Row label="Contact" value={booking.senderContact} />
                    <Row label="Address" value={booking.senderAddress} />
                    <Row label="City" value={booking.senderCity} />
                    <Row label="Pickup" value={booking.pickupTime} capitalize />
                </Section>

                <Section title="Recipient">
                    <Row label="Name" value={booking.recipientName} />
                    <Row label="Contact" value={booking.recipientContact} />
                    <Row label="Address" value={booking.recipientAddress} />
                    {booking.instructions && (
                        <Row label="Instructions" value={booking.instructions} />
                    )}
                </Section>
            </div>

            {/* Packages */}
            <Section title={`Packages (${booking.packages?.length ?? 0})`}>
                {(booking.packages ?? []).length > 0 ? (
                    <table className="w-full text-sm mt-1">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left pb-2 text-xs font-medium text-gray-400">Description</th>
                                <th className="text-left pb-2 text-xs font-medium text-gray-400">Boxes</th>
                                <th className="text-left pb-2 text-xs font-medium text-gray-400">Weight</th>
                                <th className="text-right pb-2 text-xs font-medium text-gray-400">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(booking.packages ?? []).map((pkg: BookingPackageType) => (
                                <tr key={pkg._id} className="border-b border-gray-50">
                                    <td className="py-2.5 text-sm">{pkg.description}</td>
                                    <td className="py-2.5 text-sm text-gray-500">{pkg.boxes}</td>
                                    <td className="py-2.5 text-sm text-gray-500">{pkg.weight} kg</td>
                                    <td className="py-2.5 text-sm text-right font-medium">
                                        ₱{pkg.amount.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={2} className="pt-3 text-xs text-gray-400">
                                    Total weight: {booking.totalWeight} kg
                                </td>
                                <td colSpan={2} className="pt-3 text-right text-sm font-semibold">
                                    ₱{booking.totalAmount.toLocaleString()}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                ) : (
                    <p className="text-sm text-gray-400">No packages found.</p>
                )}
            </Section>

            {/* Customer — only shown for registered users */}
            {booking.userId && (
                <Section title="Customer account">
                    <Row label="Email" value={booking.userId.email ?? "—"} />
                    <Row label="Role" value={booking.userId.role ?? "—"} capitalize />
                </Section>
            )}

        </section>
    );
}

// ── Section wrapper ───────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="border border-gray-200 rounded-xl px-4 py-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest pb-3 mb-3 border-b border-gray-100">
                {title}
            </p>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

// ── Row ───────────────────────────────────────────────────
function Row({
    label,
    value,
    capitalize,
    bold,
    mono,
    valueClass,
}: {
    label: string;
    value: string;
    capitalize?: boolean;
    bold?: boolean;
    mono?: boolean;
    valueClass?: string;
}) {
    return (
        <div className="flex justify-between items-baseline gap-4 text-sm">
            <span className="text-gray-400 shrink-0">{label}</span>
            <span className={`text-right ${capitalize ? "capitalize" : ""} ${bold ? "font-semibold" : ""} ${mono ? "font-mono text-xs text-brand-green" : ""} ${valueClass ?? ""}`}>
                {value}
            </span>
        </div>
    );
}