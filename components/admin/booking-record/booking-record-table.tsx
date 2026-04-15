"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useBooking } from "@/hooks/useBooking"
import {
    Table, TableHeader, TableBody,
    TableRow, TableHead, TableCell
} from "@/components/ui/Table"
import { Menu, MenuTrigger, MenuList, MenuItem } from "@/components/ui/Menu"
import { Visibility, Edit, Delete } from "@mui/icons-material"
import { BookingType, BookingPackageType } from "@/libs/types/booking.type"
import Pagination from "@/components/ui/Pagination"

const STATUS_TABS = [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "In transit", value: "in_transit" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
]

export default function BookingRecordClient() {
    const router = useRouter()
    const [page, setPage] = useState(1)
    const [refresh, setRefresh] = useState(0)
    const [activeTab, setActiveTab] = useState("")

    const { bookings, totalCount, totalPages, loading, error } = useBooking({ refresh, page })

    const handleView = (id: string) => router.push(`/booking-record/${id}`)
    const handleEdit = (id: string) => router.push(`/booking-record/${id}/edit`)

    const handleTabChange = (value: string) => {
        setActiveTab(value)
        setPage(1)
    }

    const filtered = activeTab
        ? bookings.filter(b => b.status === activeTab)
        : bookings

    const getInitial = (booking: BookingType) => {
        if (booking.userId?.email) return booking.userId.email[0].toUpperCase()
        return "W"
    }

    if (loading) return <p className="text-sm text-gray-400 py-4">Loading...</p>
    if (error) return <p className="text-sm text-red-400 py-4">{error}</p>

    return (
        <div className="w-full min-w-0 overflow-x-auto">

            {/* Status tabs */}
            <div className="flex items-center gap-1 px-1 pb-3 border-b border-gray-100 flex-wrap">
                {STATUS_TABS.map(tab => (
                    <button
                        key={tab.value}
                        onClick={() => handleTabChange(tab.value)}
                        className={`text-xs px-3 py-1.5 rounded-md border transition-colors
        ${activeTab === tab.value
                                ? "bg-brand-green/20 border-brand-green/30 text-brand-green font-medium"
                                : "border-transparent text-gray-400 hover:text-brand-green hover:bg-brand-green/10"
                            }`}
                    >
                        {tab.label}
                        <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full
        ${activeTab === tab.value
                                ? "bg-brand-green/20 text-brand-green"
                                : "bg-gray-100 text-gray-400"
                            }`}>
                            {tab.value
                                ? bookings.filter(b => b.status === tab.value).length
                                : bookings.length
                            }
                        </span>
                    </button>
                ))}
            </div>

            <Table>
                <TableHeader>
                    <TableHead>Booking ref</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Packages</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="w-10" />
                </TableHeader>
                <TableBody>
                    {filtered.map((booking: BookingType) => (
                        <TableRow key={booking._id}>

                            {/* Booking ref */}
                            <TableCell>
                                <p className="font-mono text-xs text-brand-green font-medium">
                                    {booking.bookingRef}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">{booking.tripId}</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {new Date(booking.createdAt).toLocaleDateString("en-US", {
                                        month: "short", day: "numeric", year: "numeric"
                                    })}
                                </p>
                            </TableCell>

                            {/* Route */}
                            <TableCell>
                                <p className="text-sm text-gray-700 whitespace-nowrap">
                                    {booking.origin}
                                    <span className="text-green-500 mx-1 text-xs">→</span>
                                    {booking.destination}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">{booking.departure}</p>
                            </TableCell>

                            {/* Customer */}
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0
                                        ${booking.userId
                                            ? "bg-blue-50 text-blue-700"
                                            : "bg-amber-50 text-amber-700"
                                        }`}>
                                        {getInitial(booking)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium truncate">
                                            {booking.userId?.email ?? booking.senderName}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {booking.userId
                                                ? "Registered"
                                                : `Walk-in · ${booking.senderContact}`
                                            }
                                        </p>
                                    </div>
                                </div>
                            </TableCell>

                            {/* Packages */}
                            <TableCell>
                                {(booking.packages ?? []).length > 0 ? (
                                    <div className="space-y-0.5">
                                        {(booking.packages ?? []).map((pkg: BookingPackageType) => (
                                            <div key={pkg._id} className="text-xs text-gray-500">
                                                <span className="text-gray-700 font-medium">
                                                    {pkg.description}
                                                </span>
                                                <span className="ml-1 text-gray-400">
                                                    · {pkg.boxes} box · {pkg.weight}kg
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-xs text-gray-400">No packages</span>
                                )}
                            </TableCell>

                            {/* Amount + payment */}
                            <TableCell>
                                <p className="font-medium text-sm">
                                    ₱{booking.totalAmount.toLocaleString()}
                                </p>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <span className={`w-1.5 h-1.5 rounded-full shrink-0
                                        ${booking.paymentStatus === "paid"
                                            ? "bg-green-500"
                                            : "bg-red-400"
                                        }`}
                                    />
                                    <span className="text-xs text-gray-400 capitalize">
                                        {booking.paymentStatus} · {booking.paymentMethod}
                                    </span>
                                </div>
                            </TableCell>

                            {/* Actions — contextual per status */}
                            <TableCell>
                                <Menu>
                                    <MenuTrigger />
                                    <MenuList>
                                        <MenuItem
                                            label="View"
                                            icon={<Visibility fontSize="small" />}
                                            onClick={() => handleView(booking._id)}
                                        />
                                        {booking.status === "pending" && (
                                            <MenuItem
                                                label="Edit"
                                                icon={<Edit fontSize="small" />}
                                                onClick={() => handleEdit(booking._id)}
                                            />
                                        )}
                                        {booking.status === "pending" && (
                                            <MenuItem
                                                label="Delete"
                                                icon={<Delete fontSize="small" />}
                                                variant="danger"
                                                onClick={() => console.log("delete", booking._id)}
                                            />
                                        )}
                                    </MenuList>
                                </Menu>
                            </TableCell>

                        </TableRow>
                    ))}

                    {filtered.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6}>
                                <p className="text-sm text-gray-400 text-center py-6">
                                    No bookings found.
                                </p>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                total={totalCount}
                onPageChange={setPage}
            />
        </div>
    )
}