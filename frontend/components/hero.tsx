import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, Sparkles } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm">
              <Sparkles className="mr-1 h-4 w-4 text-secondary" />
              <span className="text-secondary">Tecnología de IA avanzada</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Bienvenido a <br /> <span className="text-turquoise">SkinAI</span>
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Inteligencia artificial que identifica manchas y marcas en la piel a partir de contenido multimedia como fotos y videos. También transcribe audios en tiempo real con alta precisión. ¡Todo en una sola aplicación!
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="#consultation">
                <Button className="bg-turquoise text-white hover:bg-turquoise/90">
                  Comenzar ahora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative lg:ml-auto">
            <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] md:h-[450px] md:w-[450px] mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-turquoise/20 to-orange/20 blur-3xl animate-pulse-slow" />
              <div className="absolute inset-4 rounded-full border border-turquoise/30 animate-float" />
              <div className="absolute inset-8 rounded-full border border-orange/30 animate-float [animation-delay:2s]" />
              <div className="absolute inset-12 rounded-full border border-turquoise/30 animate-float [animation-delay:4s]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="h-24 w-24 text-turquoise animate-pulse-slow" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
