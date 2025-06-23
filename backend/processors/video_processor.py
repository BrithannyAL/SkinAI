from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import io
import tempfile
import cv2
from fastapi.responses import JSONResponse
import os

model = load_model("models/model_epoch_80.keras")
classes = ['acne','benign-mole','bruises','dermatitis','freckles','melanoma','stretch marks','wart']

def preprocess_frame(frame):
    image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)).resize((224, 224))
    image_array = np.array(image) / 255.0
    return np.expand_dims(image_array, axis=0)

def analyze_video(contents, filename, message):
    try:
        # Guardar video temporalmente
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        cap = cv2.VideoCapture(tmp_path)
        success, frame = cap.read()
        cap.release()

        if not success:
            return JSONResponse(status_code=400, content={"detail": "No se pudo leer el video"})

        # Analizar primer frame
        input_tensor = preprocess_frame(frame)
        predictions = model.predict(input_tensor)[0]

        top_index = int(np.argmax(predictions))
        top_class = classes[top_index]
        confidence = float(predictions[top_index])

        all_preds = [{"class": c, "confidence": float(p)} for c, p in zip(classes, predictions)]
        all_preds.sort(key=lambda x: x["confidence"], reverse=True)

        return JSONResponse({
            "success": True,
            "file_type": "video",
            "filename": filename,
            "message": message,
            "analysis": {
                "predicted_class": top_class,
                "confidence": confidence,
                "all_predictions": all_preds,
                "model_used": "model_epoch_80.keras"
            }
        })

    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
