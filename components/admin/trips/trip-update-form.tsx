"use client"
import { useState } from "react"
import { sileo } from "sileo"
import axios from "axios"
import { Form, FormField, FormLabel, FormSelect } from "@/components/ui/Form"
import Button from "@/components/ui/Button"

interface UpdateStatusFormProps {
    tripId: string
    currentStatus: string
    onClose?: () => void
    onSuccess?: () => void
}

// Only allow valid forward transitions
const STATUS_TRANSITIONS: Record<string, { label: string; value: string }[]> = {
    draft: [
        { label: "Active", value: "active" },
        { label: "Cancelled", value: "cancelled" },
    ],
    active: [
        { label: "In Transit", value: "in_transit" },
        { label: "Cancelled", value: "cancelled" },
    ],
    in_transit: [
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
    ],
    completed: [],
    cancelled: [],
}

const CASCADE_WARNINGS: Record<string, string> = {
    in_transit: "This will mark all pending bookings under this trip as In Transit.",
    cancelled: "This will cancel all pending and in-transit bookings under this trip.",
}

export default function UpdateStatusForm({ tripId, currentStatus, onClose, onSuccess }: UpdateStatusFormProps) {
    const options = STATUS_TRANSITIONS[currentStatus] ?? []
    const [status, setStatus] = useState(options[0]?.value ?? "")
    const [loading, setLoading] = useState(false)

    const warning = CASCADE_WARNINGS[status]

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            setLoading(true)
            await axios.patch(`/api/trips/${tripId}/status`, { status })
            sileo.success({
                title: "Status updated",
                position: "top-right",
                description: `Trip is now ${status.replace("_", " ")}.`,
                duration: 5000,
                fill: "black",
                styles: { title: "text-white", description: "text-white/75" }
            })
            onSuccess?.()
            onClose?.()
        } catch {
            sileo.error({
                title: "Failed to update",
                position: "top-right",
                description: "Something went wrong. Please try again.",
                duration: 5000,
            })
        } finally {
            setLoading(false)
        }
    }

    // Terminal states — nothing left to change
    if (options.length === 0) {
        return (
            <div className="py-2 px-1 text-sm text-gray-500">
                This trip is <span className="font-medium capitalize">{currentStatus}</span> and cannot be changed.
            </div>
        )
    }

    return (
        <Form onSubmit={handleSubmit}>
            <FormField>
                <FormLabel htmlFor="status">New status</FormLabel>
                <FormSelect
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    options={options}
                />
            </FormField>

            {/* Warn admin when action cascades to bookings */}
            {warning && (
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    {warning}
                </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" size="sm" loading={loading}>
                    Save
                </Button>
            </div>
        </Form>
    )
}