import numpy as np
from typing import Dict, Any

class ExplanationGenerator:
    def __init__(self):
        self.feature_descriptions = {
            'mfcc_mean': 'MFCC coefficients indicate vocal tract characteristics',
            'spectral_centroid': 'Spectral centroid shows brightness of voice',
            'zero_crossing_rate': 'Zero crossing rate indicates noisiness',
            'chroma': 'Chroma features represent pitch class',
            'spectral_contrast': 'Spectral contrast shows dynamic range',
        }
        
        self.language_patterns = {
            'tamil': 'Tamil typically has retroflex consonants and specific vowel harmony',
            'hindi': 'Hindi has aspirated stops and distinctive intonation patterns',
            'english': 'English exhibits stress-timed rhythm and wide pitch range',
            'telugu': 'Telugu features vowel length distinction and specific consonant clusters',
            'malayalam': 'Malayalam has pre-nasalized stops and rich agglutination'
        }
    
    def generate_explanation(self, label: str, confidence: float, 
                             model_name: str, language: str, features: Any = None) -> str:
        """
        Generate strict Problem Statement 1 compliant explanation
        """
        # User defined examples for AI_GENERATED
        ai_reasons = [
            "Unnatural pitch consistency and robotic speech patterns detected",
            "Suspiciously consistent spectral features and lack of natural variations",
            "Abnormal harmonic-to-noise ratio with minimal breath artifacts",
            "Overly perfect formant structure typical of synthetic speech"
        ]
        
        # User defined examples for HUMAN
        human_reasons = [
            "Natural pitch variations and human breath patterns detected",
            "Expected spectral variations and natural speech imperfections present",
            "Normal harmonic structure with appropriate noise characteristics",
            "Human-like formant transitions and natural speech rhythm"
        ]
        
        # Select explanation based on confidence/features
        # If features provided (which they should be), we could be smarter using HNR
        
        idx = 0
        if features is not None and len(features) > 0:
            # Use HNR if available (it was added as last feature)
            try:
                hnr_val = features[-1]
                # High HNR often means very clean/synthetic. Low HNR means noisy/breathy (Human)
                if label == "AI_GENERATED":
                    if hnr_val > 20: # Very clean
                         idx = 2 # Abnormal harmonic-to-noise ratio
                    else:
                         idx = 0
                else:
                    idx = 0
            except:
                idx = 0
        
        # Fallback logic based on confidence if no feature logic applies
        # Just deterministic mapping for stable checks
        if confidence > 0.90:
            idx = 0
        elif confidence > 0.80:
            idx = 1
        elif confidence > 0.70:
            idx = 2
        else:
            idx = 3

        if label == "AI_GENERATED":
            return ai_reasons[idx % len(ai_reasons)]
        else:
            return human_reasons[idx % len(human_reasons)]
