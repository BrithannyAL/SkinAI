from tensorflow.keras.models import load_model
from tensorflow.keras.applications.resnet50 import preprocess_input
import numpy as np
import tempfile
import cv2
from fastapi.responses import JSONResponse
import os

# Cargar modelo y clases
model = load_model("models/modelo_224_20.h5")
classes = ['acne','benign-mole','bruises','dermatitis','freckles','melanoma','stretch marks','wart']

# Preprocesar frame como en Colab
def preprocess_frame(frame):
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)         # BGR → RGB
    resized = cv2.resize(frame_rgb, (224, 224))                # Redimensionar
    input_tensor = np.expand_dims(resized, axis=0)             # [1, 224, 224, 3]
    input_tensor = preprocess_input(input_tensor)              # Preprocesamiento de ResNet50
    return input_tensor

# Procesar video
def analyze_video(contents, filename, message):
    try:
        # Guardar video temporal
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        cap = cv2.VideoCapture(tmp_path)
        frame_predictions = []

        while True:
            success, frame = cap.read()
            if not success:
                break

            input_tensor = preprocess_frame(frame)
            prediction = model.predict(input_tensor, verbose=0)[0]
            frame_predictions.append(prediction)

        cap.release()

        if not frame_predictions:
            return JSONResponse(status_code=400, content={"detail": "No se pudo leer ningún frame del video"})

        # Promedio de predicciones
        avg_predictions = np.mean(frame_predictions, axis=0)
        top_index = int(np.argmax(avg_predictions))
        top_class = classes[top_index]
        confidence = float(avg_predictions[top_index])

        all_preds = [{"class": c, "confidence": float(p)} for c, p in zip(classes, avg_predictions)]
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
                "frames_analyzed": len(frame_predictions),
                "model_used": "ResNet50.h5"
            }
        })

    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
