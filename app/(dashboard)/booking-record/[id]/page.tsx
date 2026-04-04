import React from "react";
import connectionToDatabase from "@/libs/db";
import { Booking, BookingPackage } from "@/libs/model/index";
import { BookingType } from "@/libs/types/booking.type";
import BookingViewClient from "@/components/admin/booking-record/booking-view-client";
import { notFound } from "next/navigation";

interface Props {
    params: { id: string };
}

export default async function BookingViewPage({ params }: Props): Promise<React.ReactElement> {
    const { id } = await params; // ✅ must await params first

    await connectionToDatabase();

    const booking = await Booking.findById(id).populate("userId").lean();

    if (!booking) notFound();

    const packages = await BookingPackage.find({ bookingId: id }).lean();

    const serialized = JSON.parse(
        JSON.stringify({ ...booking, packages })
    ) as BookingType;

    return <BookingViewClient booking={serialized} />;
}