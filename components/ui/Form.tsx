import {
    FormHTMLAttributes, 
    InputHTMLAttributes, 
    LabelHTMLAttributes, 
    SelectHTMLAttributes 
} from "react";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
}

interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
}

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
  placeholder?: string;
  error?: boolean;
}

interface FormErrorProps {
  message?: string;
}

export function Form({ children, onSubmit, className = "", ...props }: FormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={`flex flex-col gap-4 ${className}`}
      {...props}
    >
      {children}
    </form>
  );
}

export function FormField({ children, className = "" }: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {children}
    </div>
  );
}

export function FormLabel({ children, required, className = "", ...props }: FormLabelProps) {
  return (
    <label
      className={`text-sm font-medium text-gray-700 ${className}`}
      {...props}
    >
      {children}
      {required && (
        <span className="text-red-500 ml-1">*</span>
      )}
    </label>
  );
}

export function FormInput({ error, className = "", ...props }: FormInputProps) {
  return (
    <input
      className={`
        w-full px-3 py-2 text-sm rounded-md border outline-none
        placeholder:text-gray-400 text-gray-700
        transition-all duration-150
        ${error
          ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
          : "border-brand-green/30 bg-brand-green/5 focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green/50"
        }
        ${className}
      `}
      {...props}
    />
  );
}

export function FormSelect({ options, placeholder, error, className = "", ...props }: FormSelectProps) {
  return (
    <select
      className={`
        w-full px-3 py-2 text-sm rounded-md border outline-none
        text-gray-700 transition-all duration-150
        ${error
          ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
          : "border-brand-green/30 bg-brand-green/5 focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green/50"
        }
        ${className}
      `}
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
  );
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <p className="text-xs text-red-500 flex items-center gap-1">
      <span>⚠</span>
      {message}
    </p>
  );
}