"use client"

import { useState } from "react"

type TrackingStatus = "idle" | "loading" | "found" | "not_found"

interface TrackingStep {
  label: string
  location: string
  date: string
  done: boolean
  active: boolean
}

const MOCK_DATA: Record<string, { steps: TrackingStep[]; eta: string; origin: string; destination: string }> = {
  "NTK-000123": {
    eta: "April 21, 2026",
    origin: "Cebu City",
    destination: "Manila",
    steps: [
      { label: "Package Picked Up", location: "Cebu City", date: "Apr 17, 2026 · 9:00 AM", done: true, active: false },
      { label: "Arrived at Sorting Facility", location: "Mactan Hub, Cebu", date: "Apr 17, 2026 · 3:45 PM", done: true, active: false },
      { label: "In Transit", location: "En route to Manila", date: "Apr 18, 2026 · 7:00 AM", done: true, active: true },
      { label: "Out for Delivery", location: "Manila Distribution Center", date: "—", done: false, active: false },
      { label: "Delivered", location: "—", date: "—", done: false, active: false },
    ],
  },
  "NTK-000456": {
    eta: "April 19, 2026",
    origin: "Davao City",
    destination: "Quezon City",
    steps: [
      { label: "Package Picked Up", location: "Davao City", date: "Apr 16, 2026 · 10:00 AM", done: true, active: false },
      { label: "Arrived at Sorting Facility", location: "Davao Hub", date: "Apr 16, 2026 · 2:00 PM", done: true, active: false },
      { label: "In Transit", location: "En route to Manila", date: "Apr 17, 2026 · 6:00 AM", done: true, active: false },
      { label: "Out for Delivery", location: "Quezon City Hub", date: "Apr 19, 2026 · 8:00 AM", done: true, active: true },
      { label: "Delivered", location: "—", date: "—", done: false, active: false },
    ],
  },
}

export default function Tracking() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [status, setStatus] = useState<TrackingStatus>("idle")
  const [result, setResult] = useState<(typeof MOCK_DATA)[string] | null>(null)

  function handleTrack() {
    if (!trackingNumber.trim()) return
    setStatus("loading")
    setResult(null)

    setTimeout(() => {
      const found = MOCK_DATA[trackingNumber.trim().toUpperCase()]
      if (found) {
        setResult(found)
        setStatus("found")
      } else {
        setStatus("not_found")
      }
    }, 1000)
  }

  const activeStep = result?.steps.findIndex((s) => s.active) ?? -1
  const progressPercent =
    result
      ? Math.round(((result.steps.filter((s) => s.done).length) / result.steps.length) * 100)
      : 0

  return (
    <section
      id="tracking"
      className="w-full bg-gray-950 px-6 md:px-16 lg:px-24 py-20 md:py-28 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-green-700 opacity-10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-green-400 bg-green-950 border border-green-800 px-4 py-1.5 rounded-full mb-4">
            Real-Time Tracking
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white mb-4">
            Where's Your{" "}
            <span className="text-green-400">Package?</span>
          </h2>
          <p className="text-sm md:text-base text-gray-400 max-w-md">
            Enter your NelTrick tracking number to see live delivery status and estimated arrival.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => {
              setTrackingNumber(e.target.value)
              setStatus("idle")
              setResult(null)
            }}
            onKeyDown={(e) => e.key === "Enter" && handleTrack()}
            placeholder="e.g. NTK-000123"
            className="
              flex-1 bg-gray-900 border border-gray-700 text-white placeholder-gray-500
              rounded-xl px-5 py-4 text-sm font-medium
              focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20
              transition-all duration-200
            "
          />
          <button
            onClick={handleTrack}
            disabled={status === "loading"}
            className="
              bg-green-700 hover:bg-green-600 active:bg-green-800
              disabled:opacity-60 disabled:cursor-not-allowed
              text-white font-semibold text-sm
              px-8 py-4 rounded-xl
              transition-colors duration-200
              whitespace-nowrap
            "
          >
            {status === "loading" ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Tracking...
              </span>
            ) : "Track Package"}
          </button>
        </div>

        {/* Try demo hint */}
        {status === "idle" && (
          <p className="text-center text-xs text-gray-600 -mt-6 mb-8">
            Try demo codes:{" "}
            <button onClick={() => setTrackingNumber("NTK-000123")} className="text-green-500 hover:underline">NTK-000123</button>
            {" "}or{" "}
            <button onClick={() => setTrackingNumber("NTK-000456")} className="text-green-500 hover:underline">NTK-000456</button>
          </p>
        )}

        {/* Not found */}
        {status === "not_found" && (
          <div className="bg-red-950/40 border border-red-800/50 rounded-2xl p-6 text-center">
            <p className="text-red-400 font-semibold text-sm mb-1">Tracking number not found</p>
            <p className="text-gray-500 text-xs">Double-check your number or contact our support team.</p>
          </div>
        )}

        {/* Result */}
        {status === "found" && result && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">

            {/* Summary bar */}
            <div className="border-b border-gray-800 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Tracking ID</p>
                <p className="text-white font-bold text-base">{trackingNumber.toUpperCase()}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Estimated Delivery</p>
                <p className="text-green-400 font-bold text-base">{result.eta}</p>
              </div>
            </div>

            {/* Route */}
            <div className="border-b border-gray-800 px-6 py-4 flex items-center gap-3 text-sm">
              <span className="text-gray-400">{result.origin}</span>
              <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
              <span className="text-white font-semibold">{result.destination}</span>

              {/* Progress bar */}
              <div className="flex-1 hidden sm:block">
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              <span className="hidden sm:block text-xs text-gray-500">{progressPercent}%</span>
            </div>

            {/* Steps */}
            <div className="px-6 py-6 flex flex-col gap-0">
              {result.steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  {/* Timeline spine */}
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-3.5 h-3.5 rounded-full shrink-0 mt-0.5 border-2
                      ${step.active ? "bg-green-400 border-green-400 ring-4 ring-green-500/20" : ""}
                      ${step.done && !step.active ? "bg-green-700 border-green-700" : ""}
                      ${!step.done && !step.active ? "bg-gray-800 border-gray-700" : ""}
                    `} />
                    {i < result.steps.length - 1 && (
                      <div className={`w-0.5 flex-1 my-1 min-h-7 ${step.done ? "bg-green-800" : "bg-gray-800"}`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`pb-5 ${i === result.steps.length - 1 ? "pb-0" : ""}`}>
                    <p className={`text-sm font-semibold leading-tight ${step.active ? "text-green-400" : step.done ? "text-white" : "text-gray-600"}`}>
                      {step.label}
                      {step.active && (
                        <span className="ml-2 text-xs font-normal bg-green-900 text-green-300 px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </p>
                    <p className={`text-xs mt-0.5 ${step.done || step.active ? "text-gray-400" : "text-gray-700"}`}>
                      {step.location !== "—" ? step.location : ""}
                      {step.location !== "—" && step.date !== "—" ? " · " : ""}
                      {step.date !== "—" ? step.date : ""}
                      {step.location === "—" && step.date === "—" ? "Pending" : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </section>
  )
}