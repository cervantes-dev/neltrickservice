"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowBack, Edit } from "@mui/icons-material"
import { Modal, ModalTrigger, ModalHeader, ModalOverlay, ModalContent } from "@/components/ui/Modal"
import UpdateStatusForm from "@/components/admin/trips/trip-update-form"
import TripEdit from "@/components/admin/trips/trip-edit"
import axios from "axios"

const TRIP_STATUS_CONFIG: Record<string, { label: string; cls: string; dot: string }> = {
    draft: { label: "Draft", cls: "bg-gray-100 text-gray-600 border border-gray-200", dot: "bg-gray-400" },
    active: { label: "Active", cls: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
    in_transit: { label: "In transit", cls: "bg-amber-50 text-amber-700 border border-amber-200", dot: "bg-amber-400" },
    completed: { label: "Completed", cls: "bg-blue-50 text-blue-700 border border-blue-200", dot: "bg-blue-400" },
    cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-600 border border-red-200", dot: "bg-red-400" },
}

const BOOKING_STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
    pending: { label: "Pending", cls: "bg-amber-50 text-amber-700 border border-amber-200" },
    in_transit: { label: "In transit", cls: "bg-violet-50 text-violet-700 border border-violet-200" },
    delivered: { label: "Delivered", cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
    cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-600 border border-red-200" },
}

interface Props {
    trip: any
    onRefresh: () => void
}

export default function TripViewClient({ trip, onRefresh }: Props) {
    const router = useRouter()
    const status = TRIP_STATUS_CONFIG[trip.status] ?? TRIP_STATUS_CONFIG.draft

    const bookings = trip.bookings ?? []
    const deliveredCount = bookings.filter((b: any) => b.status === "delivered").length
    const totalRevenue = bookings.reduce((sum: number, b: any) => sum + b.totalAmount, 0)
    const fillPct = Math.min((trip.bookedCapacityKg / trip.capacityKg) * 100, 100)

    const TIMELINE = [
        { key: "draft", label: "Trip created", sub: "Draft — not visible to clients" },
        { key: "active", label: "Published", sub: "Accepting bookings" },
        { key: "in_transit", label: "In transit", sub: "Departed" },
        { key: "completed", label: "Completed", sub: "All packages delivered" },
    ]
    const statusOrder = ["draft", "active", "in_transit", "completed"]
    const currentIdx = statusOrder.indexOf(trip.status)

    return (
        <div className="min-h-screen bg-gray-50/60">
            <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">

                {/* Top bar */}
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
                                    {trip.tripId}
                                </span>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${status.cls}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                    {status.label}
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                                {trip.route.origin} → {trip.route.destination} · {new Date(trip.schedule.departureDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {/* Update Status */}
                        <Modal>
                            <ModalTrigger>
                                <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-brand-green hover:text-brand-green transition-all">
                                    Update Status
                                </button>
                            </ModalTrigger>
                            <ModalOverlay>
                                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                                    <ModalHeader>Update Trip Status</ModalHeader>
                                    <ModalContent>
                                        <UpdateStatusForm
                                            tripId={trip._id}
                                            currentStatus={trip.status}
                                            onSuccess={onRefresh}
                                        />
                                    </ModalContent>
                                </div>
                            </ModalOverlay>
                        </Modal>

                        {/* Edit */}
                        <Modal>
                            <ModalTrigger>
                                <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-brand-green hover:text-brand-green transition-all">
                                    <Edit sx={{ fontSize: 13 }} /> Edit
                                </button>
                            </ModalTrigger>
                            <ModalOverlay>
                                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                                    <ModalHeader>Edit Trip</ModalHeader>
                                    <ModalContent>
                                        <TripEdit
                                            tripId={trip._id}
                                            defaultValues={{
                                                origin: trip.route.origin,
                                                destination: trip.route.destination,
                                                departureDate: trip.schedule.departureDate,
                                                departureTime: trip.schedule.departureTime,
                                                capacityKg: trip.capacityKg,
                                            }}
                                            onSuccess={onRefresh}
                                        />
                                    </ModalContent>
                                </div>
                            </ModalOverlay>
                        </Modal>
                    </div>
                </div>

                {/* Route hero */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-5 flex items-center justify-between gap-6 flex-wrap">
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-1">From</p>
                            <p className="text-xl font-semibold text-gray-800">{trip.route.origin}</p>
                        </div>
                        <div className="flex flex-col items-center gap-1 shrink-0">
                            <p className="text-[10px] text-gray-400 font-mono">
                                {new Date(trip.schedule.departureDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="w-12 h-px bg-gray-200" />
                                <span className="text-brand-green text-sm">→</span>
                                <span className="w-12 h-px bg-gray-200" />
                            </div>
                            <p className="text-[10px] text-gray-400 font-mono">
                                {(() => {
                                    const [hour, minute] = trip.schedule.departureTime.split(':');
                                    const h = parseInt(hour, 10);
                                    const ampm = h >= 12 ? 'PM' : 'AM';
                                    const formattedHour = h % 12 || 12;

                                    return `${formattedHour}:${minute} ${ampm}`;
                                })()}
                            </p>
                        </div>
                        <div className="flex-1 min-w-0 text-right">
                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-1">To</p>
                            <p className="text-xl font-semibold text-gray-800">{trip.route.destination}</p>
                        </div>
                    </div>

                    {/* Capacity bar */}
                    <div className="px-6 pb-4">
                        <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                            <span>Cargo fill</span>
                            <span>{trip.bookedCapacityKg} / {trip.capacityKg} kg</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${fillPct >= 100 ? "bg-red-500" : fillPct >= 75 ? "bg-yellow-500" : "bg-brand-green"}`}
                                style={{ width: `${fillPct}%` }}
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 grid grid-cols-4 divide-x divide-gray-100">
                        {[
                            { label: "Capacity", value: `${trip.capacityKg} kg` },
                            { label: "Bookings", value: `${bookings.length} total` },
                            { label: "Delivered", value: `${deliveredCount} / ${bookings.length}`, green: deliveredCount > 0 },
                            { label: "Revenue", value: `₱${totalRevenue.toLocaleString()}`, green: true },
                        ].map(s => (
                            <div key={s.label} className="px-5 py-3">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wide">{s.label}</p>
                                <p className={`text-sm font-semibold mt-0.5 ${s.green ? "text-brand-green" : "text-gray-700"}`}>
                                    {s.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    {/* Bookings table */}
                    <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Bookings on this trip</p>
                            <span className="text-[11px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">{bookings.length}</span>
                        </div>
                        {bookings.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50/70">
                                            <th className="text-left px-5 py-2.5 text-[10px] font-semibold text-gray-400 uppercase">Ref</th>
                                            <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase">Recipient</th>
                                            <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase">Weight</th>
                                            <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase">Payment</th>
                                            <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase">Delivery</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {bookings.map((b: any) => {
                                            const bStatus = BOOKING_STATUS_CONFIG[b.status] ?? BOOKING_STATUS_CONFIG.pending
                                            return (
                                                <tr key={b._id} className="hover:bg-gray-50/50">
                                                    <td className="px-5 py-3">
                                                        <span className="font-mono text-xs text-brand-green font-medium">{b.bookingRef}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-gray-600">{b.recipientName}</td>
                                                    <td className="px-4 py-3 text-xs text-gray-500 text-center">{b.totalWeight} kg</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${b.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                                                            {b.paymentStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {trip.status === "in_transit" && b.status !== "delivered" ? (
                                                            <UpdateBookingStatusSelect booking={b} onSuccess={onRefresh} />
                                                        ) : (
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${bStatus.cls}`}>
                                                                {bStatus.label}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="px-5 py-10 text-center">
                                <p className="text-sm text-gray-400">No bookings on this trip yet.</p>
                            </div>
                        )}
                    </div>

                    {/* Timeline */}
                    <div className="md:col-span-1 space-y-5">
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            <div className="px-5 py-3.5 border-b border-gray-100">
                                <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Trip timeline</p>
                            </div>
                            <div className="px-5 py-4 space-y-0">
                                {TIMELINE.map((step, i) => {
                                    const stepIdx = statusOrder.indexOf(step.key)
                                    const isDone = stepIdx < currentIdx
                                    const isActive = stepIdx === currentIdx
                                    const isLast = i === TIMELINE.length - 1
                                    return (
                                        <div key={step.key} className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isDone ? "bg-emerald-50 border-2 border-emerald-500" : isActive ? "bg-emerald-50 border-2 border-brand-green" : "bg-gray-100 border-2 border-gray-200"}`}>
                                                    {isDone ? (
                                                        <svg className="w-3 h-3 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                    ) : isActive ? (
                                                        <span className="w-2 h-2 rounded-full bg-brand-green" />
                                                    ) : (
                                                        <span className="w-2 h-2 rounded-full bg-gray-300" />
                                                    )}
                                                </div>
                                                {!isLast && <div className={`w-px flex-1 my-1 ${isDone ? "bg-emerald-400" : "bg-gray-200"}`} style={{ minHeight: 24 }} />}
                                            </div>
                                            <div className="pb-5">
                                                <p className={`text-xs font-medium ${isActive ? "text-brand-green" : isDone ? "text-gray-700" : "text-gray-400"}`}>
                                                    {step.label}
                                                </p>
                                                <p className="text-[11px] text-gray-400 mt-0.5">{step.sub}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

function UpdateBookingStatusSelect({ booking, onSuccess }: { booking: any; onSuccess: () => void }) {
    const [loading, setLoading] = useState(false)

    async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setLoading(true)
        await axios.patch(`/api/booking/${booking._id}/status`, { status: e.target.value })
        setLoading(false)
        onSuccess()
    }

    return (
        <select
            defaultValue={booking.status}
            onChange={handleChange}
            disabled={loading}
            className="text-[11px] border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-600 cursor-pointer outline-none hover:border-brand-green transition-all disabled:opacity-50"
        >
            <option value="in_transit">In transit</option>
            <option value="delivered">Delivered</option>
        </select>
    )
}