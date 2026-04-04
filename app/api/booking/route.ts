import connectionToDatabase from "@/libs/db";
import getUser from "@/libs/getUser";
import { Booking, BookingPackage, Trip } from "@/libs/model/index"; // ← add Trip
import { successResponse, errorResponse } from "@/libs/helpers/api-response";

export async function POST(req: Request) {
    try {
        const user = await getUser();
        if (!user) return errorResponse("You must login to book.", 401);

        const body = await req.json();
        await connectionToDatabase();

        const totalWeight = body.packages.reduce(
            (sum: number, pkg: { weight: number }) => sum + pkg.weight, 0
        );

        // ✅ Check capacity before creating booking
        const trip = await Trip.findOne({ tripId: body.tripId });
        if (!trip) return errorResponse("Trip not found.", 404);

        const remaining = trip.capacityKg - trip.bookedCapacityKg;
        if (totalWeight > remaining) {
            return errorResponse(
                `Not enough capacity. Only ${remaining} kg available.`,
                400
            );
        }

        const bookingRef = "NLT" + (Math.floor(Math.random() * 900000) + 100000);
        const ratePerKg = 45;
        const handlingFee = 150;
        const deliveryFee = Math.round(totalWeight * ratePerKg);
        const totalAmount = handlingFee + deliveryFee;

        const booking = await Booking.create({
            bookingRef,
            userId: user.id,
            tripId: body.tripId,
            origin: body.origin,
            destination: body.destination,
            departure: body.departure,
            senderName: body.senderName,
            senderContact: body.senderContact,
            senderAddress: body.senderAddress,
            senderCity: body.senderCity,
            pickupTime: body.pickupTime,
            recipientName: body.recipientName,
            recipientContact: body.recipientContact,
            recipientAddress: body.recipientAddress,
            instructions: body.instructions,
            paymentMethod: body.paymentMethod,
            totalWeight,
            deliveryFee,
            handlingFee,
            totalAmount,
        });

        await BookingPackage.insertMany(
            body.packages.map((pkg: { description: string; weight: number; boxes: number }) => ({
                bookingId: booking._id,
                description: pkg.description,
                weight: pkg.weight,
                boxes: pkg.boxes,
                amount: Math.round(pkg.weight * ratePerKg),
            }))
        );

        // ✅ Deduct from trip capacity after booking is created
        await Trip.findOneAndUpdate(
            { tripId: body.tripId },
            { $inc: { bookedCapacityKg: totalWeight } }
        );

        return successResponse(
            { bookingRef: booking.bookingRef },
            { message: "Booking confirmed" },
            201
        );

    } catch (err) {
        console.error("Booking error:", err);
        return errorResponse("Something went wrong. Please try again.", 500);
    }
}