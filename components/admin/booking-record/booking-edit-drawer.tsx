"use client"
import { useState, useEffect, useCallback } from "react"
import { Close } from "@mui/icons-material"
import { BookingType } from "@/libs/types/booking.type"
import axios from "axios"
import { sileo } from "sileo"

type EditPayload = {
  recipientName: string
  recipientContact: string
  packages: { _id?: string; description: string; boxes: number; weight: number }[]
  paymentStatus: string
  paymentMethod: string
  instructions: string
}

type Props = {
  booking: BookingType | null
  onClose: () => void
  onSaved: () => void
}

export default function BookingEditDrawer({ booking, onClose, onSaved }: Props) {
  const [form, setForm] = useState<EditPayload | null>(null)
  const [saving, setSaving] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (booking) {
      setForm({
        recipientName: booking.recipientName ?? "",
        recipientContact: booking.recipientContact ?? "",
        packages: (booking.packages ?? []).map(p => ({
          _id: p._id,
          description: p.description,
          boxes: p.boxes,
          weight: p.weight,
        })),
        paymentStatus: booking.paymentStatus ?? "unpaid",
        paymentMethod: booking.paymentMethod ?? "cash",
        instructions: booking.instructions ?? "",
      })
      requestAnimationFrame(() => setVisible(true))
    } else {
      setVisible(false)
    }
  }, [booking])

  const handleClose = useCallback(() => {
    setVisible(false)
    setTimeout(onClose, 250)
  }, [onClose])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleClose])

  const updatePackage = (i: number, field: string, value: string | number) => {
    if (!form) return
    const pkgs = [...form.packages]
    pkgs[i] = { ...pkgs[i], [field]: value }
    setForm({ ...form, packages: pkgs })
  }

  const addPackage = () => {
    if (!form) return
    setForm({ ...form, packages: [...form.packages, { description: "", boxes: 1, weight: 0 }] })
  }

  const removePackage = (i: number) => {
    if (!form) return
    setForm({ ...form, packages: form.packages.filter((_, idx) => idx !== i) })
  }

  const handleSave = async () => {
    if (!booking || !form) return
    setSaving(true)
    try {
      await axios.patch(`/api/booking-record/${booking._id}`, form)
      sileo.success({
        title: "Success",
        position: "top-right",
        description: "Booking updated successfully",
        duration: 5000,
        fill: "black",
        styles: { title: "text-white", description: "text-white/75" }
      })
      onSaved()
    } catch {
      sileo.error({
        title: "Failed to update",
        position: "top-center",
        description: "Something went wrong. Please try again.",
        duration: 5000,
        fill: "black",
        styles: { title: "text-white", description: "text-white/75" }
      })
    } finally {
      setSaving(false)
    }
  }

  if (!booking || !form) return null

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-40 bg-black/20 transition-opacity duration-250"
        style={{ opacity: visible ? 1 : 0 }}
      />

      <div
        className="fixed right-0 top-0 h-full w-90 bg-white z-50 flex flex-col border-l border-gray-100 transition-transform duration-250 ease-out"
        style={{ transform: visible ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-800">Edit booking</p>
            <p className="text-xs font-mono text-brand-green mt-0.5">{booking.bookingRef}</p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close drawer">
            <Close fontSize="small" />
          </button>
        </div>

        {/* Read-only trip info */}
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-2">
            Trip · read-only
          </p>
          <div className="flex gap-6">
            <div>
              <p className="text-[10px] text-gray-400">Route</p>
              <p className="text-xs font-medium text-gray-700 mt-0.5">
                {booking.origin}
                <span className="text-green-500 mx-1">→</span>
                {booking.destination}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400">Departure</p>
              <p className="text-xs font-medium text-gray-700 mt-0.5">{booking.departure}</p>
            </div>
          </div>
        </div>

        {/* Scrollable form */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-gray-500 mb-1 block">Recipient name</label>
              <input
                type="text"
                value={form.recipientName}
                onChange={e => setForm({ ...form, recipientName: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-500 mb-1 block">Contact</label>
              <input
                type="text"
                value={form.recipientContact}
                onChange={e => setForm({ ...form, recipientContact: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-gray-500 mb-1 block">Packages</label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-[1fr_52px_64px_28px] bg-gray-50 border-b border-gray-100">
                <span className="text-[10px] text-gray-400 px-3 py-2">Description</span>
                <span className="text-[10px] text-gray-400 px-2 py-2 border-l border-gray-100">Boxes</span>
                <span className="text-[10px] text-gray-400 px-2 py-2 border-l border-gray-100">Wt (kg)</span>
                <div />
              </div>
              {form.packages.map((pkg, i) => (
                <div key={i} className="grid grid-cols-[1fr_52px_64px_28px] border-b border-gray-100 last:border-0">
                  <input
                    type="text"
                    value={pkg.description}
                    onChange={e => updatePackage(i, "description", e.target.value)}
                    placeholder="Description"
                    className="text-xs px-3 py-2 outline-none bg-transparent"
                  />
                  <input
                    type="number"
                    value={pkg.boxes}
                    min={1}
                    onChange={e => updatePackage(i, "boxes", Number(e.target.value))}
                    className="text-xs px-2 py-2 border-l border-gray-100 outline-none bg-transparent w-full"
                  />
                  <input
                    type="number"
                    value={pkg.weight}
                    min={0}
                    step={0.1}
                    onChange={e => updatePackage(i, "weight", Number(e.target.value))}
                    className="text-xs px-2 py-2 border-l border-gray-100 outline-none bg-transparent w-full"
                  />
                  <button
                    onClick={() => removePackage(i)}
                    className="text-gray-300 hover:text-red-400 text-sm flex items-center justify-center transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
              {form.packages.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">No packages added.</p>
              )}
            </div>
            <button onClick={addPackage} className="mt-1.5 text-[11px] text-brand-green hover:underline">
              + Add package
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-gray-500 mb-1 block">Payment status</label>
              <select
                value={form.paymentStatus}
                onChange={e => setForm({ ...form, paymentStatus: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green bg-white"
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-gray-500 mb-1 block">Method</label>
              <select
                value={form.paymentMethod}
                onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green bg-white"
              >
                <option value="cash">Cash</option>
                <option value="gcash">GCash</option>
                <option value="maya">Maya</option>
                <option value="bank">Bank transfer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-gray-500 mb-1 block">Special instructions</label>
            <textarea
              rows={3}
              value={form.instructions}
              onChange={e => setForm({ ...form, instructions: e.target.value })}
              placeholder="Fragile, handle with care..."
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] text-gray-400">Press ESC to close</p>
          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className="text-xs px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-xs px-4 py-2 rounded-lg bg-brand-green text-white font-medium hover:bg-brand-green/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}