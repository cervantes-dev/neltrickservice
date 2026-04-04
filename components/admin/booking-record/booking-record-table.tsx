import connectionToDatabase from "@/libs/db";
import { Booking, BookingPackage } from "@/libs/model/index";
import { BookingType } from "@/libs/types/booking.type";

const PER_PAGE = 10;

export default async function BookingRecordTable({ page = 1 }: { page?: number }) {
    await connectionToDatabase();

    const total = await Booking.countDocuments();

    const bookings = await Booking.find()
        .populate("userId")
        .skip((page - 1) * PER_PAGE)
        .limit(PER_PAGE)
        .lean();

    const bookingIds = bookings.map((b: any) => b._id);

    const packages = await BookingPackage.find({
        bookingId: { $in: bookingIds }
    }).lean();

    const withPackages = bookings.map((b: any) => ({
        ...b,
        packages: packages.filter(
            (p: any) => p.bookingId.toString() === b._id.toString()
        ),
    }));

    const serialized = JSON.parse(JSON.stringify(withPackages)) as BookingType[];

    return { data: serialized, total };  // ← return total too
}