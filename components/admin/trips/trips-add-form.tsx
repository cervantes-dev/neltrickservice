"use client"
import { useAddTripForm } from "@/hooks/useAddTripForm";
import { Form, FormField, FormLabel, FormInput, FormSelect, FormError } from "@/components/ui/Form";
import Button from "@/components/ui/Button";

interface AddTripProps {
    onClose?: () => void;
    onSuccess?: () => void;
}

export default function TripAddFrom({ onClose, onSuccess }: AddTripProps) {
    const { formData, errors, loading, handleSubmit, handleChange } = useAddTripForm({ onClose, onSuccess });

    return (
        <Form onSubmit={handleSubmit}>
            {/* Trip ID */}
            <FormField>
                <FormLabel htmlFor="tripId" required>Trip ID</FormLabel>
                <div className="flex items-center gap-2">
                    <FormInput
                        id="tripId"
                        value={formData.tripId}
                        onChange={handleChange("tripId")}
                        error={!!errors.tripId}
                        className="font-mono text-sm flex-1"
                        readOnly
                    />
                    <span className="text-xs text-gray-400 border border-gray-200 rounded-full px-2 py-0.5 whitespace-nowrap">
                        Auto-generated
                    </span>
                </div>
            </FormField>

            {/* Route */}
            <div className="flex flex-col gap-2 mb-2">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Route</span>
                <div className="flex gap-3">
                    <FormField className="flex-1">
                        <FormLabel htmlFor="origin" required>Origin</FormLabel>
                        <FormSelect
                            id="origin"
                            value={formData.origin}
                            onChange={handleChange("origin")}
                            error={!!errors.origin}
                            options={[
                                { label: "Leyte", value: "Leyte" },
                                { label: "Cebu", value: "Cebu" },
                                { label: "Davao", value: "Davao" },
                                { label: "Iloilo", value: "Iloilo" },
                            ]}
                        />
                        <FormError message={errors.origin} />
                    </FormField>
                    <FormField className="flex-1">
                        <FormLabel htmlFor="destination" required>Destination</FormLabel>
                        <FormSelect
                            id="destination"
                            value={formData.destination}
                            onChange={handleChange("destination")}
                            error={!!errors.destination}
                            options={[
                                { label: "Manila (NCR)", value: "Manila (NCR)" },
                                { label: "Cebu City", value: "Cebu City" },
                                { label: "Cagayan de Oro", value: "Cagayan de Oro" },
                            ]}
                        />
                        <FormError message={errors.destination} />
                    </FormField>
                </div>
            </div>

            {/* Schedule & Capacity */}
            <div className="flex flex-col gap-2 mb-2">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Schedule &amp; Capacity</span>
                <div className="grid grid-cols-3 gap-3">
                    <FormField>
                        <FormLabel htmlFor="departureDate" required>Departure date</FormLabel>
                        <FormInput id="departureDate" type="date" value={formData.departureDate} error={!!errors.departureDate} onChange={handleChange("departureDate")} />
                        <FormError message={errors.departureDate} />
                    </FormField>
                    <FormField>
                        <FormLabel htmlFor="departureTime" required>Departure time</FormLabel>
                        <FormInput id="departureTime" type="time" value={formData.departureTime} error={!!errors.departureTime} onChange={handleChange("departureTime")} />
                        <FormError message={errors.departureTime} />
                    </FormField>
                    <FormField>
                        <FormLabel htmlFor="capacityKg" required>Capacity (kg)</FormLabel>
                        <FormInput id="capacityKg" type="number" min={1} placeholder="e.g. 2000" value={formData.capacityKg} error={!!errors.capacityKg} onChange={handleChange("capacityKg")} />
                        <FormError message={errors.capacityKg} />
                    </FormField>
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
                <Button type="submit" size="sm" loading={loading}>Save</Button>
            </div>
        </Form>
    );
}