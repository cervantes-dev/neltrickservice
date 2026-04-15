export type UserType = {
    _id:   string
    email: string
    role:  string
}

export type BookingPackageType = {
    _id:         string
    bookingId:   string
    description: string
    boxes:       number
    weight:      number
    amount:      number
    createdAt:   string
    updatedAt:   string
}

export type BookingType = {
    _id: string

    // ── Core ────────────────────────────────
    bookingRef: string
    status:     "pending" | "confirmed" | "in_transit" | "delivered" | "cancelled"

    // ── Step 1 ──────────────────────────────
    tripId:      string
    origin:      string
    destination: string
    departure:   string

    // ── Step 3 — sender ─────────────────────
    senderName:    string
    senderContact: string
    senderAddress: string
    senderCity:    string
    pickupTime:    string

    // ── Step 3 — recipient ──────────────────
    recipientName:    string
    recipientContact: string
    recipientAddress: string
    instructions:     string

    // ── Step 4 — payment ────────────────────
    paymentMethod: "cash" | "gcash" | "maya" | "bank"
    paymentStatus: "unpaid" | "paid" | "waived"  // 👈 added waived

    // ── Pricing ─────────────────────────────
    totalWeight: number
    deliveryFee: number
    handlingFee: number
    totalAmount: number

    // ── Relation ────────────────────────────
    userId:    UserType | null           // 👈 null = walk-in
    packages?: BookingPackageType[]

    // ── Timestamps ──────────────────────────
    createdAt: string
    updatedAt: string
}