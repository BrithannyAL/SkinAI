import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { ConsultationForm } from "@/components/consultation-form"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="network-lines" />
      <Navbar />
      <Hero />
      <ConsultationForm />
      <Footer />
    </main>
  )
}
