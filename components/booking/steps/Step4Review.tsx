"use client"
import { useState }       from "react"
import Button             from "@/components/ui/Button"
import { type User }      from "@/libs/getUser"       
import { LoginModal } from "@/app/(auth)/login/LoginModal"

interface PackageItem {
  id:          number
  description: string
  weight:      number
  boxes:       number
}

interface Step4Props {
  data: {
    tripId:           string
    departure:        string
    origin:           string
    destination:      string
    packages:         PackageItem[]
    senderName:       string
    senderContact:    string
    senderAddress:    string
    senderCity:       string
    pickupTime:       string
    recipientName:    string
    recipientContact: string
    recipientAddress: string
    instructions:     string
    paymentMethod:    string
  }
  user:   User | null    // 👈 2. add user prop
  onBack: () => void
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-xs text-gray-900 font-medium text-right max-w-[60%]">
        {value}
      </span>
    </div>
  )
}

const PAYMENT_OPTIONS = [
  { value: "cash",  label: "Cash on pickup" },
  { value: "gcash", label: "GCash"          },
  { value: "maya",  label: "Maya"           },
  { value: "bank",  label: "Bank transfer"  },
]

export default function Step4Review({ data, user, onBack }: Step4Props) {
  //                                         👆 3. accept user

  const [confirmed,      setConfirmed]      = useState(false)
  const [trackingRef,    setTrackingRef]    = useState("")
  const [paymentMethod,  setPaymentMethod]  = useState(data.paymentMethod)
  const [showLogin,      setShowLogin]      = useState(false)  // 👈 4.
  const [pendingConfirm, setPendingConfirm] = useState(false)  // 👈 4.
  const [loading,        setLoading]        = useState(false)  // 👈 4.
  const [error,          setError]          = useState("")     // 👈 4.

  const totalWeight = data.packages.reduce((sum, pkg) => sum + pkg.weight, 0)
  const ratePerKg   = 45
  const handlingFee = 150
  const deliveryFee = Math.round(totalWeight * ratePerKg)
  const total       = deliveryFee + handlingFee

  // 👇 5. replace old handleConfirm
  function handleConfirm() {
    if (!user) {
      setPendingConfirm(true)
      setShowLogin(true)
      return
    }
    saveBooking()
  }

  // 👇 6. real fetch to API
  async function saveBooking() {
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/booking", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...data, paymentMethod }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.message || "Something went wrong.")
        return
      }

      setTrackingRef(json.data.bookingRef)
      setConfirmed(true)

    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // 👇 7. called after login modal succeeds
  function handleLoginSuccess() {
    setShowLogin(false)
    if (pendingConfirm) {
      setPendingConfirm(false)
      saveBooking()
    }
  }

  if (confirmed) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Booking confirmed!</h2>
        <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6">
          Your cargo has been added to the truck manifest.
          Our team will coordinate pickup before the departure date.
        </p>
        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-6">
          <div className="text-left">
            <p className="text-xs text-gray-400 mb-0.5">Booking reference</p>
            <p className="text-sm font-semibold text-gray-900">{trackingRef}</p>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(trackingRef)}
            className="text-xs text-green-700 hover:text-green-800 transition-colors"
          >
            Copy
          </button>
        </div>
        <div className="border border-gray-100 rounded-xl overflow-hidden text-left">
          <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-500">What happens next</p>
          </div>
          {[
            "Rider picks up your packages before the departure date",
            "Cargo is loaded onto the truck with other clients' packages",
            "Each package is delivered to its own drop-off address in Manila",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3 border-b border-gray-100 last:border-0">
              <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-medium text-green-700">{i + 1}</span>
              </div>
              <p className="text-xs text-gray-600">{step}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">

        <h2 className="text-base font-semibold text-gray-900 mb-1">
          Review your booking
        </h2>
        <p className="text-xs text-gray-400 mb-6">
          Double check everything before confirming.
        </p>

        {/* Trip — unchanged */}
        <div className="border border-gray-100 rounded-xl p-4 mb-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Trip</p>
          <SummaryRow label="Trip ID"      value={data.tripId} />
          <SummaryRow label="Route"        value={`${data.origin} → ${data.destination}`} />
          <SummaryRow label="Departure"    value={data.departure} />
          <SummaryRow label="Est. arrival" value="2–3 days after departure" />
        </div>

        {/* Cargo manifest — unchanged */}
        <div className="border border-gray-100 rounded-xl overflow-hidden mb-4">
          <div className="grid grid-cols-3 bg-gray-50 px-4 py-2 border-b border-gray-100">
            <span className="text-xs text-gray-400">Package</span>
            <span className="text-xs text-gray-400 text-center">Boxes</span>
            <span className="text-xs text-gray-400 text-right">Weight</span>
          </div>
          {data.packages.map((pkg) => (
            <div key={pkg.id} className="grid grid-cols-3 px-4 py-2.5 border-b border-gray-50 last:border-0">
              <span className="text-xs text-gray-900 truncate pr-2">{pkg.description}</span>
              <span className="text-xs text-gray-500 text-center">{pkg.boxes}</span>
              <span className="text-xs text-gray-900 font-medium text-right">{pkg.weight} kg</span>
            </div>
          ))}
          <div className="grid grid-cols-3 px-4 py-2.5 bg-green-50 border-t border-green-100">
            <span className="text-xs font-medium text-green-700">Total</span>
            <span className="text-xs text-green-600 text-center">
              {data.packages.reduce((sum, pkg) => sum + pkg.boxes, 0)} boxes
            </span>
            <span className="text-xs font-medium text-green-700 text-right">
              {totalWeight.toFixed(1)} kg
            </span>
          </div>
        </div>

        {/* Addresses — unchanged */}
        <div className="border border-gray-100 rounded-xl p-4 mb-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Addresses</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-2 h-2 rounded-full bg-green-600" />
                <span className="text-xs text-gray-400">Pickup</span>
              </div>
              <p className="text-xs text-gray-900 font-medium">{data.senderName}</p>
              <p className="text-xs text-gray-500">{data.senderContact}</p>
              <p className="text-xs text-gray-500">{data.senderAddress}</p>
              <p className="text-xs text-gray-500">{data.senderCity}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs text-gray-400">Delivery</span>
              </div>
              <p className="text-xs text-gray-900 font-medium">{data.recipientName}</p>
              <p className="text-xs text-gray-500">{data.recipientContact}</p>
              <p className="text-xs text-gray-500">{data.recipientAddress}</p>
            </div>
          </div>
        </div>

        {/* Pricing + payment — unchanged */}
        <div className="border border-gray-100 rounded-xl p-4 mb-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Pricing</p>
          <SummaryRow label="Delivery fee" value={`₱${deliveryFee.toLocaleString()}`} />
          <SummaryRow label="Rate"         value={`₱${ratePerKg}/kg × ${totalWeight.toFixed(1)} kg`} />
          <SummaryRow label="Handling fee" value={`₱${handlingFee}`} />
          <div className="flex justify-between items-center pt-3 mt-1 border-t border-gray-100">
            <span className="text-sm font-semibold text-gray-900">Total</span>
            <span className="text-sm font-semibold text-green-700">₱{total.toLocaleString()}</span>
          </div>
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
        </div>

        {/* 👇 8. error message */}
        {error && (
          <p className="text-xs text-red-500 text-center mb-4">{error}</p>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <Button variant="ghost" onClick={onBack} disabled={loading}>
            Back
          </Button>
          <div className="flex items-center gap-3">
            <p className="text-xs text-gray-400">Step 4 of 4</p>

            {/* 👇 9. updated button */}
            <Button
              onClick={handleConfirm}
              loading={loading}
            >
              {!user ? "Sign in to confirm" : "Confirm booking"}
            </Button>
          </div>
        </div>

      </div>

      {/* 👇 10. login modal */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => {
          setShowLogin(false)
          setPendingConfirm(false)
        }}
        onSuccess={handleLoginSuccess}
      />
    </>
  )
}