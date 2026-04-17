"use client"
import { useState } from "react";
import { sileo } from "sileo";
import axios from "axios";
import Button from "@/components/ui/Button";

interface BookingDeleteConfirmProps {
    bookingId: string       // MongoDB _id
    bookingRef: string      // e.g. "NLT-BKG-001" for display
    onClose?: () => void
    onSuccess?: () => void
}

export default function BookingDeleteConfirm({
    bookingId,
    bookingRef,
    onClose,
    onSuccess,
}: BookingDeleteConfirmProps) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/booking-record/${bookingId}`)  // ← wire up once API is ready
            sileo.success({
                title: "Deleted",
                position: "top-right",
                description: `${bookingRef} has been deleted.`,
                duration: 5000,
                fill: "black",
                styles: { title: "text-white", description: "text-white/75" },
            })
            onSuccess?.()
            onClose?.()
        } catch (err: any) {
            sileo.error({
                title: "Cannot Delete",
                position: "top-right",
                description: err.response?.data?.message ?? "Something went wrong.",
                duration: 5000,
                fill: "black",
                styles: { title: "text-white", description: "text-white/75" },
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            <p className="text-sm text-gray-600 text-center">
                Booking <span className="font-semibold text-gray-900">{bookingRef}</span> will be
                permanently deleted. This cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="button" variant="danger" size="sm" loading={loading} onClick={handleDelete}>
                    Delete
                </Button>
            </div>
        </div>
    )
}