import { SelectHTMLAttributes } from "react"
import { cn } from "@/libs/utils"

const sizeStyles = {
  sm: "h-8  px-2.5 text-xs",
  md: "h-10 px-3   text-sm",
  lg: "h-11 px-4   text-base",
}

const stateStyles = {
  default: "border-gray-200 focus:border-green-600 focus:ring-green-600/10",
  error:   "border-red-400  focus:border-red-500   focus:ring-red-500/10",
}

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options:      SelectOption[]
  placeholder?: string
  size?:        "sm" | "md" | "lg"
  label?:       string
  error?:       string
  required?:    boolean
}

export default function Select({
  options,
  placeholder,
  size = "md",
  label,
  error,
  required,
  className,
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col w-full">

      {label && (
        <label className="block text-xs text-gray-500 mb-1">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">

        <select
          className={cn(
            "w-full rounded-lg border bg-white text-gray-900",
            "appearance-none cursor-pointer",
            "pr-9",
            "hover:border-gray-300",
            "focus:outline-none focus:ring-2",
            "transition-colors duration-150",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            sizeStyles[size],
            stateStyles[error ? "error" : "default"],
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}

        </select>

        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 5l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            />
          </svg>
        </div>

      </div>

      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}

    </div>
  )
}