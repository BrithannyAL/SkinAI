import Image from "next/image"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-dark/80 backdrop-blur supports-[backdrop-filter]:bg-dark/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="AI Consultation Logo" width={40} height={40} className="object-contain" />
          <span className="text-xl font-bold text-white">AI Consultation</span>
        </div>
      </div>
    </header>
  )
}
