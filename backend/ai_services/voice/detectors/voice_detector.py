import numpy as np
import joblib
import os
from typing import Tuple, Dict
import warnings

class VoiceDetector:
    def __init__(self, models_dir="app/models"):
        self.models_dir = models_dir
        self.models = {}
        self.feature_extractor = None
        self.load_all_models()
        

        
        if not self.models:
            warnings.warn("No models loaded. Please train models using train_multilingual.py")

    # ... (skipping extract_features and normalize_features which remain the same) ...
    # This replace chunk is a bit risky due to skipping lines. Let's do a contiguous block for load_all_models first.
    
    # Actually, I'll just rewrite classify to include GB, assuming the load loop is correct.
    # Wait, I need to load it first.
    
    def load_all_models(self):
        """Load all language-specific models"""
        languages = ['english', 'hindi', 'tamil', 'telugu', 'malayalam']
        
        for lang in languages:
            lang_dir = os.path.join(self.models_dir, lang)
            
            # Load Random Forest
            rf_path = os.path.join(lang_dir, "random_forest.pkl")
            if os.path.exists(rf_path):
                self.models[f"{lang}_rf"] = joblib.load(rf_path)
            
            # Load Gradient Boosting
            gb_path = os.path.join(lang_dir, "gradient_boosting.pkl")
            if os.path.exists(gb_path):
                self.models[f"{lang}_gb"] = joblib.load(gb_path)

            # Load MLP (Neural Network)
            mlp_path = os.path.join(lang_dir, "mlp.pkl")
            if os.path.exists(mlp_path):
                self.models[f"{lang}_mlp"] = joblib.load(mlp_path)

        
        if not self.models:
            warnings.warn("No models loaded. Please train models using train_multilingual.py")
    
    def extract_features(self, audio: np.ndarray, sr: int, language: str) -> np.ndarray:
        """Extract features for given language"""
        from app.features.extractor import FeatureExtractor
        
        if self.feature_extractor is None:
            self.feature_extractor = FeatureExtractor(sr)
        
        # Extract language-aware features
        features = self.feature_extractor.extract_all_features(audio, language)
        
        # Apply language-specific normalization
        features = self.normalize_features(features, language)
        
        return features
    
    def normalize_features(self, features: np.ndarray, language: str) -> np.ndarray:
        """Apply language-specific normalization"""
        # Load normalization parameters if available
        norm_path = os.path.join(self.models_dir, language, "norm_params.pkl")
        if os.path.exists(norm_path):
            norm_params = joblib.load(norm_path)
            features = (features - norm_params['mean']) / (norm_params['std'] + 1e-6)
        
        return features
    
    def classify(self, features: np.ndarray, language: str) -> Tuple[int, float, str]:
        """
        Classify using ensemble of models
        Returns: (prediction, confidence, model_name)
        """
        # Get predictions from all available models for this language
        predictions = []
        confidences = []
        model_names = []
        
        # 1. Random Forest
        rf_key = f"{language}_rf"
        if rf_key in self.models:
            rf_model = self.models[rf_key]
            rf_pred = rf_model.predict([features])[0]
            rf_prob = rf_model.predict_proba([features])[0]
            rf_confidence = max(rf_prob)
            
            predictions.append(rf_pred)
            confidences.append(rf_confidence)
            model_names.append("random_forest")
        


        # 3. Gradient Boosting
        gb_key = f"{language}_gb"
        if gb_key in self.models:
            gb_model = self.models[gb_key]
            gb_pred = gb_model.predict([features])[0]
            gb_prob = gb_model.predict_proba([features])[0]
            gb_confidence = max(gb_prob)
            
            predictions.append(gb_pred)
            confidences.append(gb_confidence)
            model_names.append("gradient_boosting")

        # 4. MLP (Neural Network)
        mlp_key = f"{language}_mlp"
        if mlp_key in self.models:
            mlp_model = self.models[mlp_key]
            mlp_pred = mlp_model.predict([features])[0]
            mlp_prob = mlp_model.predict_proba([features])[0]
            mlp_confidence = max(mlp_prob)
            
            predictions.append(mlp_pred)
            confidences.append(mlp_confidence)
            model_names.append("mlp_neural_network")

        
        # If no models loaded, return mock prediction
        if not predictions:
            return 0, 0.5, "mock_model"
        
        # Ensemble voting (weighted by confidence)
        weighted_sum = 0
        total_weight = 0
        
        for pred, conf in zip(predictions, confidences):
            weighted_sum += pred * conf
            total_weight += conf
        
        final_prediction = 1 if (weighted_sum / total_weight) > 0.5 else 0
        
        # Final confidence (average of agreeing models)
        agreeing_confidences = [
            conf for pred, conf in zip(predictions, confidences) 
            if pred == final_prediction
        ]
        
        final_confidence = np.mean(agreeing_confidences) if agreeing_confidences else 0.5
        
        # Determine which model contributed most
        primary_model = model_names[np.argmax(confidences)]
        
        # Confidence Boosting (User Request: "increase confidence score")
        # We apply a sigmoid-like boost to push decisive scores closer to 1.0 (or 0.0)
        # If model is > 75% sure, we boost it to > 90%
        if final_confidence > 0.75:
            boost_factor = 1.2
            final_confidence = min(0.98, final_confidence * boost_factor)
        elif final_confidence < 0.25:
            # Low confidence for class 1 means high confidence for class 0, but here confidence is for the predicted class
            # so we just ensure it's high. 
            pass 
            
        return final_prediction, final_confidence, primary_model
    
    def get_loaded_models(self) -> Dict:
        """Get list of loaded models for health check"""
        return {
            "traditional_models": list(self.models.keys()),
            "total_models": len(self.models)
        }
