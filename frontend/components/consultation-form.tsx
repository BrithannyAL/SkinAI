"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mic, Upload, ImageIcon, Video, Send, Loader2, X, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnalysisResult {
  success: boolean
  file_type: string
  filename: string
  message: string
  analysis: {
    predicted_class?: string
    confidence?: number
    all_predictions?: Array<{
      class: string
      confidence: number
    }>
    model_used?: string
    status?: string
    note?: string
  }
}

export function ConsultationForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [message, setMessage] = useState("")
  const [transcription, setTranscription] = useState("")
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [error, setError] = useState<string | null>(null)
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

  const getFileType = (file: File): string => {
    if (file.type.startsWith("image/")) return "image"
    if (file.type.startsWith("video/")) return "video"
    if (file.type.startsWith("audio/")) return "audio"
    return "unknown"
  }

  const analyzeFile = async (file: File): Promise<AnalysisResult> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("file_type", getFileType(file))
    formData.append("message", message)

    const response = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Error en el análisis")
    }

    return response.json()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setAnalysisResults([])

    try {
      const results: AnalysisResult[] = []

      for (const file of uploadedFiles) {
        const result = await analyzeFile(file)
        results.push(result)
      }

      setAnalysisResults(results)
      setMessage("")
      setUploadedFiles([])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setIsLoading(false)
    }
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
      setTranscription("")
      simulateTranscription()
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

  const formatConfidence = (confidence: number): string => {
    return `${(confidence * 100).toFixed(1)}%`
  }

  const getConfidenceColor = (confidence: number): string => {
    if (confidence > 0.8) return "text-green-500"
    if (confidence > 0.6) return "text-yellow-500"
    return "text-red-500"
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
            Sube archivos multimedia como imagenes, videos y audio para obtener análisis detallados y respuestas
            precisas. Nuestra IA está diseñada para ayudarte a comprender mejor tus datos y obtener información valiosa
            de ellos.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-turquoise/20">
            <CardHeader>
              <CardTitle>Nuevo Análisis</CardTitle>
              <CardDescription>Sube archivos multimedia para analizar</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="media" className="w-full">
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
          </Card>

          {/* Mostrar errores */}
          {error && (
            <Card className="border-red-500/50 bg-red-500/10">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="text-red-500 font-medium">Error en el análisis</p>
                </div>
                <p className="text-red-400 mt-2">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Mostrar resultados */}
          {analysisResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Resultados del Análisis</h3>
              {analysisResults.map((result, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border-green-500/20">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <CardTitle className="text-lg">{result.filename}</CardTitle>
                    </div>
                    <CardDescription>
                      Tipo: {result.file_type} | Modelo: {result.analysis.model_used || "N/A"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {(result.file_type === "image" || result.file_type === "video") && result.analysis.predicted_class && (
                      <div className="space-y-4">
                        <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                          <h4 className="font-semibold text-green-400 mb-2">Diagnóstico Principal</h4>
                          <p className="text-lg font-medium">{result.analysis.predicted_class}</p>
                          <p className={`text-sm ${getConfidenceColor(result.analysis.confidence || 0)}`}>
                            Confianza: {formatConfidence(result.analysis.confidence || 0)}
                          </p>
                        </div>

                        {result.analysis.all_predictions && (
                          <div>
                            <h4 className="font-semibold mb-2">Otras posibilidades:</h4>
                            <div className="space-y-2">
                              {result.analysis.all_predictions.slice(1).map((pred, i) => (
                                <div key={i} className="flex justify-between items-center p-2 bg-dark/50 rounded">
                                  <span>{pred.class}</span>
                                  <span className={`text-sm ${getConfidenceColor(pred.confidence)}`}>
                                    {formatConfidence(pred.confidence)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {(result.file_type === "video" || result.file_type === "audio") && (
                      <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <p className="text-yellow-400">{result.analysis.status}</p>
                        <p className="text-sm text-muted-foreground mt-1">{result.analysis.note}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
