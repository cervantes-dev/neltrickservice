"use client"
import { useState } from "react"
import Input    from "@/components/ui/Input"
import Select   from "@/components/ui/Select"
import Textarea from "@/components/ui/Textarea"
import Button   from "@/components/ui/Button"

interface Step3Props {
  data: {
    senderName:       string
    senderContact:    string
    senderAddress:    string
    senderCity:       string
    pickupTime:       string
    recipientName:    string
    recipientContact: string
    recipientAddress: string
    instructions:     string
  }
  onNext: (fields: {
    senderName:       string
    senderContact:    string
    senderAddress:    string
    senderCity:       string
    pickupTime:       string
    recipientName:    string
    recipientContact: string
    recipientAddress: string
    instructions:     string
  }) => void
  onBack: () => void
}

export default function Step3Addresses({ data, onNext, onBack }: Step3Props) {

  const [senderName,       setSenderName]       = useState(data.senderName)
  const [senderContact,    setSenderContact]    = useState(data.senderContact)
  const [senderAddress,    setSenderAddress]    = useState(data.senderAddress)
  const [senderCity,       setSenderCity]       = useState(data.senderCity)
  const [pickupTime,       setPickupTime]       = useState(data.pickupTime)
  const [recipientName,    setRecipientName]    = useState(data.recipientName)
  const [recipientContact, setRecipientContact] = useState(data.recipientContact)
  const [recipientAddress, setRecipientAddress] = useState(data.recipientAddress)
  const [instructions,     setInstructions]     = useState(data.instructions)
  const [errors,           setErrors]           = useState<Record<string, string>>({})

  function validate() {
    const newErrors: Record<string, string> = {}
    if (!senderName.trim())       newErrors.senderName       = "Required"
    if (!senderContact.trim())    newErrors.senderContact    = "Required"
    if (!senderAddress.trim())    newErrors.senderAddress    = "Required"
    if (!senderCity.trim())       newErrors.senderCity       = "Required"
    if (!pickupTime)              newErrors.pickupTime       = "Required"
    if (!recipientName.trim())    newErrors.recipientName    = "Required"
    if (!recipientContact.trim()) newErrors.recipientContact = "Required"
    if (!recipientAddress.trim()) newErrors.recipientAddress = "Required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleNext() {
    if (!validate()) return
    onNext({
      senderName,
      senderContact,
      senderAddress,
      senderCity,
      pickupTime,
      recipientName,
      recipientContact,
      recipientAddress,
      instructions,
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">

      <h2 className="text-base font-semibold text-gray-900 mb-1">
        Pickup & delivery details
      </h2>
      <p className="text-xs text-gray-400 mb-6">
        Tell us where to collect your cargo and where to deliver it.
      </p>

      {/* Sender */}
      <div className="border border-gray-100 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-green-600" />
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Pickup in Leyte
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Sender name"       placeholder="Your full name"
            required value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            error={errors.senderName}
          />
          <Input
            label="Contact number"    placeholder="09XX XXX XXXX"
            required value={senderContact}
            onChange={(e) => setSenderContact(e.target.value)}
            error={errors.senderContact}
          />
        </div>
        <div className="mt-3">
          <Input
            label="Street / Barangay address"
            placeholder="House no., street, barangay"
            required value={senderAddress}
            onChange={(e) => setSenderAddress(e.target.value)}
            error={errors.senderAddress}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <Input
            label="City / Municipality" placeholder="e.g. Tacloban City"
            required value={senderCity}
            onChange={(e) => setSenderCity(e.target.value)}
            error={errors.senderCity}
          />
          <Select
            label="Preferred pickup time"
            required value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            error={errors.pickupTime}
            placeholder="Select a time..."
            options={[
              { value: "morning",   label: "Morning (8am – 12pm)"   },
              { value: "afternoon", label: "Afternoon (12pm – 5pm)"  },
              { value: "depot",     label: "Drop-off at depot"       },
            ]}
          />
        </div>
      </div>

      {/* Recipient */}
      <div className="border border-gray-100 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Delivery in Manila
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Recipient name"    placeholder="Full name"
            required value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            error={errors.recipientName}
          />
          <Input
            label="Contact number"   placeholder="09XX XXX XXXX"
            required value={recipientContact}
            onChange={(e) => setRecipientContact(e.target.value)}
            error={errors.recipientContact}
          />
        </div>
        <div className="mt-3">
          <Input
            label="Complete address"
            placeholder="Unit / Bldg, Street, Barangay, City"
            required value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            error={errors.recipientAddress}
          />
        </div>
        <div className="mt-3">
          <Textarea
            label="Delivery instructions (optional)"
            placeholder="e.g. Call before delivery, leave at guard house..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <div className="flex items-center gap-3">
          <p className="text-xs text-gray-400">Step 3 of 4</p>
          <Button onClick={handleNext}>
            Review order
          </Button>
        </div>
      </div>

    </div>
  )
}