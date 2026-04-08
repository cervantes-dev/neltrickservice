"use client";

import { useRouter } from "next/navigation";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell
} from "@/components/ui/Table";
import { Menu, MenuTrigger, MenuList, MenuItem } from "@/components/ui/Menu";
import { Visibility, Edit, LocalShipping, Delete } from "@mui/icons-material";
import { BookingType, BookingPackageType } from "@/libs/types/booking.type";

interface Props {
    bookings: BookingType[];
}

export default function BookingRecordClient({ bookings }: Props) {
    const router = useRouter();

    const handleView = (id: string) => router.push(`/booking-record/${id}`);
    const handleEdit = (id: string) => router.push(`/booking-record/${id}/edit`);
    const handleUpdateStatus = (id: string) => console.log("Update status:", id);
    const handleDelete = (id: string) => console.log("Delete:", id);

    return (
        <div className="w-full min-w-0 overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableHead>Booking</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Packages</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead />
                </TableHeader>
                <TableBody>
                    {bookings.map((booking: BookingType) => (
                        <TableRow key={booking._id}>

                            {/* Booking ref + Trip ID */}
                            <TableCell>
                                <p className="font-medium text-sm">{booking.bookingRef}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{booking.tripId}</p>
                            </TableCell>

                            {/* Route + Departure */}
                            <TableCell>
                                <p className="text-sm text-gray-600 whitespace-nowrap">
                                    {booking.origin} → {booking.destination}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">{booking.departure}</p>
                            </TableCell>

                            {/* Customer + Book date */}
                            <TableCell>
                                <p className="text-sm">
                                    {booking.userId?.email ?? "Walk-in"}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {booking.userId
                                        ? "Registered"
                                        : `${booking.senderName} · ${booking.senderContact}`
                                    }
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {new Date(booking.createdAt).toLocaleDateString("en-US", {
                                        month: "short", day: "numeric", year: "numeric"
                                    })}
                                </p>
                            </TableCell>

                            {/* Packages */}
                            <TableCell>
                                {booking.packages && booking.packages.length > 0 ? (
                                    <div className="space-y-0.5">
                                        {booking.packages.map((pkg: BookingPackageType) => (
                                            <div key={pkg._id} className="text-xs text-gray-500">
                                                {pkg.description}
                                                <span className="ml-1 text-gray-400">
                                                    ({pkg.boxes} box · {pkg.weight}kg)
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-xs text-gray-400">No packages</span>
                                )}
                            </TableCell>

                            {/* Amount + Payment */}
                            <TableCell>
                                <p className="font-medium text-sm">
                                    ₱{booking.totalAmount.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5 capitalize">
                                    {booking.paymentStatus} · {booking.paymentMethod}
                                </p>
                            </TableCell>

                            {/* Status */}
                            <TableCell>
                                <span className={`
                    inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${booking.status === "pending" && "bg-amber-50 text-amber-700"}
                    ${booking.status === "confirmed" && "bg-blue-50 text-blue-700"}
                    ${booking.status === "in_transit" && "bg-purple-50 text-purple-700"}
                    ${booking.status === "delivered" && "bg-green-50 text-green-700"}
                    ${booking.status === "cancelled" && "bg-red-50 text-red-700"}
                `}>
                                    {booking.status.replace("_", " ")}
                                </span>
                            </TableCell>

                            {/* Actions */}
                            <TableCell>
                                <Menu>
                                    <MenuTrigger />
                                    <MenuList>
                                        <MenuItem
                                            label="View details"
                                            icon={<Visibility fontSize="small" />}
                                            onClick={() => handleView(booking._id)}
                                        />
                                        {["pending", "confirmed"].includes(booking.status) && (
                                            <MenuItem
                                                label="Edit booking"
                                                icon={<Edit fontSize="small" />}
                                                onClick={() => handleEdit(booking._id)}
                                            />
                                        )}
                                        {["confirmed", "in_transit"].includes(booking.status) && (
                                            <MenuItem
                                                label="Update status"
                                                icon={<LocalShipping fontSize="small" />}
                                                onClick={() => handleUpdateStatus(booking._id)}
                                            />
                                        )}
                                        {["pending", "cancelled"].includes(booking.status) && (
                                            <MenuItem
                                                label="Delete"
                                                icon={<Delete fontSize="small" />}
                                                variant="danger"
                                                onClick={() => handleDelete(booking._id)}
                                            />
                                        )}
                                    </MenuList>
                                </Menu>
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}