"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Button from "@/components/ui/Button"
import { type User } from "@/libs/getUser"
import axios from "axios"

interface SelectedCustomer {
    id: string | null
    name: string
    phone: string
    address: string
    city: string
    isGuest: boolean
}

interface PackageItem {
    id: number
    description: string
    weight: number
    boxes: number
}

interface Step5Props {
    data: {
        // step 1
        customer: SelectedCustomer | null
        // step 2
        tripId: string
        departure: string
        origin: string
        destination: string
        // step 3
        packages: PackageItem[]
        // step 4
        senderName: string
        senderContact: string
        senderAddress: string
        senderCity: string
        pickupTime: string
        recipientName: string
        recipientContact: string
        recipientAddress: string
        instructions: string
        // step 5
        paymentMethod: string
        paymentStatus: string
        notes: string
    }
    user: User | null
    onBack: () => void
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-start py-2
                        border-b border-gray-50 last:border-0">
            <span className="text-xs text-gray-400">{label}</span>
            <span className="text-xs text-gray-900 font-medium
                             text-right max-w-[60%]">
                {value}
            </span>
        </div>
    )
}

const PAYMENT_OPTIONS = [
    { value: "cash", label: "Cash on pickup" },
    { value: "gcash", label: "GCash" },
    { value: "maya", label: "Maya" },
    { value: "bank", label: "Bank transfer" },
]

const PAYMENT_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "waived", label: "Waived" },
]

