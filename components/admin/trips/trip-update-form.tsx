"use client"
import { useState } from "react";
import { sileo } from "sileo";
import axios from "axios";
import { Form, FormField, FormLabel, FormSelect } from "@/components/ui/Form";
import Button from "@/components/ui/Button";

interface UpdateStatusFormProps {
    tripId: string          // ← kailangan para sa API call
    currentStatus: string   // ← para ma-set ang default selected
    onClose?: () => void
    onSuccess?: () => void
}

export default function UpdateStatusForm({ tripId, currentStatus, onClose, onSuccess }: UpdateStatusFormProps) {
    const [status, setStatus] = useState(currentStatus) // ← default ang current status
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault() // ← kulang ito sa original mo

        try {
            setLoading(true)
            await axios.patch(`/api/trips/${tripId}/status`, { status })
            sileo.success({
                title: "Success",
                position: "top-right",
                description: "Trip added successfully",
                duration: 5000,
                fill: "black",
                styles: { title: "text-white", description: "text-white/75" }
            });
            onSuccess?.()
            onClose?.()
        } catch {
            console.error("Failed to update status")
        } finally {
            setLoading(false)
        }
    }

    return (  // ← kulang ang return sa original mo
        <Form onSubmit={handleSubmit}>
            <FormField>
                <FormLabel htmlFor="status">Status</FormLabel>
                <FormSelect
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    options={[
                        { label: "Draft", value: "draft" },
                        { label: "Active", value: "active" },
                        { label: "Cancelled", value: "cancelled" },
                        { label: "Completed", value: "completed" },
                    ]}
                />
            </FormField>

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