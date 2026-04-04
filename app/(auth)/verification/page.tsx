import { VerificationForm } from "@/components/forms/VerificationForm"

export default function Verify() {

    return (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-md w-80 bg-white p-8 rounded-lg shadow-md">
                <VerificationForm />
            </div>
        </div>
    )
}