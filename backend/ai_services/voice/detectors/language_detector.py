import numpy as np
import librosa
import os

class LanguageDetector:
    def __init__(self):
        # For now, use a simple MFCC-based approach
        # SpeechBrain integration can be added later when models are available
        self.lang_codes = {
            'tamil': 'ta', 'english': 'en', 'hindi': 'hi',
            'malayalam': 'ml', 'telugu': 'te'
        }
        
    def detect(self, audio: np.ndarray, sr: int, hint: str = None) -> str:
        """
        Detect language from audio
        Returns: 'tamil', 'english', 'hindi', 'malayalam', 'telugu'
        """
        # If hint provided and valid, use it
        if hint and hint in ['ta', 'en', 'hi', 'ml', 'te']:
            return self.get_full_language_name(hint)
        
        # Fallback: Simple MFCC-based detection
        return self.detect_with_mfcc(audio, sr)
    
    def detect_with_mfcc(self, audio: np.ndarray, sr: int) -> str:
        """ML-based language detection"""
        import joblib
        from app.features.extractor import FeatureExtractor
        
        try:
            # Load models if not cached
            if not hasattr(self, 'model'):
                self.model = joblib.load("app/models/language_model.pkl")
                self.scaler = joblib.load("app/models/language_scaler.pkl")
                self.lang_map = joblib.load("app/models/language_map.pkl")
                # Invert map for lookup
                self.inv_lang_map = {v: k for k, v in self.lang_map.items()}
                self.extractor = FeatureExtractor(sr)
            
            # Extract features
            # We don't know the language yet, but extractor needs a 'language' arg for some conditional logic
            # However, for LID we used the same extractor. Let's pass 'english' as dummy or modify extractor.
            # In our training loop, we passed the correct language (lang) to extractor.extract_all_features
            # But deep down, extractor might use it?
            # Creating a dummy 'english' is safe because the features (MFCC, Spectral, etc.) are content-agnostic mostly.
            features = self.extractor.extract_all_features(audio, 'english')
            
            # Scale
            features_scaled = self.scaler.transform([features])
            
            # Predict
            pred_idx = self.model.predict(features_scaled)[0]
            confidence = max(self.model.predict_proba(features_scaled)[0])
            
            predicted_lang = self.inv_lang_map[pred_idx]
            
            print(f"DEBUG: Language Identified: {predicted_lang} (Conf: {confidence:.2f})")
            return predicted_lang
            
        except Exception as e:
            print(f"Warning: Language Model not ready ({e}). Using Heuristics.")
            # Fallback to heuristics
            mfccs = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=40)
            spectral_centroid = librosa.feature.spectral_centroid(y=audio, sr=sr)[0]
            centroid_mean = np.mean(spectral_centroid)
            
            if centroid_mean < 1200: return "tamil"
            elif centroid_mean > 2200: return "english"
            elif 1500 <= centroid_mean <= 2200: return "hindi"
            elif 1200 <= centroid_mean < 1500: return "telugu"
            else: return "malayalam"
    
    def get_full_language_name(self, code: str) -> str:
        mapping = {'ta': 'tamil', 'en': 'english', 'hi': 'hindi',
                  'ml': 'malayalam', 'te': 'telugu'}
        return mapping.get(code, 'english')
