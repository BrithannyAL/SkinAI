import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import GRU, Bidirectional
from tensorflow.keras.saving import register_keras_serializable
import tensorflow.keras.backend as K
import numpy as np
from fastapi.responses import JSONResponse
from pydub import AudioSegment
import io
import mimetypes

# Parámetros del espectrograma
frame_length = 256
frame_step = 160
fft_length = 384

# En lugar de tu definición actual, usa:
characters = [x for x in "abcdefghijklmnopqrstuvwxyz'?! "]
char_to_num = tf.keras.layers.StringLookup(vocabulary=characters, oov_token="")
num_to_char = tf.keras.layers.StringLookup(
    vocabulary=char_to_num.get_vocabulary(), 
    oov_token="", 
    invert=True
)

@register_keras_serializable()
class CustomGRU(GRU):
    def __init__(self, *args, time_major=False, **kwargs):
        super().__init__(*args, **kwargs)
        self.time_major = time_major

    def call(self, inputs, **kwargs):
        return super().call(inputs, **kwargs)

def CTCLoss(y_true, y_pred):
    batch_len = tf.cast(tf.shape(y_true)[0], dtype="int64")
    input_length = tf.cast(tf.shape(y_pred)[1], dtype="int64")
    label_length = tf.cast(tf.shape(y_true)[1], dtype="int64")
    input_length = input_length * tf.ones(shape=(batch_len, 1), dtype="int64")
    label_length = label_length * tf.ones(shape=(batch_len, 1), dtype="int64")
    loss = K.ctc_batch_cost(y_true, y_pred, input_length, label_length)
    return loss

model_path = "models/speech_to_text_spanish1_v2.h5"
model = load_model(
    model_path,
    custom_objects={
        "GRU": CustomGRU,
        "CTCLoss": CTCLoss
    },
    compile=False
)
model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001), loss=CTCLoss)

def convert_to_wav(contents: bytes, ext: str) -> bytes:
    audio = AudioSegment.from_file(io.BytesIO(contents), format=ext)
    wav_io = io.BytesIO()
    audio = audio.set_frame_rate(22050).set_channels(1)  # Asegura 22.05kHz mono
    audio.export(wav_io, format="wav", parameters=["-acodec", "pcm_s16le"])
    return wav_io.getvalue()

def preprocess_audio_wav(contents):
    audio, _ = tf.audio.decode_wav(contents)
    audio = tf.squeeze(audio, axis=-1)
    audio = tf.cast(audio, tf.float32)
    
    # Calcula el espectrograma idéntico al de entrenamiento
    spectrogram = tf.signal.stft(
        audio, 
        frame_length=frame_length, 
        frame_step=frame_step, 
        fft_length=fft_length
    )
    spectrogram = tf.abs(spectrogram)
    spectrogram = tf.math.pow(spectrogram, 0.5)  # Potencia 0.5 para aproximar dB
    
    # Normalización idéntica al entrenamiento
    means = tf.math.reduce_mean(spectrogram, 1, keepdims=True)
    stddevs = tf.math.reduce_std(spectrogram, 1, keepdims=True)
    spectrogram = (spectrogram - means) / (stddevs + 1e-10)
    
    return tf.expand_dims(spectrogram, 0)

def decode_batch_predictions(pred):
    input_len = np.ones(pred.shape[0]) * pred.shape[1]
    results = K.ctc_decode(pred, input_length=input_len, greedy=True)[0][0]
    output_text = []
    for result in results:
        # Filtra tokens -1 (blancos) antes de decodificar
        result = tf.gather(result, tf.where(result != -1))
        result = tf.strings.reduce_join(num_to_char(result)).numpy().decode("utf-8")
        output_text.append(result)
    return output_text

def analyze_audio(contents: bytes, filename: str, message: str):
    try:
        # Detectar la extensión MIME real si el nombre es engañoso
        mime_type, _ = mimetypes.guess_type(filename)
        ext = filename.split(".")[-1].lower()

        # Si el tipo MIME no es WAV o la extensión es distinta, convertimos
        if mime_type != "audio/x-wav" or ext != "wav":
            print(f"🔁 Convirtiendo archivo a WAV: {filename} ({mime_type})")
            contents = convert_to_wav(contents, ext if ext != "wav" else "webm")  # fallback si fue grabado en webm

        spectrogram = preprocess_audio_wav(contents)
        predictions = model.predict(spectrogram)
        transcription = decode_batch_predictions(predictions)[0]

        print("transcription :", transcription)

        return JSONResponse({
            "success": True,
            "file_type": "audio",
            "filename": filename,
            "message": message,
            "analysis": {
                "transcription": transcription,
                "model_used": "DeepSpeech_2 CTC"
            }
        })

    except Exception as e:
        return JSONResponse(status_code=500, content={
            "success": False,
            "file_type": "audio",
            "filename": filename,
            "message": message,
            "error": str(e)
        })
