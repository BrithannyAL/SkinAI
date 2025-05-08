import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-dark border-t border-border/40">
      <div className="container px-4 py-8">
        <div className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="AI Consultation Logo" width={30} height={30} className="object-contain" />
          <span className="text-sm font-medium text-white">SkinAI</span>
        </div>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p>© 2025 SkinAI. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
