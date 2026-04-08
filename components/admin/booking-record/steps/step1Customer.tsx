"use client"
import { useState } from "react"
import Button from "@/components/ui/Button"
import Input  from "@/components/ui/Input"
import { Search } from "@mui/icons-material"
import { useCustomerSearch } from "@/hooks/useCustomerSearch"

interface SelectedCustomer {
    id:      string | null
    name:    string
    phone:   string
    address: string
    city:    string
    isGuest: boolean
}

interface Step1Props {
    data: {
        customer: SelectedCustomer | null
    }
    onNext: (fields: {
        customer: SelectedCustomer
    }) => void
}

export default function Step1Customer({ data, onNext }: Step1Props) {

    const [mode, setMode] = useState<"existing" | "walkin">(
        data.customer?.isGuest ? "walkin" : "existing"
    )
    const [selected,      setSelected]      = useState<SelectedCustomer | null>(
        data.customer && !data.customer.isGuest ? data.customer : null
    )
    const [walkInName,    setWalkInName]    = useState(data.customer?.isGuest ? data.customer.name    : "")
    const [walkInPhone,   setWalkInPhone]   = useState(data.customer?.isGuest ? data.customer.phone   : "")
    const [walkInAddress, setWalkInAddress] = useState(data.customer?.isGuest ? data.customer.address : "")
    const [walkInCity,    setWalkInCity]    = useState(data.customer?.isGuest ? data.customer.city    : "")
    const [errors,        setErrors]        = useState<Record<string, string>>({})

    const { query, setQuery, results, isSearching, clearSearch } = useCustomerSearch()

    function handleSelect(user: { _id: string; email: string }) {
        setSelected({
            id:      user._id,
            name:    user.email,
            phone:   "",
            address: "",
            city:    "",
            isGuest: false,
        })
        setQuery(user.email)
    }

    function handleClear() {
        setSelected(null)
        clearSearch()
    }

    function switchMode(next: "existing" | "walkin") {
        setMode(next)
        setSelected(null)
        clearSearch()
        setErrors({})
    }

    function validate() {
        const errs: Record<string, string> = {}
        if (mode === "walkin") {
            if (!walkInName.trim())  errs.walkInName  = "Name is required"
            if (!walkInPhone.trim()) errs.walkInPhone = "Phone number is required"
        }
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    function handleNext() {
        if (!validate()) return

        if (mode === "walkin") {
            onNext({
                customer: {
                    id:      null,
                    name:    walkInName.trim(),
                    phone:   walkInPhone.trim(),
                    address: walkInAddress.trim(),
                    city:    walkInCity.trim(),
                    isGuest: true,
                },
            })
            return
        }

        if (!selected) return
        onNext({ customer: selected })
    }

    const canContinue = mode === "existing"
        ? selected !== null
        : walkInName.trim() !== "" && walkInPhone.trim() !== ""

    return (
        <>
            {/* Mode toggle */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <Button
                        onClick={() => switchMode("existing")}
                        variant={mode === "existing" ? "primary" : "outline"}
                        size="lg"
                        className="w-full"
                    >
                        Existing Customer
                    </Button>
                </div>
                <div className="flex-1">
                    <Button
                        onClick={() => switchMode("walkin")}
                        variant={mode === "walkin" ? "primary" : "outline"}
                        size="lg"
                        className="w-full"
                    >
                        Walk-in / Guest
                    </Button>
                </div>
            </div>

            <div className="w-full mt-6">
                <div className="w-full px-6 py-6 border border-gray-300 rounded-lg bg-white">

                    {/* Existing customer — search */}
                    {mode === "existing" && (
                        <div>
                            <h2 className="text-sm text-gray-500 font-medium mb-4 uppercase">
                                Search Customer
                            </h2>

                            <Input
                                label="Search by email"
                                placeholder="e.g. juan@gmail.com"
                                value={query}
                                onChange={(e) => {
                                    setSelected(null)
                                    setQuery(e.target.value)
                                }}
                                iconRight={<Search sx={{ fontSize: 18 }} />}
                            />

                            {isSearching && (
                                <p className="text-xs text-gray-400 mt-2 px-1">Searching...</p>
                            )}

                            {!isSearching && results.length > 0 && !selected && (
                                <div className="border border-gray-100 rounded-xl mt-2 overflow-hidden">
                                    {results.map((u) => (
                                        <button
                                            key={u._id}
                                            onClick={() => handleSelect(u)}
                                            className="w-full text-left px-4 py-3 text-sm text-gray-900
                                                hover:bg-gray-50 border-b border-gray-50
                                                last:border-0 transition-colors duration-150"
                                        >
                                            {u.email}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {!isSearching && query.trim() && results.length === 0 && !selected && (
                                <div className="mt-2 p-4 border border-dashed border-gray-200 rounded-xl text-center">
                                    <p className="text-sm text-gray-400">
                                        No customers found for "{query}"
                                    </p>
                                    <p className="text-xs text-gray-300 mt-1">
                                        Try walk-in mode if they don't have an account
                                    </p>
                                </div>
                            )}

                            {selected && (
                                <div className="mt-3 flex items-center gap-3 px-4 py-3
                                    border border-green-200 bg-green-50 rounded-xl">
                                    <div className="w-8 h-8 rounded-full bg-green-700 flex items-center
                                        justify-center text-white text-xs font-medium shrink-0">
                                        {selected.name[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-green-800 truncate">
                                            {selected.name}
                                        </p>
                                        <p className="text-xs text-green-600">Registered customer</p>
                                    </div>
                                    <button
                                        onClick={handleClear}
                                        className="text-xs text-gray-400 hover:text-red-400 transition-colors shrink-0"
                                    >
                                        Clear
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Walk-in form */}
                    {mode === "walkin" && (
                        <div>
                            <h2 className="text-sm text-gray-500 font-medium mb-1 uppercase">
                                Walk-in Customer Details
                            </h2>
                            <p className="text-xs text-gray-400 mb-4">
                                No account required. Name and phone number only.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                <Input
                                    label="Full name"
                                    placeholder="e.g. Pedro Reyes"
                                    required
                                    value={walkInName}
                                    onChange={(e) => setWalkInName(e.target.value)}
                                    error={errors.walkInName}
                                />
                                <Input
                                    label="Phone number"
                                    placeholder="09XX XXX XXXX"
                                    required
                                    value={walkInPhone}
                                    onChange={(e) => setWalkInPhone(e.target.value)}
                                    error={errors.walkInPhone}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Input
                                    label="Barangay / Street (optional)"
                                    placeholder="e.g. Brgy. Sagkahan"
                                    value={walkInAddress}
                                    onChange={(e) => setWalkInAddress(e.target.value)}
                                />
                                <Input
                                    label="City / Municipality (optional)"
                                    placeholder="e.g. Tacloban City"
                                    value={walkInCity}
                                    onChange={(e) => setWalkInCity(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">Step 1 of 5</p>
                <Button onClick={handleNext} disabled={!canContinue}>
                    Continue
                </Button>
            </div>
        </>
    )
}