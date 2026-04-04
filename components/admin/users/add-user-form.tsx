"use client"
import { useState } from "react";
import axios from "axios";
import {
    Form, FormField, FormLabel,
    FormInput, FormSelect, FormError
} from "@/components/ui/Form";
import Button from "@/components/ui/Button";

interface AddUserFormProps {
    onClose?: () => void;
    onSuccess?: () => void;
}

interface FormData {
    email: string;
    role: string;
    password: string;
}

interface FormErrors {
    email?: string;
    role?: string;
    password?: string;
}

export default function AddUserForm({ onClose, onSuccess }: AddUserFormProps) {
    const [formData, setFormData] = useState<FormData>({
        email: "",
        role: "",
        password: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);

    // 1️⃣ Validation
    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (!formData.role) {
            newErrors.role = "Role is required";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // ✅ true = no errors
    };

    // 2️⃣ Submit handler
    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validate()) return; // ❌ stop if invalid

        try {
            setLoading(true);
            await axios.post("/api/users", formData);
            onSuccess?.(); // 👈 tell parent to refresh table
            onClose?.();   // 👈 close the modal
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const msg = err.response?.data?.message;
                if (msg?.includes("email")) {
                    setErrors({ email: "Email already exists" });
                }
            }
        } finally {
            setLoading(false);
        }
    };

    // 3️⃣ Change handler
    const handleChange = (field: keyof FormData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [field]: e.target.value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: undefined }); // 👈 clear error on type
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormField>
                <FormLabel htmlFor="email" required>Email</FormLabel>
                <FormInput
                    id="email"
                    type="email"
                    placeholder="user@email.com"
                    value={formData.email}
                    onChange={handleChange("email")}
                    error={!!errors.email}
                />
                <FormError message={errors.email} />
            </FormField>

            <FormField>
                <FormLabel htmlFor="role" required>Role</FormLabel>
                <FormSelect
                    id="role"
                    placeholder="Select a role"
                    value={formData.role}
                    onChange={handleChange("role")}
                    error={!!errors.role}
                    options={[
                        { label: "Admin", value: "admin" },
                        { label: "Staff", value: "staff" },
                        { label: "Customer", value: "customer" },
                    ]}
                />
                <FormError message={errors.role} />
            </FormField>

            <FormField>
                <FormLabel htmlFor="password" required>Password</FormLabel>
                <FormInput
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange("password")}
                    error={!!errors.password}
                />
                <FormError message={errors.password} />
            </FormField>

            <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    size="sm"
                    loading={loading}
                >
                    Add user
                </Button>
            </div>
        </Form>
    );
}