export default function Step5Review({ data, user, onBack }: Step5Props) {
    const router = useRouter()
    const [paymentMethod, setPaymentMethod] = useState(data.paymentMethod)
    const [paymentStatus, setPaymentStatus] = useState(data.paymentStatus)
    const [notes, setNotes] = useState(data.notes)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [confirmed, setConfirmed] = useState(false)
    const [bookingRef, setBookingRef] = useState("")

    const totalWeight = data.packages.reduce((sum, pkg) => sum + pkg.weight, 0)
    const totalBoxes = data.packages.reduce((sum, pkg) => sum + pkg.boxes, 0)
    const ratePerKg = 45
    const handlingFee = 150
    const deliveryFee = Math.round(totalWeight * ratePerKg)
    const totalAmount = deliveryFee + handlingFee

    async function handleConfirm() {
        setLoading(true)
        setError("")
        try {
            const res = await axios.post("/api/booking", {
                ...data,
                paymentMethod,
                paymentStatus,
                notes,
                totalWeight,
                deliveryFee,
                handlingFee,
                totalAmount,
                // pass userId if existing customer, null if walk-in
                userId: data.customer?.isGuest ? null : data.customer?.id,
            })
            setBookingRef(res.data.data.bookingRef)
            setConfirmed(true)
        } catch {
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    // ── Confirmation screen ───────────────────────────────────────────
    if (confirmed) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100
                            p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center
                                justify-center mx-auto mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="#15803d"
                            strokeWidth="2.5" strokeLinecap="round"
                            strokeLinejoin="round" />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Booking created
                </h2>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6">
                    The booking has been added to the manifest for {data.departure}.
                    The team will coordinate pickup before the departure date.
                </p>
                <div className="flex items-center justify-between bg-gray-50
                                rounded-xl px-4 py-3 mb-6">
                    <div className="text-left">
                        <p className="text-xs text-gray-400 mb-0.5">Booking reference</p>
                        <p className="text-sm font-semibold text-gray-900">{bookingRef}</p>
                    </div>
                    <button
                        onClick={() => navigator.clipboard.writeText(bookingRef)}
                        className="text-xs text-green-700 hover:text-green-800 transition-colors"
                    >
                        Copy
                    </button>
                </div>
                <div className="flex gap-3 justify-center">
                    <Button
                        variant="outline"
                        onClick={() => router.push("/booking-record")}
                    >
                        View all bookings
                    </Button>
                    <Button
                        onClick={() => router.push("/booking-record/create")}
                    >
                        Create another
                    </Button>
                </div>
            </div>
        )
    }

    // ── Review screen ─────────────────────────────────────────────────
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">

            <h2 className="text-base font-semibold text-gray-900 mb-1">
                Review booking
            </h2>
            <p className="text-xs text-gray-400 mb-6">
                Double check everything before confirming.
            </p>

            {/* Customer */}
            <div className="border border-gray-100 rounded-xl p-4 mb-4">
                <p className="text-xs font-medium text-gray-500 uppercase
                               tracking-wide mb-3">
                    Customer
                </p>
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center
                                    text-white text-xs font-medium shrink-0
                                    ${data.customer?.isGuest ? "bg-amber-500" : "bg-green-700"}`}>
                        {data.customer?.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {data.customer?.name ?? "—"}
                        </p>
                        <p className="text-xs text-gray-400">
                            {data.customer?.isGuest
                                ? `${data.customer.phone} · Walk-in`
                                : "Registered customer"
                            }
                        </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-lg font-medium
                        ${data.customer?.isGuest
                            ? "bg-amber-50 text-amber-700"
                            : "bg-green-50 text-green-700"
                        }`}>
                        {data.customer?.isGuest ? "Guest" : "Registered"}
                    </span>
                </div>
            </div>

            {/* Trip */}
            <div className="border border-gray-100 rounded-xl p-4 mb-4">
                <p className="text-xs font-medium text-gray-500 uppercase
                               tracking-wide mb-3">
                    Trip
                </p>
                <SummaryRow label="Trip ID" value={data.tripId} />
                <SummaryRow label="Route" value={`${data.origin} → ${data.destination}`} />
                <SummaryRow label="Departure" value={data.departure} />
                <SummaryRow label="Est. arrival" value="2–3 days after departure" />
            </div>

            {/* Cargo manifest */}
            <div className="border border-gray-100 rounded-xl overflow-hidden mb-4">
                <div className="grid grid-cols-3 bg-gray-50 px-4 py-2
                                border-b border-gray-100">
                    <span className="text-xs text-gray-400">Package</span>
                    <span className="text-xs text-gray-400 text-center">Boxes</span>
                    <span className="text-xs text-gray-400 text-right">Weight</span>
                </div>
                {data.packages.map((pkg) => (
                    <div key={pkg.id}
                        className="grid grid-cols-3 px-4 py-2.5
                                    border-b border-gray-50 last:border-0">
                        <span className="text-xs text-gray-900 truncate pr-2">
                            {pkg.description}
                        </span>
                        <span className="text-xs text-gray-500 text-center">
                            {pkg.boxes}
                        </span>
                        <span className="text-xs text-gray-900 font-medium text-right">
                            {pkg.weight} kg
                        </span>
                    </div>
                ))}
                <div className="grid grid-cols-3 px-4 py-2.5 bg-green-50
                                border-t border-green-100">
                    <span className="text-xs font-medium text-green-700">Total</span>
                    <span className="text-xs text-green-600 text-center">
                        {totalBoxes} boxes
                    </span>
                    <span className="text-xs font-medium text-green-700 text-right">
                        {totalWeight.toFixed(1)} kg
                    </span>
                </div>
            </div>

            {/* Addresses */}
            <div className="border border-gray-100 rounded-xl p-4 mb-4">
                <p className="text-xs font-medium text-gray-500 uppercase
                               tracking-wide mb-3">
                    Addresses
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-600" />
                            <span className="text-xs text-gray-400">Pickup</span>
                        </div>
                        <p className="text-xs text-gray-900 font-medium">
                            {data.senderName}
                        </p>
                        <p className="text-xs text-gray-500">{data.senderContact}</p>
                        <p className="text-xs text-gray-500">{data.senderAddress}</p>
                        <p className="text-xs text-gray-500">{data.senderCity}</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="text-xs text-gray-400">Delivery</span>
                        </div>
                        <p className="text-xs text-gray-900 font-medium">
                            {data.recipientName}
                        </p>
                        <p className="text-xs text-gray-500">{data.recipientContact}</p>
                        <p className="text-xs text-gray-500">{data.recipientAddress}</p>
                    </div>
                </div>
            </div>

            {/* Pricing & payment */}
            <div className="border border-gray-100 rounded-xl p-4 mb-4">
                <p className="text-xs font-medium text-gray-500 uppercase
                               tracking-wide mb-3">
                    Pricing & payment
                </p>
                <SummaryRow label="Delivery fee" value={`₱${deliveryFee.toLocaleString()}`} />
                <SummaryRow label="Rate" value={`₱${ratePerKg}/kg × ${totalWeight.toFixed(1)} kg`} />
                <SummaryRow label="Handling fee" value={`₱${handlingFee}`} />
                <div className="flex justify-between items-center pt-3 mt-1
                                border-t border-gray-100">
                    <span className="text-sm font-semibold text-gray-900">Total</span>
                    <span className="text-sm font-semibold text-green-700">
                        ₱{totalAmount.toLocaleString()}
                    </span>
                </div>

                {/* Payment method */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 mb-2">Payment method</p>
                    <div className="flex flex-wrap gap-2">
                        {PAYMENT_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setPaymentMethod(opt.value)}
                                className={`
                                    text-xs px-3 py-1.5 rounded-lg border transition-colors duration-150
                                    ${paymentMethod === opt.value
                                        ? "border-green-600 bg-green-50 text-green-700"
                                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                                    }
                                `}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Payment status — admin only */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 mb-2">Payment status</p>
                    <div className="flex flex-wrap gap-2">
                        {PAYMENT_STATUS_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setPaymentStatus(opt.value)}
                                className={`
                                    text-xs px-3 py-1.5 rounded-lg border transition-colors duration-150
                                    ${paymentStatus === opt.value
                                        ? "border-green-600 bg-green-50 text-green-700"
                                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                                    }
                                `}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Internal notes — admin only */}
            <div className="border border-gray-100 rounded-xl p-4 mb-6">
                <p className="text-xs font-medium text-gray-500 uppercase
                               tracking-wide mb-3">
                    Internal notes
                </p>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Notes visible only to admin and staff..."
                    rows={3}
                    className="w-full text-sm text-gray-900 placeholder-gray-300
                               border border-gray-200 rounded-xl px-3 py-2.5
                               resize-none focus:outline-none focus:ring-1
                               focus:ring-green-600 focus:border-green-600"
                />
            </div>

            {/* Error */}
            {error && (
                <p className="text-xs text-red-500 text-center mb-4">{error}</p>
            )}

            {/* Footer */}
            <div className="flex justify-between items-center pt-4
                            border-t border-gray-100">
                <Button variant="ghost" onClick={onBack} disabled={loading}>
                    Back
                </Button>
                <div className="flex items-center gap-3">
                    <p className="text-xs text-gray-400">Step 5 of 5</p>
                    <Button onClick={handleConfirm} loading={loading}>
                        Create booking
                    </Button>
                </div>
            </div>

        </div>
    )
}