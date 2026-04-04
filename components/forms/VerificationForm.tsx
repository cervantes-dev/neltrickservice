'use client'
import { Email } from "@mui/icons-material"
import { useSearchParams, useRouter } from "next/navigation"
import { useActionState, useEffect } from "react"
import { Spinner } from "../ui/loader/spinner"
import { validateVerification, VerifyState } from "@/libs/validations/verify-email"

const initialState: VerifyState = {
    message: null,
    errors: {}
}

export function VerificationForm() {
    const searchParams = useSearchParams()
    const email = decodeURIComponent(searchParams.get("email") ?? '')
    const router = useRouter()
    const [state, formAction, isPending] = useActionState(validateVerification, initialState)

    useEffect(() => {
        if (state.success) {
            router.push('/dashboard')
        }
    }, [state.success])

    return (
        <div className="flex flex-col items-center text-center">
            <Email className="text-brand-green text-5xl mb-2" />

            <h1 className="text-2xl font-semibold">Verify it's you</h1>

            <p className="text-xs">
                We sent a verification code to <span className="font-medium">{email}</span>
            </p>

            <p className="text-xs mb-4">
                Please check your inbox and enter the code below
            </p>

            <form action={formAction} className="flex flex-col gap-4 w-full max-w-xs">

                <input type="hidden" name="email" value={email} />
                <label className="text-sm">6-digit code *</label>

                <input
                    name="otp"
                    type="text"
                    maxLength={6}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className={`border p-2 rounded w-full focus:outline-none text-center tracking-widest ${state.errors?.otp
                        ? "border-red-500 focus:ring-2 focus:ring-red-400"
                        : "border-gray-300 focus:ring-2 focus:ring-brand-green"
                    }`}
                    placeholder="000000"
                />

                {state.errors?.otp && (
                    <p className="text-red-500 text-xs">{state.errors.otp}</p>
                )}

                {state.message && !state.success && (
                    <p className="text-red-500 text-xs">{state.message}</p>
                )}

                <button
                    disabled={isPending}
                    className="bg-brand-green text-white flex items-center justify-center gap-2
                        hover:bg-green-800 hover:cursor-pointer transition-colors p-2 rounded
                        disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? (
                        <>
                            <Spinner size={14} color="#fff" />
                            <span>Verifying code...</span>
                        </>
                    ) : (
                        "Verify"
                    )}
                </button>
            </form>
        </div>
    )
}