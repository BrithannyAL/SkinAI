import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileAudio, FileImage, FileVideo, Zap, Sparkles, Shield } from "lucide-react"

export function Features() {
  return (
    <section id="features" className="py-12 md:py-24 bg-dark/50">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Características</h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
            Nuestra plataforma ofrece capacidades avanzadas para interactuar con modelos de IA
          </p>
        </div>

        <div className="mx-auto mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:max-w-5xl">
          <Card className="bg-card/50 backdrop-blur-sm border-turquoise/20">
            <CardHeader className="pb-2">
              <FileImage className="h-12 w-12 text-orange mb-2" />
              <CardTitle>Análisis de Imágenes</CardTitle>
              <CardDescription>Sube imágenes para análisis detallado y reconocimiento de contenido</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Reconocimiento de objetos, escenas, texto en imágenes y análisis de contenido visual.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-turquoise/20">
            <CardHeader className="pb-2">
              <FileVideo className="h-12 w-12 text-orange mb-2" />
              <CardTitle>Procesamiento de Video</CardTitle>
              <CardDescription>Análisis de contenido de video y extracción de información</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Detección de escenas, reconocimiento de acciones y generación de resúmenes de video.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-turquoise/20">
            <CardHeader className="pb-2">
              <FileAudio className="h-12 w-12 text-orange mb-2" />
              <CardTitle>Transcripción de Audio</CardTitle>
              <CardDescription>Transcripción de audio en tiempo real con alta precisión</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Convierte voz a texto en tiempo real con soporte para múltiples idiomas y reconocimiento de hablantes.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-turquoise/20">
            <CardHeader className="pb-2">
              <Zap className="h-12 w-12 text-turquoise mb-2" />
              <CardTitle>Respuestas en Tiempo Real</CardTitle>
              <CardDescription>Obtén respuestas instantáneas a tus consultas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Procesamiento rápido y eficiente para proporcionar respuestas inmediatas a tus preguntas.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-turquoise/20">
            <CardHeader className="pb-2">
              <Sparkles className="h-12 w-12 text-turquoise mb-2" />
              <CardTitle>IA Avanzada</CardTitle>
              <CardDescription>Modelos de IA de última generación para resultados precisos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Utilizamos los modelos de IA más avanzados para proporcionar análisis detallados y respuestas precisas a
                tus consultas.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-turquoise/20">
            <CardHeader className="pb-2">
              <Shield className="h-12 w-12 text-turquoise mb-2" />
              <CardTitle>Seguridad y Privacidad</CardTitle>
              <CardDescription>Tus datos están protegidos con las más altas medidas de seguridad</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Encriptación de extremo a extremo y políticas estrictas de privacidad para proteger tu información.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
