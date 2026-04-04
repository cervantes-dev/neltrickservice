"use client"
import { useState } from "react";
import { sileo } from "sileo";
import axios from "axios";
import Button from "@/components/ui/Button";

interface TripDeleteConfirmProps {
    tripId: string      // ← MongoDB _id
    tripRef: string     // ← "NLT-TRP-002" para sa display
    onClose?: () => void
    onSuccess?: () => void
}

export default function TripDeleteConfirm({ tripId, tripRef, onClose, onSuccess }: TripDeleteConfirmProps) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/trips/${tripId}`)
            sileo.success({
                title: "Deleted",
                position: "top-right",
                description: `${tripRef} has been deleted.`,
                duration: 5000,
                fill: "black",
                styles: { title: "text-white", description: "text-white/75" }
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
                styles: { title: "text-white", description: "text-white/75" }
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            <p className="text-sm text-gray-600 text-center">
                Trip <span className="font-semibold text-gray-900">{tripRef}</span> will be
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