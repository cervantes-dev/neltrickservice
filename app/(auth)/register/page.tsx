"use client"
import { RegisterForm } from "@/components/forms/RegisterForm";
export default function SignUp() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <RegisterForm />
            </div>
        </div>
    )
}