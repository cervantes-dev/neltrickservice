"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Table, TableHeader, TableHead,
    TableBody, TableRow, TableCell
} from "@/components/ui/Table"
import { Menu, MenuTrigger, MenuList, MenuItem } from "@/components/ui/Menu"
import { Visibility, Delete, Search } from "@mui/icons-material"
import { useCustomers } from "@/hooks/useCustomers"
import { CustomerType } from "@/libs/types/customer.type"
import { Form, FormField, FormInput } from "@/components/ui/Form"
import { useDebounce } from "@/hooks/useDebounce"
import Pagination from "@/components/ui/Pagination"
import CustomersTableSkeleton from "./customers-table-skeleton";

export default function CustomersTable() {
    const router = useRouter()
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const query = useDebounce(search, 300)

    const { customers, total, totalPages, loading, error } = useCustomers({
        page,
        limit: 10,
        search: query,
    })


    function handleSearch(e: React.SyntheticEvent) {
        e.preventDefault()
        setPage(1)

    }

    function handleView(id: string) {
        router.push(`/customers/${id}`)
    }

    function handleDelete(id: string) {
        console.log("delete", id)
        // TODO: confirm dialog + DELETE /api/customers/:id
    }

    return (
        <div className="w-full min-w-0 overflow-x-auto">
            {/* Search */}
            <div className="flex items-end justify-end mb-2">
                <Form onSubmit={handleSearch}>
                    <FormField>
                        <FormInput
                            placeholder="Search by email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            iconRight={<Search sx={{ fontSize: 18 }} />}
                        />
                    </FormField>
                </Form>
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total Bookings</TableHead>
                    <TableHead>Last Booking</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="w-10" />
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <CustomersTableSkeleton />
                    ) : error ? (
                        <TableRow>
                            <TableCell colSpan={5}>
                                <p className="text-xs text-red-500 text-center py-6">
                                    {error}
                                </p>
                            </TableCell>
                        </TableRow>
                    ) : customers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5}>
                                <p className="text-xs text-gray-400 text-center py-6">
                                    No customers found
                                </p>
                            </TableCell>
                        </TableRow>
                    ) : (
                        customers.map((customer: CustomerType) => (
                            <TableRow key={customer._id}>

                            {/* Customer */}
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-700
                                                        flex items-center justify-center
                                                        text-white text-xs font-medium shrink-0">
                                        {customer.email[0].toUpperCase()}
                                    </div>
                                    <p className="text-sm text-gray-900 truncate max-w-45">
                                        {customer.email}
                                    </p>
                                </div>
                            </TableCell>

                            {/* Total Bookings */}
                            <TableCell>
                                <span className={`
                                    inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
                                    ${customer.bookingCount > 0
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-400"
                                    }
                                `}>
                                    {customer.bookingCount} {customer.bookingCount === 1 ? "booking" : "bookings"}
                                </span>
                            </TableCell>

                            {/* Last Booking */}
                            <TableCell>
                                {customer.lastBookingDate ? (
                                    <p className="text-sm text-gray-600">
                                        {new Date(customer.lastBookingDate).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </p>
                                ) : (
                                    <p className="text-xs text-gray-400">No bookings yet</p>
                                )}
                            </TableCell>

                            {/* Joined */}
                            <TableCell>
                                <p className="text-sm text-gray-600">
                                    {new Date(customer.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </p>
                            </TableCell>

                            {/* Actions */}
                            <TableCell>
                                <Menu>
                                    <MenuTrigger />
                                    <MenuList>
                                        <MenuItem
                                            label="View details"
                                            icon={<Visibility fontSize="small" />}
                                            onClick={() => handleView(customer._id)}
                                        />
                                        <MenuItem
                                            label="Delete"
                                            icon={<Delete fontSize="small" />}
                                            variant="danger"
                                            onClick={() => handleDelete(customer._id)}
                                        />
                                    </MenuList>
                                </Menu>
                            </TableCell>

                        </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            {/* Pagination */}
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                total={total}
                onPageChange={setPage}
            />

        </div>
    )
}