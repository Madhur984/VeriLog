import io
import numpy as np
import librosa
from pydub import AudioSegment

class AudioProcessor:
    def __init__(self, target_sr=16000, duration=5.0):
        self.target_sr = target_sr
        self.target_duration = duration
        
    def process_audio(self, audio_bytes: bytes) -> tuple:
        """
        Process base64 audio: MP3 → WAV → normalized numpy array
        """
        # Combine loading and processing
        audio, sr = self.load_from_bytes(audio_bytes)
        
        # Pad/trim to target duration
        target_length = int(self.target_duration * sr)
        if len(audio) > target_length:
            audio = audio[:target_length]
        else:
            audio = np.pad(audio, (0, max(0, target_length - len(audio))))
        
        # Normalize
        audio = self.normalize_audio(audio)
        
        return audio, sr

    def load_from_bytes(self, audio_bytes: bytes) -> tuple:
        """Load audio from bytes (MP3/WAV) into numpy array using librosa"""
        try:
            # Load directly with librosa which handles format detection
            # Note: librosa.load supports file-like objects
            audio, sr = librosa.load(io.BytesIO(audio_bytes), sr=self.target_sr, mono=True)
            return audio, sr
        except Exception as e:
            print(f"Librosa load failed: {e}")
            raise ValueError(f"Could not decode audio data: {str(e)}")
    
    def normalize_audio(self, audio: np.ndarray) -> np.ndarray:
        """Normalize audio to -1 to 1 range"""
        if np.max(np.abs(audio)) > 0:
            audio = audio / np.max(np.abs(audio))
        return audio
    
    def extract_segments(self, audio: np.ndarray, sr: int, segment_duration: float = 2.0):
        """Extract multiple segments for robust detection"""
        segment_len = int(segment_duration * sr)
        segments = []
        
        for start in range(0, len(audio) - segment_len, segment_len // 2):
            segment = audio[start:start + segment_len]
            segments.append(segment)
        
        return segments[:5]  # Return max 5 segments
