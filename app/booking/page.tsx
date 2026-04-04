import connectionToDatabase from "@/libs/db"
import Booking from "@/libs/model/booking"
import Navbar from "@/components/landing/navbar"
import BookingForm from "@/components/booking/BookingForm"
import getUser from "@/libs/getUser"

export default async function BookingPage() {
  await connectionToDatabase()
  const user = await getUser()

  const raw = user
    ? await Booking
      .findOne({ userId: user.id })
      .sort({ createdAt: -1 })
      .select("senderName senderContact senderAddress senderCity")
      .lean()
    : null

  const lastBooking = raw ? {
    senderName: raw.senderName ?? "",
    senderContact: raw.senderContact ?? "",
    senderAddress: raw.senderAddress ?? "",
    senderCity: raw.senderCity ?? "",
  } : null

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <Navbar />
      <main className="flex-1 flex justify-center px-4 py-10 md:px-8">
        <BookingForm user={user} lastBooking={lastBooking} />
      </main>
    </div>
  )
}