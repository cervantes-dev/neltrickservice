// components/ui/Textarea.tsx
import { TextareaHTMLAttributes } from "react"
import { cn } from "@/libs/utils"

const stateStyles = {
  default: "border-gray-200 focus:border-green-600 focus:ring-green-600/10",
  error:   "border-red-400  focus:border-red-500   focus:ring-red-500/10",
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?:    string
  error?:    string
  required?: boolean
}

export default function Textarea({
  label,
  error,
  required,
  rows = 3,
  className,
  ...props
}: TextareaProps) {
  return (
    <div className="flex flex-col w-full">

      {label && (
        <label className="block text-xs text-gray-500 mb-1">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <textarea
        rows={rows}
        className={cn(
          "w-full rounded-lg border bg-white text-gray-900",
          "px-3 py-2.5",
          "placeholder:text-gray-400",
          "resize-none",
          "hover:border-gray-300",
          "focus:outline-none focus:ring-2",
          "transition-colors duration-150",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          stateStyles[error ? "error" : "default"],
          className
        )}
        {...props}
      />

      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}

    </div>
  )
}