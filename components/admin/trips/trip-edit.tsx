"use client"
import { useState } from "react";
import { sileo } from "sileo";
import axios from "axios";
import { Form, FormField, FormLabel, FormInput } from "@/components/ui/Form";
import Button from "@/components/ui/Button";

interface TripEditFormProps {
    tripId: string
    defaultValues: {
        origin: string
        destination: string
        departureDate: string
        departureTime: string
        capacityKg: number
    }
    onClose?: () => void
    onSuccess?: () => void
}

export default function TripEditForm({ tripId, defaultValues, onClose, onSuccess }: TripEditFormProps) {
    const [form, setForm] = useState(defaultValues)
    const [loading, setLoading] = useState(false)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setForm(prev => ({
            ...prev,
            [name]: name === "capacityKg" ? parseFloat(value) : value,
        }))
    }

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            setLoading(true)
            await axios.put(`/api/trips/${tripId}`, {
                origin: form.origin,
                destination: form.destination,
                departureDate: form.departureDate,
                departureTime: form.departureTime,
                capacityKg: form.capacityKg,
            })
            sileo.success({
                title: "Success",
                position: "top-right",
                description: "Trip updated successfully",
                duration: 5000,
                fill: "black",
                styles: { title: "text-white", description: "text-white/75" }
            })
            onSuccess?.()
            onClose?.()
        } catch {
            console.error("Failed to update trip")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
                <FormField>
                    <FormLabel htmlFor="origin">Origin</FormLabel>
                    <FormInput
                        id="origin"
                        name="origin"
                        value={form.origin}
                        onChange={handleChange}
                    />
                </FormField>
                <FormField>
                    <FormLabel htmlFor="destination">Destination</FormLabel>
                    <FormInput
                        id="destination"
                        name="destination"
                        value={form.destination}
                        onChange={handleChange}
                    />
                </FormField>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <FormField>
                    <FormLabel htmlFor="departureDate">Departure Date</FormLabel>
                    <FormInput
                        id="departureDate"
                        name="departureDate"
                        type="date"
                        value={form.departureDate.slice(0, 10)}
                        onChange={handleChange}
                    />
                </FormField>
                <FormField>
                    <FormLabel htmlFor="departureTime">Departure Time</FormLabel>
                    <FormInput
                        id="departureTime"
                        name="departureTime"
                        type="time"
                        value={form.departureTime}
                        onChange={handleChange}
                    />
                </FormField>
            </div>

            <FormField>
                <FormLabel htmlFor="capacityKg">Capacity (kg)</FormLabel>
                <FormInput
                    id="capacityKg"
                    name="capacityKg"
                    type="number"
                    min={1}
                    value={form.capacityKg}
                    onChange={handleChange}
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