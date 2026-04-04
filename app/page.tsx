import Hero from "@/components/landing/Hero"
import Navbar from "@/components/landing/navbar"

export default function LandingPage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-primary">
      <Navbar />              
      <Hero />                
    </div>
  )
}