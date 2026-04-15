"use client"
import { useState } from "react"
import Input  from "@/components/ui/Input"
import Button from "@/components/ui/Button"

interface PackageItem {
    id:          number
    description: string
    weight:      number
    boxes:       number
}

interface Step3Props {
    data: {
        packages: PackageItem[]
    }
    onNext: (fields: { packages: PackageItem[] }) => void
    onBack: () => void
}

export default function Step3Packages({ data, onNext, onBack }: Step3Props) {
    const [packages,    setPackages]    = useState<PackageItem[]>(data.packages)
    const [description, setDescription] = useState("")
    const [weight,      setWeight]      = useState<number>(5)
    const [boxes,       setBoxes]       = useState<number>(1)

    function addPackage() {
        if (!description.trim()) return
        setPackages(prev => [...prev, {
            id:          Date.now(),
            description: description.trim(),
            weight,
            boxes,
        }])
        setDescription("")
        setWeight(5)
        setBoxes(1)
    }

    function removePackage(id: number) {
        setPackages(prev => prev.filter(pkg => pkg.id !== id))
    }

    function handleNext() {
        if (packages.length === 0) return
        onNext({ packages })
    }

    const totalWeight = packages.reduce((sum, pkg) => sum + pkg.weight, 0)

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">

            <h2 className="text-base font-semibold text-gray-900 mb-1">
                Add packages
            </h2>
            <p className="text-xs text-gray-400 mb-6">
                List every item being shipped on this booking.
                Each package gets its own entry and tracking number.
            </p>

            {/* Package list */}
            <div className="flex flex-col gap-2 mb-4">
                {packages.map((pkg) => (
                    <div
                        key={pkg.id}
                        className="flex items-center gap-3 bg-gray-50 rounded-xl
                                   px-4 py-3 border border-gray-100"
                    >
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 truncate">
                                {pkg.description}
                            </p>
                            <p className="text-xs text-gray-400">
                                {pkg.boxes} box{pkg.boxes > 1 ? "es" : ""} · {pkg.weight} kg
                            </p>
                        </div>
                        <span className="text-xs font-medium text-green-700 bg-green-50
                                         px-2 py-1 rounded-lg whitespace-nowrap">
                            {pkg.weight} kg
                        </span>
                        <button
                            onClick={() => removePackage(pkg.id)}
                            className="text-xs text-gray-400 hover:text-red-500
                                       transition-colors duration-150"
                        >
                            remove
                        </button>
                    </div>
                ))}

                {packages.length === 0 && (
                    <div className="text-center py-8 border border-dashed
                                    border-gray-200 rounded-xl">
                        <p className="text-sm text-gray-400">No packages added yet</p>
                        <p className="text-xs text-gray-300 mt-1">
                            Add your first package below
                        </p>
                    </div>
                )}
            </div>

            {/* Add package form */}
            <div className="border border-dashed border-gray-200 rounded-xl p-4 mb-6">
                <p className="text-xs font-medium text-gray-500 mb-3">Add a package</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    <div className="sm:col-span-1">
                        <Input
                            label="Description"
                            placeholder="e.g. Dried fish, laptop..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addPackage()}
                        />
                    </div>
                    <Input
                        label="Weight (kg)"
                        type="number"
                        min={0.5}
                        step={0.5}
                        value={weight}
                        onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                    />
                    <Input
                        label="No. of boxes"
                        type="number"
                        min={1}
                        value={boxes}
                        onChange={(e) => setBoxes(parseInt(e.target.value) || 1)}
                    />
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={addPackage}
                    disabled={!description.trim()}
                >
                    + Add to list
                </Button>
            </div>

            {/* Total weight */}
            {packages.length > 0 && (
                <div className="flex items-center justify-between bg-green-50
                                border border-green-100 rounded-xl px-4 py-3 mb-6">
                    <div>
                        <p className="text-xs text-green-700 font-medium">
                            Total cargo weight
                        </p>
                        <p className="text-xs text-green-600">
                            {packages.length} package{packages.length > 1 ? "s" : ""}
                        </p>
                    </div>
                    <p className="text-lg font-semibold text-green-700">
                        {totalWeight.toFixed(1)} kg
                    </p>
                </div>
            )}

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <Button variant="ghost" onClick={onBack}>
                    Back
                </Button>
                <div className="flex items-center gap-3">
                    <p className="text-xs text-gray-400">Step 3 of 5</p>
                    <Button
                        onClick={handleNext}
                        disabled={packages.length === 0}
                    >
                        Continue
                    </Button>
                </div>
            </div>

        </div>
    )
}