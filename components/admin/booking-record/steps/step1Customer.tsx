"use client"
import { useState, useEffect, useRef } from "react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Search } from "@mui/icons-material"

interface SelectedCustomer {
    id: string | null
    name: string
    phone: string
    address: string
    city: string
    isGuest: boolean
}

interface SearchResult {
    _id: string
    email: string
}

interface Step1Props {
    data: {
        customer: SelectedCustomer | null
        saveAsCustomer: boolean
    }
    onNext: (fields: {
        customer: SelectedCustomer
        saveAsCustomer: boolean
    }) => void
}

const SelectCustomer = [
    { value: "existing", label: "Existing Customer" },
    { value: "walkin", label: "Walk-in Customer" },
    { value: "vip", label: "VIP Customer" },
]

export default function Step1Customer({ data, onNext }: Step1Props) {

    const [mode, setMode] = useState<"existing" | "walkin">("existing")
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<SearchResult[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [selected, setSelected] = useState<SelectedCustomer | null>(data.customer)
    const [saveAsCustomer, setSaveAsCustomer] = useState(data.saveAsCustomer)
    const [walkInName, setWalkInName] = useState(data.customer?.isGuest ? data.customer.name : "")
    const [walkInPhone, setWalkInPhone] = useState(data.customer?.isGuest ? data.customer.phone : "")
    const [walkInAddress, setWalkInAddress] = useState(data.customer?.isGuest ? data.customer.address : "")
    const [walkInCity, setWalkInCity] = useState(data.customer?.isGuest ? data.customer.city : "")
    const [errors, setErrors] = useState<Record<string, string>>({})
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (mode !== "existing" || !query.trim()) {
            setResults([])
            return
        }
        setIsSearching(true)
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/users?search=${encodeURIComponent(query)}&limit=10`)
                const json = await res.json()
                setResults(json.success ? json.data : [])
            } catch {
                setResults([])
            } finally {
                setIsSearching(false)
            }
        }, 300)

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [query, mode])

    function handleSelect(user: SearchResult) {
        setSelected({
            id: user._id,
            name: user.email, // display by email since no name on User model
            phone: "",
            address: "",
            city: "",
            isGuest: false,
        })
        setQuery(user.email)
        setResults([])
    }

    function handleClear() {
        setSelected(null)
        setQuery("")
        setResults([])
    }

    function validate() {
        const errs: Record<string, string> = {}
        if (mode === "walkin") {
            if (!walkInName.trim()) errs.walkInName = "Name is required"
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
                    id: null,
                    name: walkInName.trim(),
                    phone: walkInPhone.trim(),
                    address: walkInAddress.trim(),
                    city: walkInCity.trim(),
                    isGuest: true,
                },
                saveAsCustomer,
            })
            return
        }

        if (!selected) return
        onNext({ customer: selected, saveAsCustomer: false })
    }

    const canContinue = mode === "existing"
        ? selected !== null
        : walkInName.trim() !== "" && walkInPhone.trim() !== ""

    return (

        <>
            <div className="flex gap-4">
                <div className="flex-1">
                    <Button
                        onClick={() => { setMode("existing"); setSelected(null); setQuery("") }}
                        variant={mode === "existing" ? "primary" : "outline"}
                        size="lg"
                        className="w-full flex-1"
                    >
                        Existing Customer
                    </Button>
                </div>

                <div className="flex-1">
                    <Button
                        onClick={() => { setMode("walkin"); setSelected(null) }}
                        variant={mode === "existing" ? "outline" : "primary"}
                        size="lg"
                        className="w-full flex-1"
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
                                onChange={(e) => { setSelected(null); setQuery(e.target.value) }}
                                iconRight={<Search sx={{ fontSize: 18 }} />}
                            />

                            {/* Loading */}
                            {isSearching && (
                                <p className="text-xs text-gray-400 mt-2">Searching...</p>
                            )}

                            {/* Results dropdown */}
                            {!isSearching && results.length > 0 && !selected && (
                                <div className="border border-gray-100 rounded-xl mt-1 overflow-hidden">
                                    {results.map(u => (
                                        <button
                                            key={u._id}
                                            onClick={() => handleSelect(u)}
                                            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50
                             border-b border-gray-50 last:border-0 transition-colors"
                                        >
                                            {u.email}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* No results */}
                            {!isSearching && query.trim() && results.length === 0 && !selected && (
                                <div className="mt-2 p-4 border border-dashed border-gray-200 rounded-xl text-center">
                                    <p className="text-sm text-gray-400">No customers found for "{query}"</p>
                                    <p className="text-xs text-gray-300 mt-1">
                                        Try walk-in mode if they don't have an account
                                    </p>
                                </div>
                            )}

                            {/* Selected card */}
                            {selected && (
                                <div className="mt-3 flex items-center gap-3 px-4 py-3
                            border border-green-200 bg-green-50 rounded-xl">
                                    <div className="w-8 h-8 rounded-full bg-green-700 flex items-center
                              justify-center text-white text-xs font-medium">
                                        {selected.name[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-green-800">{selected.name}</p>
                                        <p className="text-xs text-green-600">Registered customer</p>
                                    </div>
                                    <button
                                        onClick={handleClear}
                                        className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                                    >
                                        Clear
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    {/* Walk-in form */}
                    {mode === "walkin" && (
                        <div className="border border-gray-100 rounded-xl p-4">
                            <p className="text-xs text-gray-400 mb-4">
                                No account needed. Name and phone only.
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

                            {/* Save as customer checkbox */}
                            <label className="flex items-start gap-3 mt-4 p-3
                            border border-amber-200 bg-amber-50 rounded-xl cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={saveAsCustomer}
                                    onChange={(e) => setSaveAsCustomer(e.target.checked)}
                                    className="mt-0.5 accent-amber-500"
                                />
                                <div>
                                    <p className="text-sm font-medium text-amber-800">Save as new customer</p>
                                    <p className="text-xs text-amber-600 mt-0.5">
                                        Creates a record so this person can be found in future bookings
                                    </p>
                                </div>
                            </label>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center pt-4 mt-4
                      border-t border-gray-100">
                <p className="text-xs text-gray-400">Step 1 of 5</p>
                <Button
                    onClick={handleNext}
                    disabled={!canContinue}
                >
                    Continue
                </Button>
            </div>
        </>
    )
}