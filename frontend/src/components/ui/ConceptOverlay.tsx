import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Lightbulb, Brain, X } from 'lucide-react';

export interface ConceptData {
    id: string;
    title: string;
    description: string;
    visualLink?: string;
    insight: string;
    memoryHook: string;
    color?: string;
}

interface ConceptOverlayProps {
    concept: ConceptData | null;
    onDismiss: () => void;
    isVisible: boolean;
}

export const ConceptOverlay: React.FC<ConceptOverlayProps> = ({
    concept,
    onDismiss,
    isVisible
}) => {
    if (!concept) return null;

    const themeColor = concept.color || '#00D4FF';

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    style={{
                        position: 'absolute',
                        bottom: 100,
                        right: 24,
                        width: 320,
                        background: 'var(--bg-elev)',
                        border: `1px solid ${themeColor}40`,
                        borderRadius: 8,
                        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 16px ${themeColor}10`,
                        padding: 20,
                        zIndex: 1000,
                        pointerEvents: 'auto'
                    }}
                    className="theory-card-float"
                >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ 
                                padding: 6, borderRadius: 4, 
                                background: `${themeColor}20`, color: themeColor 
                            }}>
                                <Brain size={16} />
                            </div>
                            <span style={{ 
                                fontFamily: 'IBM Plex Mono', fontSize: 10, 
                                fontWeight: 700, color: themeColor,
                                letterSpacing: '0.1em', textTransform: 'uppercase'
                            }}>
                                Theory Module
                            </span>
                        </div>
                        <button 
                            onClick={onDismiss}
                            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Title & Description */}
                    <h3 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 600 }}>{concept.title}</h3>
                    <p style={{ margin: '0 0 16px 0', fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                        {concept.description}
                    </p>

                    {/* Visual Link / Animation Placeholder */}
                    {concept.visualLink && (
                        <div style={{ 
                            padding: '8px 12px', background: 'rgba(255,255,255,0.03)', 
                            borderRadius: 4, marginBottom: 16, borderLeft: `2px solid ${themeColor}`
                        }}>
                             <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: 'IBM Plex Mono' }}>
                                Visual Context: {concept.visualLink}
                             </span>
                        </div>
                    )}

                    {/* Engineering Insight */}
                    <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                        <Info size={14} style={{ flexShrink: 0, marginTop: 2, color: themeColor }} />
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' }}>
                            <strong>Insight:</strong> {concept.insight}
                        </div>
                    </div>

                    {/* Memory Hook */}
                    <div style={{ 
                        display: 'flex', gap: 10, padding: 10, 
                        background: 'rgba(0,0,0,0.2)', borderRadius: 4,
                        border: '1px dashed rgba(255,255,255,0.1)'
                    }}>
                        <Lightbulb size={14} style={{ flexShrink: 0, marginTop: 2, color: '#F59E0B' }} />
                        <div style={{ fontSize: 11, color: '#F59E0B' }}>
                            <strong>Hook:</strong> "{concept.memoryHook}"
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
