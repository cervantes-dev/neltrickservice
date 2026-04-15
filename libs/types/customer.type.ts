export type CustomerType = {
    _id:             string
    email:           string
    role:            string
    isVerified:      boolean
    bookingCount:    number
    lastBookingDate: string | null
    createdAt:       string
    updatedAt:       string
}