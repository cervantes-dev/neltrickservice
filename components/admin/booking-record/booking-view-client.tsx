"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { BookingType, BookingPackageType } from "@/libs/types/booking.type";
import { ArrowBack, Edit, Delete } from "@mui/icons-material";
import Button from "@/components/ui/Button";

interface Props {
    booking: BookingType;
}

export default function BookingViewClient({ booking }: Props) {
    const router = useRouter();

    return (
        <section className="max-w-5xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                            <Button
                                size="xs"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                <ArrowBack sx={{ fontSize: 16 }} />
                            </Button>
                            <div>
                                <p className="font-medium text-sm">{booking.bookingRef}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{booking.tripId}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {["pending", "confirmed"].includes(booking.status) && (
                                <button
                                    onClick={() => router.push(`/booking-record/${booking._id}/edit`)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                    <Edit fontSize="small" />
                                    Edit
                                </button>
                            )}
                            {["pending", "cancelled"].includes(booking.status) && (
                                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50">
                                    <Delete fontSize="small" />
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="w-full border border-gray-300 shadow-sm flex items-center gap-3 px-3 py-3 rounded-lg">
                        <span className={`
                            px-3 py-1 rounded-full text-xs font-medium capitalize
                            ${booking.status === "pending" ? "bg-amber-50 text-amber-700" : ""}
                            ${booking.status === "confirmed" ? "bg-blue-50 text-blue-700" : ""}
                            ${booking.status === "in_transit" ? "bg-purple-50 text-purple-700" : ""}
                            ${booking.status === "delivered" ? "bg-green-50 text-green-700" : ""}
                            ${booking.status === "cancelled" ? "bg-red-50 text-red-700" : ""}
                        `}>
                            {booking.status.replace("_", " ")}
                        </span>
                        <span className="text-sm text-gray-500">
                            Booked on {new Date(booking.createdAt).toLocaleDateString("en-US", {
                                month: "long", day: "numeric", year: "numeric"
                            })}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mt-5">
                        <div className="border border-gray-300 rounded-lg px-3 py-4">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest border-b border-b-gray-300 py-2 mb-2">
                                Trip details
                            </p>
                            <div className="space-y-3">
                                <Row label="Trip ID" value={booking.tripId} />
                                <Row label="Origin" value={booking.origin} />
                                <Row label="Destination" value={booking.destination} />
                                <Row label="Departure" value={booking.departure} />
                            </div>
                        </div>
                        <div className="border border-gray-300 rounded-lg px-3 py-4">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest border-b border-b-gray-300 py-2 mb-2">
                                Payment
                            </p>
                            <div className="space-y-3">
                                <Row label="Method" value={booking.paymentMethod} capitalize />
                                <Row label="Status" value={booking.paymentStatus} capitalize />
                                <Row label="Delivery fee" value={`₱${booking.deliveryFee.toLocaleString()}`} />
                                <Row label="Handling fee" value={`₱${booking.handlingFee.toLocaleString()}`} />
                                <hr className="border-gray-100" />
                                <Row label="Total amount" value={`₱${booking.totalAmount.toLocaleString()}`} bold />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mt-5">
                        <div className="border border-gray-300 rounded-lg px-3 py-4">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest border-b border-b-gray-300 py-2 mb-2">
                                Sender
                            </p>
                            <div className="space-y-3">
                                <Row label="Name" value={booking.senderName} />
                                <Row label="Contact" value={booking.senderContact} />
                                <Row label="Address" value={booking.senderAddress} />
                                <Row label="City" value={booking.senderCity} />
                                <Row label="Pickup" value={booking.pickupTime} capitalize />
                            </div>
                        </div>
                        <div className="border border-gray-300 rounded-lg px-3 py-4">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest border-b border-b-gray-300 py-2 mb-2">
                                Recipient
                            </p>
                            <div className="space-y-3">
                                <Row label="Name" value={booking.recipientName} />
                                <Row label="Contact" value={booking.recipientContact} />
                                <Row label="Address" value={booking.recipientAddress} />
                                {booking.instructions && (
                                    <Row label="Instructions" value={booking.instructions} />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="border border-gray-300 rounded-lg px-3 py-4 mt-5">
                        <div className="space-y-4">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                                Packages ({booking.packages?.length ?? 0})
                            </p>
                            {booking.packages && booking.packages.length > 0 ? (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left pb-3 text-xs font-medium text-gray-400">Description</th>
                                            <th className="text-left pb-3 text-xs font-medium text-gray-400">Weight</th>
                                            <th className="text-left pb-3 text-xs font-medium text-gray-400">Boxes</th>
                                            <th className="text-right pb-3 text-xs font-medium text-gray-400">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {booking.packages.map((pkg: BookingPackageType) => (
                                            <tr key={pkg._id} className="border-b border-gray-300">
                                                <td className="py-3">{pkg.description}</td>
                                                <td className="py-3 text-gray-500">{pkg.weight} kg</td>
                                                <td className="py-3 text-gray-500">{pkg.boxes}</td>
                                                <td className="py-3 text-right font-medium">
                                                    ₱{pkg.amount.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan={3} className="pt-3 text-xs text-gray-400">
                                                Total weight: {booking.totalWeight} kg
                                            </td>
                                            <td className="pt-3 text-right font-semibold text-sm">
                                                ₱{booking.totalAmount.toLocaleString()}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            ) : (
                                <p className="text-sm text-gray-400">No packages found.</p>
                            )}
                        </div>
                    </div>
                     <div className="border border-gray-300 rounded-lg px-3 py-4 mt-5">
                        <div className="space-y-4">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest border-b border-b-gray-300 py-2 mb-2">
                                Customer
                            </p>
                            <div className="space-y-3">
                                <Row label="Email" value={booking.userId.email} />
                                <Row label="Role" value={booking.userId.role} capitalize />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}

// ── Reusable Row ─────────────────────────────
function Row({
    label,
    value,
    capitalize,
    bold,
}: {
    label: string;
    value: string;
    capitalize?: boolean;
    bold?: boolean;
}) {
    return (
        <div className="flex justify-between items-baseline gap-4 text-sm">
            <span className="text-gray-400 shrink-0">{label}</span>
            <span className={`
                text-right
                ${capitalize ? "capitalize" : ""}
                ${bold ? "font-semibold" : ""}
            `}>
                {value}
            </span>
        </div>
    );
}