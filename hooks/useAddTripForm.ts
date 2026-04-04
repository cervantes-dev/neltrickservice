import { useState, useEffect } from "react";
import axios from "axios";
import { sileo } from "sileo";

interface AddTripProps {
    onClose?: () => void;
    onSuccess?: () => void;
}

interface FormData {
    tripId: string
    origin: string
    destination: string
    departureDate: string
    departureTime: string
    capacityKg: number
}

interface FormErrors {
    tripId?: string
    origin?: string
    destination?: string
    departureDate?: string
    departureTime?: string
    capacityKg?: string
}

export function useAddTripForm({ onClose, onSuccess }: AddTripProps) {
    const [formData, setFormData] = useState<FormData>({
        tripId: "",
        origin: "Leyte",
        destination: "Manila (NCR)",
        departureDate: "",
        departureTime: "",
        capacityKg: 1000,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        axios.get("/api/trips", { signal: controller.signal })
            .then(res => setFormData(prev => ({
                ...prev,
                tripId: res.data.data.nextTripId ?? ""
            })))
            .catch(err => { if (!axios.isCancel(err)) console.error("Failed to fetch Trip ID", err) });
        return () => controller.abort();
    }, []);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.tripId) newErrors.tripId = "Trip ID is required";
        if (!formData.origin) newErrors.origin = "Route origin is required";
        if (!formData.destination) newErrors.destination = "Route destination is required";
        if (!formData.departureDate) newErrors.departureDate = "Provide a departure date";
        if (!formData.departureTime) newErrors.departureTime = "Provide a departure time";
        if (!formData.capacityKg) newErrors.capacityKg = "Capacity is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setLoading(true);
            await axios.post("/api/trips", formData);
            sileo.success({
                title: "Success",
                position: "top-right",
                description: "Trip added successfully",
                duration: 5000,
                fill: "black",
                styles: { title: "text-white", description: "text-white/75" }
            });
            onSuccess?.();
            onClose?.();
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const msg = err.response?.data?.message;
                if (msg?.includes("tripId")) setErrors({ tripId: "Trip ID already exists" });
            }
            sileo.error({ title: "Failed", description: "Failed to add trip", duration: 5000 });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof FormData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const value = field === "capacityKg" ? Number(e.target.value) : e.target.value;
        setFormData({ ...formData, [field]: value });
        if (errors[field]) setErrors({ ...errors, [field]: undefined });
    };

    return { formData, errors, loading, handleSubmit, handleChange };
}