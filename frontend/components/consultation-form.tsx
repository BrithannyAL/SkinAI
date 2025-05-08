"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mic, Upload, ImageIcon, Video, Send, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function ConsultationForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [message, setMessage] = useState("")
  const [transcription, setTranscription] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const transcriptionIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setUploadedFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulación de envío
    setTimeout(() => {
      setIsLoading(false)
      setMessage("")
      setUploadedFiles([])
    }, 2000)
  }

  const simulateTranscription = () => {
    const phrases = [
      "Procesando audio...",
      "Hola, estoy realizando una consulta sobre...",
      "Me gustaría obtener información acerca de...",
      "Necesito ayuda con un análisis de datos...",
      "¿Podría proporcionarme más detalles sobre...",
      "Estoy interesado en conocer cómo funciona...",
      "Quisiera saber si es posible implementar...",
    ]

    let currentIndex = 0

    transcriptionIntervalRef.current = setInterval(() => {
      if (isRecording) {
        currentIndex = (currentIndex + 1) % phrases.length
        setTranscription((prev) => {
          const newText = prev + " " + phrases[currentIndex]
          return newText.trim()
        })
      }
    }, 2000)
  }

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true)
      setTranscription("") // Limpiar transcripción anterior
      simulateTranscription() // Iniciar simulación de transcripción
    } else {
      setIsRecording(false)
      if (transcriptionIntervalRef.current) {
        clearInterval(transcriptionIntervalRef.current)
        transcriptionIntervalRef.current = null
      }
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  useEffect(() => {
    return () => {
      if (transcriptionIntervalRef.current) {
        clearInterval(transcriptionIntervalRef.current)
      }
    }
  }, [])

  return (
    <section id="consultation" className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Consulta con IA</h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
            Sube archivos multimedia, realiza consultas y obtén respuestas inteligentes en tiempo real.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <Card className="bg-card/50 backdrop-blur-sm border-turquoise/20">
            <CardHeader>
              <CardTitle>Nueva Consulta</CardTitle>
              <CardDescription>Escribe tu pregunta o sube archivos multimedia para analizar</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="media">Multimedia</TabsTrigger>
                  <TabsTrigger value="audio">Audio</TabsTrigger>
                </TabsList>
                <TabsContent value="media" className="mt-4">
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                      <div
                        className="border-2 border-dashed border-turquoise/30 rounded-lg p-8 text-center hover:bg-turquoise/5 transition-colors cursor-pointer"
                        onClick={triggerFileUpload}
                      >
                        <Input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          onChange={handleFileUpload}
                          multiple
                          accept="image/*,video/*,audio/*"
                        />
                        <Upload className="h-10 w-10 text-turquoise mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-1">Arrastra archivos o haz clic aquí</h3>
                        <p className="text-sm text-muted-foreground">Soporta imágenes, videos y archivos de audio</p>
                      </div>

                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2">
                          <Label>Archivos subidos</Label>
                          <div className="grid gap-2">
                            {uploadedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-dark p-2 rounded-md">
                                <div className="flex items-center">
                                  {file.type.startsWith("image/") && <ImageIcon className="h-4 w-4 text-orange mr-2" />}
                                  {file.type.startsWith("video/") && <Video className="h-4 w-4 text-orange mr-2" />}
                                  {file.type.startsWith("audio/") && <Mic className="h-4 w-4 text-orange mr-2" />}
                                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeFile(index)}
                                  className="h-6 w-6"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <Textarea
                        placeholder="Describe tu consulta (opcional)..."
                        className="min-h-[80px] bg-dark border-turquoise/20 focus-visible:ring-turquoise"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />

                      <Button
                        type="submit"
                        className="w-full bg-turquoise hover:bg-turquoise/90"
                        disabled={isLoading || uploadedFiles.length === 0}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Procesando archivos...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Analizar archivos
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                <TabsContent value="audio" className="mt-4">
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                      <div className="flex flex-col items-center justify-center p-8 border border-turquoise/30 rounded-lg">
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          className={cn(
                            "h-20 w-20 rounded-full border-2",
                            isRecording
                              ? "border-destructive bg-destructive/10 text-destructive animate-pulse"
                              : "border-turquoise text-turquoise hover:bg-turquoise/10",
                          )}
                          onClick={toggleRecording}
                        >
                          <Mic className="h-8 w-8" />
                        </Button>
                        <p className="mt-4 text-sm text-muted-foreground">
                          {isRecording ? "Grabando... Haz clic para detener" : "Haz clic para comenzar a grabar"}
                        </p>
                        {isRecording && (
                          <div className="mt-4 w-full bg-dark rounded-full h-1.5">
                            <div className="bg-turquoise h-1.5 rounded-full animate-pulse w-3/4"></div>
                          </div>
                        )}
                      </div>

                      <div className="text-center text-sm text-muted-foreground">
                        <p>La transcripción aparecerá en tiempo real mientras hablas</p>
                      </div>

                      {isRecording && (
                        <div className="mt-4">
                          <div className="p-4 bg-dark/50 border border-turquoise/20 rounded-lg">
                            <div className="flex items-center mb-2">
                              <div className="w-2 h-2 rounded-full bg-turquoise animate-pulse mr-2"></div>
                              <h4 className="text-sm font-medium text-turquoise">Transcripción en tiempo real</h4>
                            </div>
                            <div className="h-32 overflow-y-auto p-2 bg-dark/80 rounded border border-turquoise/10 text-sm">
                              {transcription ? (
                                <p className="whitespace-pre-wrap">{transcription}</p>
                              ) : (
                                <p className="text-muted-foreground italic">Esperando audio...</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-turquoise hover:bg-turquoise/90"
                        disabled={isLoading || !isRecording}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Procesando audio...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Enviar grabación
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col items-start border-t border-border/40 pt-4">
              <p className="text-xs text-muted-foreground">
                Tus consultas y archivos se procesan de forma segura. No almacenamos tus datos más tiempo del necesario.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
