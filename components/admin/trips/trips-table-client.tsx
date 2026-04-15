"use client"
import { useState, useEffect } from "react";
import { useTrip } from "@/hooks/useTrip";
import { Table, TableHeader, TableHead, TableBody, TableCell, TableRow } from "@/components/ui/Table";
import { ArrowForward, Edit } from "@mui/icons-material";
import { Menu, MenuTrigger, MenuList, MenuItem } from "@/components/ui/Menu";
import { EditSquare, Delete, WarningAmber } from "@mui/icons-material";
import { Modal, ModalTrigger, ModalHeader, ModalOverlay, ModalContent } from "@/components/ui/Modal";
import UpdateStatusForm from "./trip-update-form";
import TripEdit from "./trip-edit";
import TripDeleteConfirm from "./trip-delete-confirm";
import Pagination from "@/components/ui/Pagination"; // ← idagdag
import TripTableSkeleton from "./table-row-skeleton";

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

export default function TripTableClient({ refresh, filters, onSuccess }: TripTableClientProps) {
    const [page, setPage] = useState(1) // ← idagdag

    // ← i-reset sa page 1 kapag nag-change ang filters
    useEffect(() => { setPage(1) }, [filters])

    const { trips, totalCount, totalPages, loading, error } = useTrip({ refresh, page, filters })

    // ← palitan ang loading check
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
                        <TableRow key={trip._id}>
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
                            <TableCell>
                                <span
                                    className={`inline-flex items-center text-center rounded-full px-2 py-0.5 text-xs capitalize font-medium
                                    ${trip.status === "active"
                                            ? "bg-green-100 text-green-700"
                                            : trip.status === "draft"
                                                ? "bg-gray-300 text-gray-600"
                                                : trip.status === "cancelled"
                                                    ? "bg-red-100 text-red-600"
                                                    : trip.status === "in_transit"
                                                        ? "bg-amber-100 text-amber-600"
                                                        : trip.status === "completed"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : ""
                                        }
                                    `}
                                >
                                   {trip.status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Menu>
                                    <MenuTrigger />
                                    <MenuList>

                                        {/* Update Status */}
                                        <Modal>
                                            <ModalTrigger>
                                                <MenuItem
                                                    label="Update Status"
                                                    icon={<EditSquare fontSize="small" />}
                                                    variant="default"
                                                    onClick={() => { }}
                                                />
                                            </ModalTrigger>
                                            <ModalOverlay>
                                                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                                                    <ModalHeader>
                                                        Update Trip Status
                                                        <br />
                                                        <span className="text-xs text-gray-400">
                                                            Note: By setting status to active it let the client to book
                                                        </span>
                                                    </ModalHeader>
                                                    <ModalContent>
                                                        <UpdateStatusForm
                                                            tripId={trip._id}           // ← ipasa ang trip ID
                                                            currentStatus={trip.status} // ← ipasa ang current status
                                                            onSuccess={onSuccess}
                                                        />
                                                    </ModalContent>
                                                </div>
                                            </ModalOverlay>
                                        </Modal>

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
                                                        <WarningAmber className="text-red-500 bg-red-200 p-2 rounded-full" sx={{ fontSize: 40 }} /> Delete Account?
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

            {/* ← idagdag sa baba ng table */}
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                total={totalCount}
                onPageChange={setPage}
            />
        </div>
    );
}