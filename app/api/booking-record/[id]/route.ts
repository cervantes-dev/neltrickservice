import connectionToDatabase from "@/libs/db";
import { Booking, BookingPackage } from "@/libs/model/index"
import { successResponse, errorResponse } from "@/libs/helpers/api-response";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectionToDatabase()

    const { id } = await params
    const body = await req.json()

    // Whitelist — only these fields are allowed to change
    const {
      recipientName,
      recipientContact,
      recipientAddress,
      instructions,
      paymentMethod,
      paymentStatus,
      packages,
    } = body

    // 1. Verify booking exists and is still pending
    const booking = await Booking.findById(id)
    if (!booking) return errorResponse("Booking not found", 404)
    if (booking.status !== "pending") {
      return errorResponse("Only pending bookings can be edited", 403)
    }

    // 2. Update the booking fields
    const bookingUpdate: Record<string, unknown> = {}
    if (recipientName    !== undefined) bookingUpdate.recipientName    = recipientName
    if (recipientContact !== undefined) bookingUpdate.recipientContact = recipientContact
    if (recipientAddress !== undefined) bookingUpdate.recipientAddress = recipientAddress
    if (instructions     !== undefined) bookingUpdate.instructions     = instructions
    if (paymentMethod    !== undefined) bookingUpdate.paymentMethod    = paymentMethod
    if (paymentStatus    !== undefined) bookingUpdate.paymentStatus    = paymentStatus

    // 3. Handle packages if provided
    if (Array.isArray(packages)) {
      // Separate into existing (has _id) and new packages
      const existingPackages = packages.filter(p => p._id)
      const newPackages      = packages.filter(p => !p._id)

      // IDs the client still wants to keep
      const keptIds = existingPackages.map(p => p._id)

      // Delete packages that were removed by the user
      await BookingPackage.deleteMany({
        bookingId: id,
        _id: { $nin: keptIds },
      })

      // Update each existing package
      for (const pkg of existingPackages) {
        await BookingPackage.findByIdAndUpdate(pkg._id, {
          description: pkg.description,
          boxes:       pkg.boxes,
          weight:      pkg.weight,
          amount:      pkg.amount ?? 0,
        })
      }

      // Insert new packages
      if (newPackages.length > 0) {
        await BookingPackage.insertMany(
          newPackages.map(pkg => ({
            bookingId:   id,
            description: pkg.description,
            boxes:       pkg.boxes,
            weight:      pkg.weight,
            amount:      pkg.amount ?? 0,
          }))
        )
      }

      // Recalculate totals from all remaining packages
      const allPackages = await BookingPackage.find({ bookingId: id })
      bookingUpdate.totalWeight = allPackages.reduce((sum, p) => sum + p.weight, 0)
      bookingUpdate.totalAmount =
        allPackages.reduce((sum, p) => sum + p.amount, 0) +
        (booking.deliveryFee ?? 0) +
        (booking.handlingFee ?? 0)
    }

    const updated = await Booking.findByIdAndUpdate(
      id,
      { $set: bookingUpdate },
      { new: true }
    ).populate("userId", "email")

    return successResponse(updated, {message: "Booking updated successfully"})

  } catch (error) {
    console.error("[PATCH /api/bookings/:id]", error)
    return errorResponse("Internal server error", 500)
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectionToDatabase();

        const { id } = await params;

        const booking = await Booking.findByIdAndDelete(id);

        if (!booking) return errorResponse("Booking not found", 404);

        return successResponse(null, { message: "Booking deleted" }, 200);
    } catch (err: unknown) {
        console.error(err);
        return errorResponse("Failed to delete booking", 500);
    }
}