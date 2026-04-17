"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookingType, BookingPackageType } from "@/libs/types/booking.type";
import { ArrowBack, Edit, Delete, LocalShipping, Inventory2, Person, Payment, ReceiptLong } from "@mui/icons-material";
import Button from "@/components/ui/Button";
import BookingEditDrawer from "./booking-edit-drawer"
import { Modal, ModalTrigger, ModalHeader, ModalOverlay, ModalContent } from "@/components/ui/Modal";
import BookingDeleteConfirm from "./booking-delete-cofirm"
import { WarningAmber } from "@mui/icons-material";
interface Props {
    booking: BookingType;
}

const STATUS_CONFIG: Record<string, { label: string; cls: string; dot: string }> = {
    pending: { label: "Pending", cls: "bg-amber-50 text-amber-700 border border-amber-200", dot: "bg-amber-400" },
    in_transit: { label: "In transit", cls: "bg-violet-50 text-violet-700 border border-violet-200", dot: "bg-violet-500" },
    delivered: { label: "Delivered", cls: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
    cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-600 border border-red-200", dot: "bg-red-400" },
}

export default function BookingViewClient({ booking }: Props) {
    const router = useRouter();
    const status = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
    const [editingBooking, setEditingBooking] = useState<BookingType | null>(null)
    const [refresh, setRefresh] = useState(0)

    return (
        <>
            <div className="min-h-screen bg-gray-50/60">
                <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">

                    {/* ── Top bar ── */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.back()}
                                className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-all"
                            >
                                <ArrowBack sx={{ fontSize: 15 }} />
                            </button>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm font-semibold text-brand-green tracking-tight">
                                        {booking.bookingRef}
                                    </span>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${status.cls}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                        {status.label}
                                    </span>
                                </div>
                                <p className="text-[11px] text-gray-400 mt-0.5 font-mono">{booking.tripId}</p>
                            </div>
                        </div>

                        {booking.status === "pending" && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditingBooking(booking)}
                                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-brand-green hover:text-brand-green transition-all"
                                >
                                    <Edit sx={{ fontSize: 13 }} />
                                    Edit
                                </button>

                                <Modal>
                                    <ModalTrigger>
                                        <button
                                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                                            onClick={() => { }}
                                        >
                                            <Delete sx={{ fontSize: 13 }} />
                                            Delete
                                        </button>
                                    </ModalTrigger>

                                    <ModalOverlay>
                                        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                                            <ModalHeader>
                                                <WarningAmber className="text-red-500 bg-red-200 p-2 rounded-full" sx={{ fontSize: 40 }} /> Delete Account?
                                            </ModalHeader>
                                            <ModalContent>
                                                <BookingDeleteConfirm
                                                    bookingId={booking._id}
                                                    bookingRef={booking.bookingRef}
                                                    onSuccess={() => setRefresh(r => r + 1)}
                                                />
                                            </ModalContent>

                                        </div>
                                    </ModalOverlay>
                                </Modal>
                            </div>
                        )}
                    </div>

                    {/* ── Route hero card ── */}
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="px-6 py-5 flex items-center justify-between gap-6 flex-wrap">
                            {/* Origin */}
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-1">From</p>
                                <p className="text-xl font-semibold text-gray-800 truncate">{booking.origin}</p>
                                <p className="text-xs text-gray-400 mt-1">{booking.senderCity}</p>
                            </div>

                            {/* Arrow + departure */}
                            <div className="flex flex-col items-center gap-1 shrink-0">
                                <LocalShipping sx={{ fontSize: 20 }} className="text-brand-green" />
                                <div className="flex items-center gap-2">
                                    <span className="w-12 h-px bg-gray-200" />
                                    <span className="text-brand-green text-sm">→</span>
                                    <span className="w-12 h-px bg-gray-200" />
                                </div>
                                <p className="text-[10px] text-gray-400 font-mono">{booking.departure}</p>
                            </div>

                            {/* Destination */}
                            <div className="flex-1 min-w-0 text-right">
                                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-1">To</p>
                                <p className="text-xl font-semibold text-gray-800 truncate">{booking.destination}</p>
                                <p className="text-xs text-gray-400 mt-1">{booking.recipientName}</p>
                            </div>
                        </div>

                        {/* Stats strip */}
                        <div className="border-t border-gray-100 grid grid-cols-4 divide-x divide-gray-100">
                            {[
                                { label: "Packages", value: `${booking.packages?.length ?? 0} items` },
                                { label: "Total weight", value: `${booking.totalWeight} kg` },
                                { label: "Payment", value: booking.paymentMethod, cap: true },
                                { label: "Total amount", value: `₱${booking.totalAmount.toLocaleString()}`, green: true },
                            ].map(s => (
                                <div key={s.label} className="px-5 py-3">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">{s.label}</p>
                                    <p className={`text-sm font-semibold mt-0.5 ${s.green ? "text-brand-green" : "text-gray-700"} ${s.cap ? "capitalize" : ""}`}>
                                        {s.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Main grid ── */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                        {/* Left col — sender + recipient */}
                        <div className="md:col-span-1 space-y-5">

                            <InfoCard icon={<Person sx={{ fontSize: 14 }} />} title="Sender">
                                <Field label="Name" value={booking.senderName} />
                                <Field label="Contact" value={booking.senderContact} />
                                <Field label="Address" value={booking.senderAddress} />
                                <Field label="City" value={booking.senderCity} />
                                <Field label="Pickup" value={booking.pickupTime} capitalize />
                            </InfoCard>

                            <InfoCard icon={<Person sx={{ fontSize: 14 }} />} title="Recipient">
                                <Field label="Name" value={booking.recipientName} />
                                <Field label="Contact" value={booking.recipientContact} />
                                <Field label="Address" value={booking.recipientAddress} />
                                {booking.instructions && (
                                    <div className="mt-2 pt-2 border-t border-gray-100">
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Instructions</p>
                                        <p className="text-xs text-gray-600 leading-relaxed">{booking.instructions}</p>
                                    </div>
                                )}
                            </InfoCard>

                            {booking.userId && (
                                <InfoCard icon={<Person sx={{ fontSize: 14 }} />} title="Customer account">
                                    <Field label="Email" value={booking.userId.email ?? "—"} />
                                    <Field label="Role" value={booking.userId.role ?? "—"} capitalize />
                                </InfoCard>
                            )}
                        </div>

                        {/* Right col — packages + payment */}
                        <div className="md:col-span-2 space-y-5">

                            {/* Packages */}
                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                                    <Inventory2 sx={{ fontSize: 14 }} className="text-gray-400" />
                                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest">
                                        Packages
                                    </p>
                                    <span className="ml-auto text-[11px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-medium">
                                        {booking.packages?.length ?? 0}
                                    </span>
                                </div>

                                {(booking.packages ?? []).length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-50/70">
                                                    <th className="text-left px-5 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Description</th>
                                                    <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Boxes</th>
                                                    <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Weight</th>
                                                    <th className="text-right px-5 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {(booking.packages ?? []).map((pkg: BookingPackageType) => (
                                                    <tr key={pkg._id} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-5 py-3 text-sm text-gray-700 font-medium">{pkg.description}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-500 text-center">{pkg.boxes}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-500 text-center">{pkg.weight} kg</td>
                                                        <td className="px-5 py-3 text-sm font-semibold text-gray-800 text-right">
                                                            ₱{pkg.amount.toLocaleString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="border-t border-gray-100 bg-gray-50/50">
                                                    <td colSpan={2} className="px-5 py-3 text-xs text-gray-400">
                                                        Total weight: <span className="font-medium text-gray-600">{booking.totalWeight} kg</span>
                                                    </td>
                                                    <td colSpan={2} className="px-5 py-3 text-right">
                                                        <span className="text-sm font-bold text-brand-green">
                                                            ₱{booking.totalAmount.toLocaleString()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="px-5 py-8 text-center">
                                        <Inventory2 sx={{ fontSize: 28 }} className="text-gray-200 mb-2" />
                                        <p className="text-sm text-gray-400">No packages found.</p>
                                    </div>
                                )}
                            </div>

                            {/* Payment */}
                            <InfoCard icon={<Payment sx={{ fontSize: 14 }} />} title="Payment details">
                                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                    <Field label="Method" value={booking.paymentMethod} capitalize />
                                    <Field
                                        label="Status"
                                        value={booking.paymentStatus}
                                        capitalize
                                        valueClass={booking.paymentStatus === "paid" ? "text-emerald-600 font-semibold" : "text-red-500 font-semibold"}
                                    />
                                    <Field label="Delivery fee" value={`₱${booking.deliveryFee.toLocaleString()}`} />
                                    <Field label="Handling fee" value={`₱${booking.handlingFee.toLocaleString()}`} />
                                </div>
                                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-xs text-gray-400">Total amount</span>
                                    <span className="text-lg font-bold text-brand-green">
                                        ₱{booking.totalAmount.toLocaleString()}
                                    </span>
                                </div>
                            </InfoCard>
                        </div>
                    </div>
                </div>
            </div>

            <BookingEditDrawer
                booking={editingBooking}
                onClose={() => setEditingBooking(null)}
                onSaved={() => {
                    setEditingBooking(null)
                    setRefresh(r => r + 1)
                }}
            />
        </>
    );
}

// ── Info card ─────────────────────────────────────────────
function InfoCard({
    title,
    icon,
    children,
}: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                <span className="text-gray-400">{icon}</span>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest">{title}</p>
            </div>
            <div className="px-5 py-4 space-y-3">{children}</div>
        </div>
    );
}

// ── Field row ─────────────────────────────────────────────
function Field({
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
        <div className="flex justify-between items-baseline gap-4">
            <span className="text-[11px] text-gray-400 shrink-0">{label}</span>
            <span className={`text-xs text-right leading-relaxed
                ${capitalize ? "capitalize" : ""}
                ${bold ? "font-semibold text-gray-800" : "text-gray-600"}
                ${mono ? "font-mono text-brand-green" : ""}
                ${valueClass ?? ""}
            `}>
                {value}
            </span>
        </div>
    );
}