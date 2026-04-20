const localServices = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2.2" fill="none"/>
        <path d="M20 10v10l6 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Same-Day Delivery",
    description:
      "Order today, arrive today. We run daily routes across Leyte and Southern Leyte so your packages don't wait.",
    tags: ["Same-day", "Daily Routes", "Local"],
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="14" height="16" rx="1.5" stroke="currentColor" strokeWidth="2.2" fill="none"/>
        <rect x="18" y="8" width="14" height="16" rx="1.5" stroke="currentColor" strokeWidth="2.2" fill="none"/>
        <path d="M6 24h28v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" fill="none"/>
        <circle cx="14" cy="31" r="1.5" stroke="currentColor" strokeWidth="1.8" fill="none"/>
        <circle cx="26" cy="31" r="1.5" stroke="currentColor" strokeWidth="1.8" fill="none"/>
      </svg>
    ),
    title: "Parcel & Package Delivery",
    description:
      "From small parcels to medium-sized packages, we pick up and deliver door-to-door within Leyte and Southern Leyte.",
    tags: ["Door-to-door", "Parcels", "Pick-up"],
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6c-6.627 0-12 5.373-12 12 0 8 12 18 12 18s12-10 12-18c0-6.627-5.373-12-12-12z" stroke="currentColor" strokeWidth="2.2" fill="none"/>
        <circle cx="20" cy="18" r="4" stroke="currentColor" strokeWidth="2.2" fill="none"/>
      </svg>
    ),
    title: "Leyte & S. Leyte Coverage",
    description:
      "We cover Tacloban, Ormoc, Maasin, Sogod, Liloan, and surrounding municipalities — your go-to local logistics partner.",
    tags: ["Tacloban", "Maasin", "Sogod", "Ormoc"],
  },
]

const freightServices = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="13" width="26" height="17" rx="2" stroke="currentColor" strokeWidth="2.2" fill="none"/>
        <path d="M28 18h6l4 6v6h-10V18z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" fill="none"/>
        <circle cx="9" cy="30" r="3" stroke="currentColor" strokeWidth="2.2" fill="none"/>
        <circle cx="23" cy="30" r="3" stroke="currentColor" strokeWidth="2.2" fill="none"/>
        <circle cx="35" cy="30" r="3" stroke="currentColor" strokeWidth="2.2" fill="none"/>
      </svg>
    ),
    title: "Nationwide Freight Hauling",
    description:
      "Full-load freight from Sogod to anywhere in the Philippines by land. Long hauls handled with care from start to finish.",
    tags: ["Full Load", "Long Haul", "Nationwide"],
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="8" width="28" height="18" rx="2" stroke="currentColor" strokeWidth="2.2" fill="none"/>
        <path d="M6 18h28" stroke="currentColor" strokeWidth="2.2"/>
        <path d="M12 26v6M28 26v6M8 32h24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M13 13h6M13 22h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: "Bulk & Commercial Cargo",
    description:
      "Large commercial shipments, construction materials, and bulk goods transported safely to any province or city.",
    tags: ["Bulk Cargo", "Commercial", "Any Province"],
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4l13 7v10c0 8-5.5 13-13 16C7 34 1.5 29 1.5 21V11L20 4z" stroke="currentColor" strokeWidth="2.2" fill="none" transform="translate(3,1) scale(0.85)"/>
        <path d="M14 20l4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Secure Cargo Handling",
    description:
      "Every item is loaded and secured with care. Your cargo arrives intact — no damage, no shortcuts, no excuses.",
    tags: ["Careful Handling", "Safe", "Reliable"],
  },
]

export default function Services() {
  return (
    <section
      id="services"
      className="w-full bg-white px-6 md:px-16 lg:px-24 py-20 md:py-28 relative overflow-hidden"
    >
      {/* Background blobs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-green-100 opacity-50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-green-100 opacity-50 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-green-700 bg-green-50 border border-green-200 px-4 py-1.5 rounded-full mb-4">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900 mb-4">
            Our <span className="text-green-700">Services</span>
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-xl">
            Daily local deliveries within Leyte and Southern Leyte — plus long-haul
            freight anywhere in the Philippines.
          </p>
        </div>

        {/* Fleet badge */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center gap-3 bg-gray-950 text-white text-sm font-medium px-6 py-3 rounded-full shadow-md">
            <span className="text-lg">🚛</span>
            <span>
              2 trucks · Based in{" "}
              <span className="text-green-400 font-bold">Sogod, Southern Leyte</span>
            </span>
          </div>
        </div>

        {/* ── LOCAL DELIVERY ── */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gray-100" />
            <div className="flex items-center gap-2 px-4 py-1.5 bg-green-700 rounded-full">
              <span className="text-white text-xs font-bold tracking-widest uppercase">📍 Local — Leyte & Southern Leyte</span>
            </div>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {localServices.map((service, index) => (
              <div
                key={index}
                className="
                  group flex flex-col gap-4
                  bg-white border border-gray-100 rounded-2xl p-8
                  shadow-sm
                  hover:shadow-lg hover:border-green-600 hover:-translate-y-1.5
                  transition-all duration-300 ease-in-out cursor-default
                "
              >
                <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center text-green-700 group-hover:bg-green-100 transition-colors duration-300">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-1">{service.description}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {service.tags.map((tag, i) => (
                    <span key={i} className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── NATIONWIDE FREIGHT ── */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gray-100" />
            <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-900 rounded-full">
              <span className="text-white text-xs font-bold tracking-widest uppercase">🇵🇭 Nationwide — Anywhere in the Philippines</span>
            </div>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {freightServices.map((service, index) => (
              <div
                key={index}
                className="
                  group flex flex-col gap-4
                  bg-gray-950 border border-gray-800 rounded-2xl p-8
                  shadow-sm
                  hover:shadow-lg hover:border-green-500 hover:-translate-y-1.5
                  transition-all duration-300 ease-in-out cursor-default
                "
              >
                <div className="w-14 h-14 rounded-xl bg-green-950 flex items-center justify-center text-green-400 group-hover:bg-green-900 transition-colors duration-300">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{service.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed flex-1">{service.description}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {service.tags.map((tag, i) => (
                    <span key={i} className="text-xs font-semibold text-green-400 bg-green-950 border border-green-800 px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col items-center mt-16 gap-2">
          <p className="text-sm text-gray-400 text-center">Need a quote or want to check availability?</p>
          <a
            href="#contact"
            className="mt-1 text-sm font-semibold text-green-700 border-b-2 border-green-700 pb-0.5 hover:text-green-800 hover:border-green-800 transition-colors duration-200"
          >
            Get in touch with us →
          </a>
        </div>

      </div>
    </section>
  )
}