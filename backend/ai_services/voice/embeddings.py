import numpy as np
import io
import soundfile as sf
from resemblyzer import VoiceEncoder, preprocess_wav

class EmbeddingGenerator:
    def __init__(self):
        print("Loading Voice Encoder for embeddings...")
        # Force CPU for deployment compatibility
        self.encoder = VoiceEncoder(device="cpu")
        print("Voice Encoder loaded.")

    def generate_embedding(self, audio_bytes: bytes) -> list:
        """
        Generate 256-d vector embedding from audio bytes.
        Returns list of floats.
        """
        try:
            # Convert bytes to wav - resemblyzer expects numpy array or path
            with io.BytesIO(audio_bytes) as audio_file:
                # Read with soundfile (returns float32 numpy array)
                wav, sample_rate = sf.read(audio_file)
            
            # Preprocess (normalize volume, etc)
            wav = preprocess_wav(wav, source_sr=sample_rate)
            
            # Generate embedding
            embedding = self.encoder.embed_utterance(wav)
            
            # Convert numpy array to list for JSON serialization
            return embedding.tolist()
            
        except Exception as e:
            print(f"Embedding error: {e}")
            raise e
