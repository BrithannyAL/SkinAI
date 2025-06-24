from fastapi.responses import JSONResponse
from tensorflow.keras.models import load_model
from fastapi.responses import JSONResponse
from PIL import Image
import numpy as np
import io
import tensorflow as tf


def analyze_image(contents, filename, message):

    print("Procesando imagen:", filename)

    # Cargar el modelo de imágenes de EfficientNet
    model = load_model("models/best_model.h5", compile=False)

    # Definir las clases del modelo
    classes = ['acne', 'benign-mole', 'bruises', 'dermatitis', 'freckles', 'melanoma', 'stretch marks', 'wart']

    try:
        # Preprocesar la imagen
        image = Image.open(io.BytesIO(contents))
        image = image.resize((224, 224))
        image_array = np.array(image) / 255.0
        input_tensor = np.expand_dims(image_array, axis=0)


        # Realizar la predicción
        predictions = model.predict(input_tensor)[0]
        top_index = int(np.argmax(predictions))
        top_class = classes[top_index]
        confidence = float(predictions[top_index])

        all_preds = [{"class": c, "confidence": float(p)} for c, p in zip(classes, predictions)]
        all_preds.sort(key=lambda x: x["confidence"], reverse=True)
        return JSONResponse({
            "success": True,
            "file_type": "image",
            "filename": filename,
            "message": message,
            "analysis": {
                "predicted_class": top_class,
                "confidence": confidence,
                "all_predictions": all_preds,
                "model_used": "efficientnet_model.keras"
            }
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Error interno: {str(e)}"})
