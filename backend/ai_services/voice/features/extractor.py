import numpy as np
import librosa
from scipy import stats

class FeatureExtractor:
    def __init__(self, sr=16000):
        self.sr = sr
        self.n_mfcc = 40
        self.audio = None  # Store for CNN feature extraction
        
    def extract_all_features(self, audio: np.ndarray, language: str = None) -> np.ndarray:
        """
        Extract 318-D features + 40-D MFCCs
        Returns concatenated feature vector
        """
        self.audio = audio  # Store for later use
        features = []
        
        # 1. MFCC Features (40-D)
        mfcc_features = self.extract_mfcc_features(audio)
        features.extend(mfcc_features)
        
        # 2. Spectral Features
        spectral_features = self.extract_spectral_features(audio)
        features.extend(spectral_features)
        
        # 3. Temporal Features
        temporal_features = self.extract_temporal_features(audio)
        features.extend(temporal_features)
        
        # 4. Language-specific features
        if language:
            lang_features = self.extract_language_features(audio, language)
            features.extend(lang_features)
        
        return np.array(features)
    
    def extract_mfcc_features(self, audio: np.ndarray) -> list:
        """Extract 40-D MFCC + Delta + Delta-Delta features"""
        # 1. MFCC
        mfccs = librosa.feature.mfcc(
            y=audio, sr=self.sr, n_mfcc=self.n_mfcc,
            n_fft=2048, hop_length=512
        )
        
        # 2. Delta
        delta_mfccs = librosa.feature.delta(mfccs)
        
        # 3. Delta-Delta
        delta2_mfccs = librosa.feature.delta(mfccs, order=2)
        
        # 4. Harmonic-to-Noise Ratio (HNR)
        # AI voices often have unnatural harmonic structure
        harmonic, percussive = librosa.effects.hpss(y=audio)
        # Avoid division by zero
        hnr = np.mean(harmonic) / (np.mean(percussive) + 1e-6)
        
        features = []
        
        # Extract stats for MFCCs
        for feat_matrix in [mfccs, delta_mfccs, delta2_mfccs]:
            for coef in feat_matrix:
                features.extend([
                    np.mean(coef), np.std(coef), 
                    np.max(coef), np.min(coef),
                    stats.skew(coef), stats.kurtosis(coef)
                ])
            
        # Add HNR feature (Appending to the end)
        features.append(hnr)
        
        return features
    
    def extract_spectral_features(self, audio: np.ndarray) -> list:
        """Extract spectral features"""
        features = []
        
        # Mel-spectrogram
        mel_spec = librosa.feature.melspectrogram(
            y=audio, sr=self.sr, n_mels=128
        )
        mel_db = librosa.power_to_db(mel_spec, ref=np.max)
        
        # Statistical features from mel spectrogram
        features.extend(self._extract_stats(mel_db.flatten()))
        
        # Chroma features
        chroma = librosa.feature.chroma_stft(y=audio, sr=self.sr)
        features.extend(self._extract_stats(chroma.flatten()))
        
        # Spectral contrast
        spectral_contrast = librosa.feature.spectral_contrast(y=audio, sr=self.sr)
        features.extend(self._extract_stats(spectral_contrast.flatten()))
        
        # Tonnetz
        tonnetz = librosa.feature.tonnetz(y=audio, sr=self.sr)
        features.extend(self._extract_stats(tonnetz.flatten()))
        
        return features
    
    def extract_temporal_features(self, audio: np.ndarray) -> list:
        """Extract temporal features"""
        features = []
        
        # Zero crossing rate
        zcr = librosa.feature.zero_crossing_rate(audio)
        features.extend(self._extract_stats(zcr.flatten()))
        
        # RMS energy
        rms = librosa.feature.rms(y=audio)
        features.extend(self._extract_stats(rms.flatten()))
        
        # Autocorrelation
        autocorr = np.correlate(audio, audio, mode='full')
        autocorr = autocorr[len(autocorr)//2:]
        features.extend(self._extract_stats(autocorr[:100]))
        
        return features
    
    def extract_language_features(self, audio: np.ndarray, language: str) -> list:
        """Language-specific acoustic features"""
        features = []
        
        # Pitch statistics (varies by language)
        pitches, magnitudes = librosa.piptrack(y=audio, sr=self.sr)
        pitches = pitches[pitches > 0]
        
        if len(pitches) > 0:
            features.extend([
                np.mean(pitches), np.std(pitches),
                np.median(pitches), np.max(pitches)
            ])
        else:
            features.extend([0, 0, 0, 0])
        
        # Formant-like features (simplified)
        spectral_centroid = librosa.feature.spectral_centroid(y=audio, sr=self.sr)
        spectral_bandwidth = librosa.feature.spectral_bandwidth(y=audio, sr=self.sr)
        
        features.extend(self._extract_stats(spectral_centroid.flatten()))
        features.extend(self._extract_stats(spectral_bandwidth.flatten()))
        
        return features
    
    def _extract_stats(self, data: np.ndarray) -> list:
        """Extract statistical features from array"""
        if len(data) == 0:
            return [0, 0, 0, 0, 0, 0]
        
        return [
            np.mean(data), np.std(data),
            np.min(data), np.max(data),
            stats.skew(data), stats.kurtosis(data)
        ]
    
    def extract_cnn_features(self, audio: np.ndarray) -> np.ndarray:
        """Extract MFCCs for CNN (40 x time)"""
        mfccs = librosa.feature.mfcc(
            y=audio, sr=self.sr, n_mfcc=40,
            n_fft=2048, hop_length=512
        )
        # Normalize for CNN
        mfccs = (mfccs - np.mean(mfccs)) / (np.std(mfccs) + 1e-6)
        return mfccs.T  # Time x Features
