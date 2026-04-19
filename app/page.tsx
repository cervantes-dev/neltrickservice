import Hero from "@/components/landing/Hero"
import Navbar from "@/components/landing/navbar"
import Services from "@/components/landing/Services"
import Tracking from "@/components/landing/Tracking"

export default function LandingPage() {
  return (
    <div className="flex flex-col bg-primary">
      <Navbar />
      <Hero />
      <Tracking />
      <Services />
      {/* <Pricing /> */}
      {/* <About /> */}
      {/* <Contact /> */}
    </div>
  )
}