"use client"
import { useActionState, useEffect } from "react"
import { useRouter }                 from "next/navigation"
import { Spinner }                   from "../../../components/ui/loader/spinner"
import { validateLogin, LoginState } from "@/libs/validations/login"

const initialState: LoginState = {
  message: null,
  errors:  {}
}

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(validateLogin, initialState)

  useEffect(() => {
    if (state.success) {
      if (onSuccess) {
        onSuccess()                  
      } else {
        router.push('/dashboard')   
      }
    }
  }, [state.success])

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input
        name="email"
        type="email"
        className={`border p-2 rounded focus:outline-none ${state.errors?.email
          ? "border-red-500 focus:ring-2 focus:ring-red-400"
          : "border-gray-300 focus:ring-2 focus:ring-brand-green"
        }`}
        placeholder="Email"
      />
      {state.errors?.email && (
        <p className="text-red-500 text-sm">{state.errors.email}</p>
      )}

      <input
        name="password"
        type="password"
        className={`border p-2 rounded focus:outline-none ${state.errors?.password
          ? "border-red-500 focus:ring-2 focus:ring-red-400"
          : "border-gray-300 focus:ring-2 focus:ring-brand-green"
        }`}
        placeholder="Password"
      />
      {state.errors?.password && (
        <p className="text-red-500 text-sm">{state.errors.password}</p>
      )}

      {state.message && !state.success && (
        <p className="text-red-500 text-sm">{state.message}</p>
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
            <span>Logging in...</span>
          </>
        ) : (
          "Login"
        )}
      </button>
    </form>
  )
}