"use client"
import { useState } from "react";
import { sileo } from "sileo";
import TripStats from "@/components/admin/trips/trips-stats";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import TripTableClient from "@/components/admin/trips/trips-table-client";
import Button from "@/components/ui/Button";
import { Add, FilterList } from "@mui/icons-material";
import {
    Modal,
    ModalTrigger,
    ModalHeader,
    ModalOverlay,
    ModalContent,
} from "@/components/ui/Modal";
import TripAddFrom from "@/components/admin/trips/trips-add-form";

export default function TripPage() {
    const [refresh, setRefresh] = useState(0);
    return (
        <section>
            <TripStats />
            <Card>
                <CardHeader
                    action={
                        <div className="flex flex-row gap-1">
                            <Modal>
                                <ModalTrigger>
                                    <Button size="xs" icon={<Add sx={{ fontSize: 16 }} />}>
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
                                            <TripAddFrom />
                                        </ModalContent>
                                    </div>
                                </ModalOverlay>
                            </Modal>
                            <Modal>
                                <ModalTrigger>
                                    <Button
                                        size="xs"
                                        variant="outline"
                                        icon={<FilterList sx={{ fontSize: 20 }} />}
                                    >
                                        Filter
                                    </Button>
                                </ModalTrigger>

                                <ModalOverlay>
                                    <div className="bg-white rounded-xl shadow-xl overflow-hidden">

                                        <ModalHeader>
                                            Filter trip record
                                        </ModalHeader>
                                        <ModalContent>
                                            <TripAddFrom />
                                        </ModalContent>
                                    </div>
                                </ModalOverlay>
                            </Modal>

                        </div>
                    }

                >
                    Trips <br />
                    <span className="text-xs text-gray-400">Manage scheduled cargo routes and capacity</span>
                </CardHeader>
                <CardContent>
                    <TripTableClient
                        refresh={refresh}
                        onSuccess={() => setRefresh(prev => prev + 1)}
                    />
                </CardContent>
            </Card >

        </section >
    )
}