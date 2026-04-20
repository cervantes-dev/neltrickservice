export default function About() {
  const stats = [
    { value: "2", label: "Trucks on the Road" },
    { value: "2025", label: "Year Founded" },
    { value: "2", label: "Founders" },
    { value: "PH", label: "Delivering Nationwide" },
  ]

  return (
    <section
      id="about"
      className="w-full bg-white px-6 md:px-16 lg:px-24 py-20 md:py-28 relative overflow-hidden"
    >
      {/* Background blobs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-green-100 opacity-40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-green-100 opacity-40 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-green-700 bg-green-50 border border-green-200 px-4 py-1.5 rounded-full mb-4">
            About Us
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900 mb-4">
            Local Roots,{" "}
            <span className="text-green-700">Big Dreams</span>
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-xl">
            Born in Sogod, Southern Leyte — built to serve the whole Philippines.
          </p>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">

          {/* LEFT: Story */}
          <div className="flex flex-col gap-6">

            {/* Name origin badge */}
            <div className="inline-flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-4 w-fit">
              <span className="text-2xl">🤝</span>
              <div>
                <p className="text-xs text-green-700 font-bold tracking-widest uppercase mb-0.5">The Name</p>
                <p className="text-sm text-gray-700">
                  <span className="font-extrabold text-green-700">Nel</span>jonel
                  {" + "}
                  T<span className="font-extrabold text-green-700">rick</span>ia
                  {" = "}
                  <span className="font-extrabold text-gray-900">NelTrick</span>
                </p>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed text-base">
              NelTrick Logistics Services was founded in 2025 by{" "}
              <span className="font-semibold text-gray-900">Jonel and Tricia</span> — a couple
              from Sogod, Southern Leyte with a simple goal: make logistics more accessible
              for everyday Filipinos.
            </p>

            <p className="text-gray-600 leading-relaxed text-base">
              What started with two trucks and a big dream is now serving
              daily deliveries across Leyte and Southern Leyte, with long-haul
              freight reaching any province in the country. We're not a giant
              corporation — we're your neighbors, and we treat every package
              like it's our own.
            </p>

            <p className="text-gray-600 leading-relaxed text-base">
              We believe that being small means we can be more personal,
              more flexible, and more reliable. Every client matters.
              Every delivery counts.
            </p>

            {/* Values */}
            <div className="flex flex-col gap-3 mt-2">
              {[
                { icon: "📍", label: "Sogod-based", desc: "Proudly rooted in Southern Leyte" },
                { icon: "🤲", label: "Family-run", desc: "Founded by Jonel & Tricia" },
                { icon: "🚛", label: "Growing fleet", desc: "Starting with 2 trucks, aiming for more" },
              ].map((v, i) => (
                <div key={i} className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-xl px-5 py-3">
                  <span className="text-xl">{v.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{v.label}</p>
                    <p className="text-xs text-gray-500">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Stats + visual */}
          <div className="flex flex-col gap-6">

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-gray-950 rounded-2xl px-6 py-7 flex flex-col gap-1"
                >
                  <p className="text-3xl font-extrabold text-green-400">{stat.value}</p>
                  <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Mission card */}
            <div className="bg-green-700 rounded-2xl px-7 py-7 flex flex-col gap-3">
              <p className="text-xs font-bold tracking-widest uppercase text-green-200">
                Our Mission
              </p>
              <p className="text-white text-lg font-bold leading-snug">
                "To deliver not just packages — but trust, reliability, and a little
                piece of home, wherever in the Philippines you may be."
              </p>
              <p className="text-green-200 text-sm">— Jonel & Tricia, Founders</p>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}