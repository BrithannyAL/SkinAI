from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from processors.image_processor import analyze_image
from processors.video_processor import analyze_video
from processors.audio_processor import analyze_audio 
import os

app = FastAPI()

# Configuración CORS para permitir peticiones del frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ruta principal para procesar archivos multimedia
@app.post("/analyze")
async def analyze_file(
    file: UploadFile = File(...),
    file_type: str = Form(...),
    message: str = Form(""),
):
    try:
        contents = await file.read()

        # Procesar según tipo de archivo
        if file_type == "image":
            return analyze_image(contents, file.filename, message)

        elif file_type == "video":
            return analyze_video(contents, file.filename, message)

        elif file_type == "audio":
            return analyze_audio(contents, file.filename, message)

        else:
            return JSONResponse({
                "success": False,
                "file_type": file_type,
                "filename": file.filename,
                "message": message,
                "analysis": {
                    "status": "Tipo de archivo no soportado",
                    "note": "Solo se permite imagen, video o audio."
                }
            })

    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Error interno: {str(e)}"})
