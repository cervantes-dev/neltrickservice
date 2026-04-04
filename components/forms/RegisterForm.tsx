"use client"
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import { Spinner } from "../ui/loader/spinner";
import { validateRegister, RegisterState } from "@/libs/validations/register"

const initialState: RegisterState = {
    message: null,
    errors: {}
}

export function RegisterForm() {
    const router = useRouter()
    const [state, formAction, isLoading] = useActionState(validateRegister, initialState)

    useEffect(() => {
        if (state.success && state.email) {
            router.push(`/verification?email=${state.email}`)
        }
    }, [state.success, state.email])  

    return (
        <div>
            {/* Email/Password Form */}
            <form action={formAction} className="flex flex-col gap-4">
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className={`border p-2 rounded focus:outline-none ${state.errors?.email
                        ? "border-red-500 focus:ring-2 focus:ring-red-400"
                        : "border-gray-300 focus:ring-2 focus:ring-brand-green"
                    }`}
                />
                {state.errors?.email && (
                    <p className="text-red-500 text-sm">{state.errors.email}</p>
                )}

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className={`border p-2 rounded focus:outline-none ${state.errors?.password
                        ? "border-red-500 focus:ring-2 focus:ring-red-400"
                        : "border-gray-300 focus:ring-2 focus:ring-brand-green"
                    }`}
                />
                {state.errors?.password && (
                    <p className="text-red-500 text-sm">{state.errors.password}</p>
                )}

                {state.message && !state.success && (
                    <p className="text-red-500 text-sm">{state.message}</p>
                )}
                <button
                    disabled={isLoading}
                    className="bg-brand-green text-white flex items-center justify-center gap-2
                        hover:bg-green-800 hover:cursor-pointer transition-colors p-2 rounded
                        disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <Spinner size={14} color="#fff" />
                            <span>Sending code...</span>
                        </>
                    ) : (
                        "Sign up"
                    )}
                </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-4">
                <hr className="flex-1 border-gray-300" />
                <span className="mx-2 text-gray-500 text-sm">or continue with</span>
                <hr className="flex-1 border-gray-300" />
            </div>

            {/* Social Login Buttons */}
            <div className="flex flex-col">
                <button className="flex items-center justify-center gap-2 border p-2 rounded hover:bg-gray-100 transition-colors w-full">
                    <img src="/assets/svg-icon/google.svg" alt="Google" className="w-5 h-5" />
                    Sign up with Google
                </button>
            </div>
        </div>
    )
}