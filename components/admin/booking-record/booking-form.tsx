"use client"
import { useState } from "react";
import Step1Customer from "./steps/step1Customer";
import Step2Trip from "./steps/step2Trip";
import { User } from "@/libs/getUser";

interface SelectedCustomer {
    id: string | null  // null = walk-in (no account)
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

interface AdminBookingData {
    // step 1 — customer
    customer: SelectedCustomer | null
    saveAsCustomer: boolean            // walk-in only: save to DB?

    // step 2 — trip
    tripId: string
    origin: string
    destination: string
    departure: string

    // step 3 — packages
    packages: PackageItem[]

    // step 4 — addresses
    senderName: string
    senderContact: string
    senderAddress: string
    senderCity: string
    pickupTime: string
    recipientName: string
    recipientContact: string
    recipientAddress: string
    instructions: string

    // step 5 — review
    paymentMethod: string
    paymentStatus: string
    notes: string
}

interface AdminBookingFormProps {
    user: User | null
}

const STEPS = [
    { id: 1, label: "Customer" },
    { id: 2, label: "Trip" },
    { id: 3, label: "Packages" },
    { id: 4, label: "Addresses" },
    { id: 5, label: "Review" },
]
export default function AdminBookingForm({ user }: AdminBookingFormProps) {
    const [step, setStep] = useState<number>(1)

    const [formData, setFormData] = useState<AdminBookingData>({
        customer: null,
        saveAsCustomer: false,
        tripId: "",
        origin: "Leyte",
        destination: "Manila (NCR)",
        departure: "",
        packages: [],
        senderName: "",
        senderContact: "",
        senderAddress: "",
        senderCity: "",
        pickupTime: "",
        recipientName: "",
        recipientContact: "",
        recipientAddress: "",
        instructions: "",
        paymentMethod: "cash",
        paymentStatus: "pending",
        notes: "",
    })

    function updateData(fields: Partial<AdminBookingData>) {
        setFormData(prev => ({ ...prev, ...fields }))
    }

    return (
        <div className="w-full ">

            {/* Stepper */}
            <div className="flex items-center justify-center mb-8">
                {STEPS.map((s, index) => (
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
                        {index < STEPS.length - 1 && (
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
                <Step1Customer
                    data={formData}
                    onNext={(fields) => { updateData(fields); setStep(2) }}
                />
            )}

            {step === 2 && (
                <Step2Trip
                    data={formData}
                    onNext={(fields) => { updateData(fields); setStep(3) }}
                    onBack={() => setStep(1)}
                />
            )}

        </div>
    )

}