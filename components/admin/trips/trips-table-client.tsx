"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import { useTrip } from "@/hooks/useTrip";
import { Table, TableHeader, TableHead, TableBody, TableCell, TableRow } from "@/components/ui/Table";
import { ArrowForward, Edit } from "@mui/icons-material";
import { Menu, MenuTrigger, MenuList, MenuItem } from "@/components/ui/Menu";
import { Delete, WarningAmber } from "@mui/icons-material";
import { Modal, ModalTrigger, ModalHeader, ModalOverlay, ModalContent } from "@/components/ui/Modal";
import TripEdit from "./trip-edit";
import TripDeleteConfirm from "./trip-delete-confirm";
import Pagination from "@/components/ui/Pagination";
import TripTableSkeleton from "./table-row-skeleton";
import axios from "axios";

interface TripTableClientProps {
    refresh: number
    filters: {
        status: string
        origin: string
        destination: string
        dateFrom: string
        dateTo: string
    }
    onSuccess: () => void
}

const TRIP_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "in_transit", label: "In Transit" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
]

const STATUS_COLOR: Record<string, string> = {
    active: "text-green-700 border-green-300 bg-green-50",
    draft: "text-gray-600 border-gray-200 bg-gray-100",
    cancelled: "text-red-600 border-red-200 bg-red-50",
    in_transit: "text-amber-600 border-amber-200 bg-amber-50",
    completed: "text-blue-700 border-blue-200 bg-blue-50",
}

function UpdateTripStatusSelect({
    tripId,
    currentStatus,
    onSuccess,
}: {
    tripId: string
    currentStatus: string
    onSuccess: () => void
}) {
    const [status, setStatus] = useState(currentStatus)
    const [loading, setLoading] = useState(false)

    async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newStatus = e.target.value
        setStatus(newStatus)
        setLoading(true)
        await axios.patch(`/api/trips/${tripId}/status`, { status: newStatus })
        setLoading(false)
        onSuccess()
    }

    return (
        <select
            value={status}
            onChange={handleChange}
            disabled={loading}
            onClick={e => e.stopPropagation()}
            className={`text-[11px] border rounded-full px-2 py-0.5 font-medium capitalize cursor-pointer outline-none hover:opacity-80 transition-all disabled:opacity-50 ${STATUS_COLOR[status] ?? "text-gray-600 border-gray-200 bg-white"}`}
        >
            {TRIP_STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    )
}

export default function TripTableClient({ refresh, filters, onSuccess }: TripTableClientProps) {
    const router = useRouter()
    const [page, setPage] = useState(1)

    useEffect(() => { setPage(1) }, [filters])

    const { trips, totalCount, totalPages, loading, error } = useTrip({ refresh, page, filters })

    if (loading) return <TripTableSkeleton />
    if (error) return <p className="text-sm text-red-400 py-4">{error}</p>;

    const filteredTrips = trips.filter(trip => {
        if (filters.status && trip.status !== filters.status) return false
        if (filters.origin && !trip.route.origin.toLowerCase().includes(filters.origin.toLowerCase())) return false
        if (filters.destination && !trip.route.destination.toLowerCase().includes(filters.destination.toLowerCase())) return false
        if (filters.dateFrom && new Date(trip.schedule.departureDate) < new Date(filters.dateFrom)) return false
        if (filters.dateTo && new Date(trip.schedule.departureDate) > new Date(filters.dateTo)) return false
        return true
    })

    return (
        <div className="w-full min-w-0 overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableHead>Trip Id</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Departure</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Cargo Fill</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-10" />
                </TableHeader>
                <TableBody>
                    {filteredTrips.map((trip) => (
                        <TableRow
                            key={trip._id}
                            onClick={() => router.push(`/trips/${trip._id}`)}
                            className="cursor-pointer"
                        >
                            <TableCell>{trip.tripId}</TableCell>
                            <TableCell>
                                {trip.route.origin}
                                <ArrowForward sx={{ fontSize: 12 }} className="text-green-500 ml-1 mr-1" />
                                {trip.route.destination}
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1 items-start">
                                    <span className="inline-flex items-center text-center bg-purple-300 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full w-fit">
                                        {new Date(trip.schedule.departureDate).toLocaleDateString("en-US", {
                                            month: "short", day: "2-digit", year: "numeric",
                                        })}
                                    </span>
                                    <span className="text-xs text-gray-500 text-center">
                                        {new Date(trip.schedule.departureDate).toLocaleDateString("en-US", { weekday: "short" })}
                                        {" - "}
                                        {new Date(`1970-01-01T${trip.schedule.departureTime}`).toLocaleTimeString("en-US", {
                                            hour: "numeric", minute: "2-digit", hour12: true,
                                        })}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>{trip.capacityKg} kg</TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1 min-w-35">
                                    <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-300 ${trip.bookedCapacityKg / trip.capacityKg >= 1
                                                ? "bg-red-500"
                                                : trip.bookedCapacityKg / trip.capacityKg >= 0.75
                                                    ? "bg-yellow-500"
                                                    : "bg-green-500"
                                                }`}
                                            style={{
                                                width: `${Math.min((trip.bookedCapacityKg / trip.capacityKg) * 100, 100)}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </TableCell>

                            {/* Status dropdown */}
                            <TableCell onClick={e => e.stopPropagation()}>
                                <UpdateTripStatusSelect
                                    tripId={trip._id}
                                    currentStatus={trip.status}
                                    onSuccess={onSuccess}
                                />
                            </TableCell>

                            {/* Actions: Edit + Delete only */}
                            <TableCell onClick={e => e.stopPropagation()}>
                                <Menu>
                                    <MenuTrigger />
                                    <MenuList>

                                        {/* Edit Trip */}
                                        <Modal>
                                            <ModalTrigger>
                                                <MenuItem
                                                    label="Edit"
                                                    icon={<Edit fontSize="small" />}
                                                    variant="default"
                                                    onClick={() => { }}
                                                />
                                            </ModalTrigger>
                                            <ModalOverlay>
                                                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                                                    <ModalHeader>
                                                        Edit Trip
                                                    </ModalHeader>
                                                    <ModalContent>
                                                        <TripEdit
                                                            tripId={trip._id}
                                                            defaultValues={{
                                                                origin: trip.route.origin,
                                                                destination: trip.route.destination,
                                                                departureDate: trip.schedule.departureDate,
                                                                departureTime: trip.schedule.departureTime,
                                                                capacityKg: trip.capacityKg,
                                                            }}
                                                            onSuccess={onSuccess}
                                                        />
                                                    </ModalContent>
                                                </div>
                                            </ModalOverlay>
                                        </Modal>

                                        {/* Delete Trip */}
                                        <Modal>
                                            <ModalTrigger>
                                                <MenuItem
                                                    label="Delete"
                                                    icon={<Delete fontSize="small" />}
                                                    variant="danger"
                                                    onClick={() => { }}
                                                />
                                            </ModalTrigger>
                                            <ModalOverlay>
                                                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                                                    <ModalHeader>
                                                        <WarningAmber className="text-red-500 bg-red-200 p-2 rounded-full" sx={{ fontSize: 40 }} /> Delete Trip?
                                                    </ModalHeader>
                                                    <ModalContent>
                                                        <TripDeleteConfirm
                                                            tripId={trip._id}
                                                            tripRef={trip.tripId}
                                                            onSuccess={onSuccess}
                                                        />
                                                    </ModalContent>
                                                </div>
                                            </ModalOverlay>
                                        </Modal>

                                    </MenuList>
                                </Menu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                total={totalCount}
                onPageChange={setPage}
            />
        </div>
    );
}