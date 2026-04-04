import { InputHTMLAttributes, ReactNode } from "react"
import { cn } from "@/libs/utils"

const sizeStyles = {
  sm: "h-8  px-2.5 text-xs",
  md: "h-10 px-3   text-sm",
  lg: "h-11 px-4   text-base",
}

// ✦ Extra left/right padding when an icon is present
const iconPaddingStyles = {
  sm: { left: "pl-7",  right: "pr-7"  },
  md: { left: "pl-9",  right: "pr-9"  },
  lg: { left: "pl-10", right: "pr-10" },
}

// ✦ Icon wrapper size + centering per size variant
const iconSizeStyles = {
  sm: "w-7  text-xs",
  md: "w-9  text-sm",
  lg: "w-10 text-base",
}

const stateStyles = {
  default: "border-gray-200 focus:border-green-600 focus:ring-green-600/10",
  error:   "border-red-400  focus:border-red-500   focus:ring-red-500/10",
}

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?:      "sm" | "md" | "lg"
  label?:     string
  error?:     string
  required?:  boolean
  iconLeft?:  ReactNode   // ← new
  iconRight?: ReactNode   // ← new
}

export default function Input({
  size = "md",
  label,
  error,
  required,
  className,
  iconLeft,
  iconRight,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col w-full">

      {label && (
        <label className="block text-xs text-gray-500 mb-1 uppercase">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* ✦ Wrapper carries `relative` so icons can be absolutely placed */}
      <div className="relative flex items-center">

        {iconLeft && (
          <span className={cn(
            "absolute left-0 inset-y-0 flex items-center justify-center",
            "text-gray-400 pointer-events-none",
            iconSizeStyles[size]
          )}>
            {iconLeft}
          </span>
        )}

        <input
          className={cn(
            "w-full rounded-lg border bg-white text-gray-900",
            "placeholder:text-gray-400",
            "hover:border-gray-300",
            "focus:outline-none focus:ring-2",
            "transition-colors duration-150",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            sizeStyles[size],
            // ✦ Only override the side that has an icon
            iconLeft  && iconPaddingStyles[size].left,
            iconRight && iconPaddingStyles[size].right,
            stateStyles[error ? "error" : "default"],
            className
          )}
          {...props}
        />

        {iconRight && (
          <span className={cn(
            "absolute right-0 inset-y-0 flex items-center justify-center",
            "text-gray-400 pointer-events-none",
            iconSizeStyles[size]
          )}>
            {iconRight}
          </span>
        )}

      </div>

      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}

    </div>
  )
}