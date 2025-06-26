from fastapi.responses import JSONResponse
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.models import Model
from tensorflow.keras import layers
from tensorflow.keras.applications.efficientnet import preprocess_input
from PIL import Image
import numpy as np
import io

def build_model():
    base_model = EfficientNetB0(
        input_shape=(224, 224, 3),
        include_top=False,
        weights=None 
    )
    base_model.trainable = False

    inputs = layers.Input(shape=(224, 224, 3))
    x = base_model(inputs, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.2)(x)
    outputs = layers.Dense(8, activation="softmax")(x)  # 8 clases de piel

    model = Model(inputs, outputs)
    model.load_weights("models/best_weights.weights.h5") # Cargar pesos preentrenados
    return model

def analyze_image(contents, filename, message):
    print("Procesando imagen:", filename)

    model = build_model()

    classes = ['acne', 'benign-mole', 'bruises', 'dermatitis', 'freckles', 'melanoma', 'stretch marks', 'wart']

    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        image = image.resize((224, 224))
        image_array = np.array(image)
        image_array = preprocess_input(image_array)
        input_tensor = np.expand_dims(image_array, axis=0)

        predictions = model.predict(input_tensor)[0]
        print("Predicciones:", predictions) 
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
                "model_used": "efficientnet_weights"
            }
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Error interno: {str(e)}"})
