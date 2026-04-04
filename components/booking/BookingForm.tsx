"use client"
import { useState } from "react"
import Step1Trip      from "./steps/Step1Trip"
import Step2Packages  from "./steps/Step2Packages"
import Step3Addresses from "./steps/Step3Addresses"
import Step4Review    from "./steps/Step4Review"
import { User }       from "@/libs/getUser"

interface PackageItem {
  id:          number
  description: string
  weight:      number
  boxes:       number
}

interface BookingFormData {
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

// 👇 add this
interface LastBooking {
  senderName:    string
  senderContact: string
  senderAddress: string
  senderCity:    string
}

interface BookingFormProps {
  user:        User | null
  lastBooking: LastBooking | null  // 👈 add this
}

const steps = [
  { id: 1, label: "Choose trip"    },
  { id: 2, label: "Your packages"  },
  { id: 3, label: "Addresses"      },
  { id: 4, label: "Review"         },
]

export default function BookingForm({ user, lastBooking }: BookingFormProps) {
  const [step, setStep] = useState<number>(1)

  // 👇 pre-fill sender fields from last booking if available
  const [formData, setFormData] = useState<BookingFormData>({
    tripId:           "",
    departure:        "",
    origin:           "Leyte",
    destination:      "Manila (NCR)",
    packages:         [],
    senderName:       lastBooking?.senderName    ?? "",
    senderContact:    lastBooking?.senderContact ?? "",
    senderAddress:    lastBooking?.senderAddress ?? "",
    senderCity:       lastBooking?.senderCity    ?? "",
    pickupTime:       "",
    recipientName:    "",
    recipientContact: "",
    recipientAddress: "",
    instructions:     "",
    paymentMethod:    "cash",
  })

  function updateData(fields: Partial<BookingFormData>) {
    setFormData(prev => ({ ...prev, ...fields }))
  }

  return (
    <div className="w-full max-w-2xl">

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {steps.map((s, index) => (
          <div key={s.id} className="flex items-center">
            <div className="flex items-center gap-2">
              <div className={`
                w-7 h-7 rounded-full flex items-center justify-center
                text-xs font-medium transition-colors duration-150
                ${step === s.id
                  ? "bg-green-700 text-white"
                  : step > s.id
                    ? "bg-green-100 text-green-700"
                    : "border border-gray-300 text-gray-400"
                }
              `}>
                {step > s.id ? "✓" : s.id}
              </div>
              <span className={`
                text-xs hidden sm:block
                ${step === s.id ? "text-gray-900 font-medium" : "text-gray-400"}
              `}>
                {s.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`
                w-8 md:w-16 h-px mx-2
                ${step > s.id ? "bg-green-700" : "bg-gray-200"}
              `} />
            )}
          </div>
        ))}
      </div>

      {/* Steps */}
      {step === 1 && (
        <Step1Trip
          data={formData}
          onNext={(fields) => { updateData(fields); setStep(2) }}
        />
      )}
      {step === 2 && (
        <Step2Packages
          data={formData}
          onNext={(fields) => { updateData(fields); setStep(3) }}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <Step3Addresses
          data={formData}
          onNext={(fields) => { updateData(fields); setStep(4) }}
          onBack={() => setStep(2)}
        />
      )}
      {step === 4 && (
        <Step4Review
          data={formData}
          user={user}
          onBack={() => setStep(3)}
        />
      )}

    </div>
  )
}