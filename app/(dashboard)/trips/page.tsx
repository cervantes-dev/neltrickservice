"use client"
import { useState } from "react";
import { sileo } from "sileo";
import TripStats from "@/components/admin/trips/trips-stats";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import TripTableClient from "@/components/admin/trips/trips-table-client";
import Button from "@/components/ui/Button";
import { Add } from "@mui/icons-material";
import {
    Modal,
    ModalTrigger,
    ModalHeader,
    ModalOverlay,
    ModalContent,
} from "@/components/ui/Modal";
import TripAddFrom from "@/components/admin/trips/trips-add-form";
import TripFilter from "@/components/admin/trips/trip-filter";

export default function TripPage() {
    const [refresh, setRefresh] = useState(0);
    const [addModalOpen, setAddModalOpen] = useState(false)

    // ← ilipat dito galing sa TripTableClient
    const [filters, setFilters] = useState({
        status: "",
        origin: "",
        destination: "",
        dateFrom: "",
        dateTo: "",
    })

    const hasActiveFilter = Object.values(filters).some(v => v !== "")

    function clearFilters() {
        setFilters({ status: "", origin: "", destination: "", dateFrom: "", dateTo: "" })
    }

    return (
        <section>
            <TripStats refresh={refresh} />
            <Card>
                <CardHeader
                    action={
                        <div className="flex flex-row gap-1">
                            <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)}>
                                <ModalTrigger>
                                    <Button
                                        size="xs"
                                        icon={<Add sx={{ fontSize: 16 }} />}
                                        onClick={() => setAddModalOpen(true)} // ← buksan
                                    >
                                        Add Trip
                                    </Button>
                                </ModalTrigger>
                                <ModalOverlay>
                                    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                                        <ModalHeader>
                                            Add Trip
                                            <br />
                                            <span className="text-xs text-gray-400">
                                                Create a new scheduled cargo route
                                            </span>
                                        </ModalHeader>
                                        <ModalContent>
                                            <TripAddFrom
                                                onSuccess={() => {
                                                    setRefresh(prev => prev + 1)
                                                    setAddModalOpen(false) // ← isara pagkatapos mag-save
                                                }}
                                                onClose={() => setAddModalOpen(false)} // ← isara kapag cancel
                                            />
                                        </ModalContent>
                                    </div>
                                </ModalOverlay>
                            </Modal>
                            <TripFilter
                                filters={filters}
                                onChange={setFilters}
                                onClear={clearFilters}
                                hasActive={hasActiveFilter}
                            />
                        </div>
                    }
                >
                    Trips <br />
                    <span className="text-xs text-gray-400">Manage scheduled cargo routes and capacity</span>
                </CardHeader>
                <CardContent>
                    <TripTableClient
                        refresh={refresh}
                        filters={filters}  // ← ipasa sa table
                        onSuccess={() => setRefresh(prev => prev + 1)}
                    />
                </CardContent>
            </Card>
        </section>
    )
}