/**
 * ShareCircuitDialog.tsx — Dialog for sharing circuits to the community
 *
 * Allows users to set title, description, tags, difficulty,
 * category, and visibility before publishing.
 */

import { useState, useCallback, memo } from 'react';
import { useCommunityStore } from '../../community/communityStore';
import type { CircuitCategory, CircuitVisibility } from '../../community/CommunityTypes';

interface ShareCircuitDialogProps {
    circuitData: string;
    onClose: () => void;
}

export const ShareCircuitDialog = memo(({ circuitData, onClose }: ShareCircuitDialogProps) => {
    const shareCircuit = useCommunityStore(s => s.shareCircuit);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('beginner');
    const [category, setCategory] = useState<CircuitCategory>('combinational');
    const [visibility, setVisibility] = useState<CircuitVisibility>('public');

    const handleAddTag = useCallback(() => {
        const tag = tagInput.trim().toLowerCase();
        if (tag && !tags.includes(tag) && tags.length < 5) {
            setTags(prev => [...prev, tag]);
            setTagInput('');
        }
    }, [tagInput, tags]);

    const handleRemoveTag = useCallback((tag: string) => {
        setTags(prev => prev.filter(t => t !== tag));
    }, []);

    const handleShare = useCallback(() => {
        if (!title.trim()) return;
        shareCircuit({
            authorId: 'current-user',
            title: title.trim(),
            description: description.trim(),
            tags,
            circuitData,
            thumbnailUrl: '',
            visibility,
            difficulty,
            category,
        });
        onClose();
    }, [title, description, tags, circuitData, visibility, difficulty, category, shareCircuit, onClose]);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            fontFamily: "'IBM Plex Mono', monospace",
        }}>
            <div style={{
                background: '#0d1117',
                border: '1px solid rgba(0, 212, 255, 0.15)',
                borderRadius: 8,
                width: 480,
                maxHeight: '80vh',
                overflow: 'auto',
                padding: 24,
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ color: '#00D4FF', fontSize: 16, fontWeight: 700, margin: 0 }}>
                        🔗 Share Circuit
                    </h2>
                    <button onClick={onClose} style={closeBtnStyle}>✕</button>
                </div>

                {/* Title */}
                <Field label="Title *">
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="4-bit Ripple Carry Adder"
                        style={inputStyle}
                        maxLength={80}
                    />
                </Field>

                {/* Description */}
                <Field label="Description">
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Describe what your circuit does..."
                        rows={3}
                        style={{ ...inputStyle, resize: 'vertical' }}
                        maxLength={500}
                    />
                </Field>

                {/* Tags */}
                <Field label={`Tags (${tags.length}/5)`}>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 4 }}>
                        {tags.map(tag => (
                            <span key={tag} style={{
                                fontSize: 9,
                                padding: '2px 6px',
                                background: 'rgba(0, 212, 255, 0.06)',
                                border: '1px solid rgba(0, 212, 255, 0.12)',
                                borderRadius: 3,
                                color: '#00D4FF',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                            }}>
                                #{tag}
                                <button onClick={() => handleRemoveTag(tag)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 8, padding: 0 }}>✕</button>
                            </span>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                        <input
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                            placeholder="Add tag..."
                            style={{ ...inputStyle, flex: 1 }}
                            maxLength={20}
                        />
                        <button onClick={handleAddTag} style={addBtnStyle}>+</button>
                    </div>
                </Field>

                {/* Row: Difficulty + Category */}
                <div style={{ display: 'flex', gap: 12 }}>
                    <Field label="Difficulty" style={{ flex: 1 }}>
                        <select value={difficulty} onChange={e => setDifficulty(e.target.value as any)} style={selectStyle}>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                            <option value="expert">Expert</option>
                        </select>
                    </Field>
                    <Field label="Category" style={{ flex: 1 }}>
                        <select value={category} onChange={e => setCategory(e.target.value as any)} style={selectStyle}>
                            <option value="combinational">Combinational</option>
                            <option value="sequential">Sequential</option>
                            <option value="arithmetic">Arithmetic</option>
                            <option value="memory">Memory</option>
                            <option value="processor">Processor</option>
                            <option value="io">I/O</option>
                            <option value="custom">Custom</option>
                        </select>
                    </Field>
                </div>

                {/* Visibility */}
                <Field label="Visibility">
                    <div style={{ display: 'flex', gap: 6 }}>
                        {(['public', 'unlisted', 'private'] as CircuitVisibility[]).map(v => (
                            <button
                                key={v}
                                onClick={() => setVisibility(v)}
                                style={{
                                    flex: 1,
                                    background: visibility === v ? 'rgba(0, 212, 255, 0.08)' : 'rgba(255,255,255,0.02)',
                                    border: `1px solid ${visibility === v ? 'rgba(0, 212, 255, 0.2)' : 'rgba(255,255,255,0.06)'}`,
                                    color: visibility === v ? '#00D4FF' : 'rgba(255,255,255,0.3)',
                                    fontSize: 10,
                                    padding: '5px 8px',
                                    borderRadius: 3,
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                    textTransform: 'capitalize',
                                }}
                            >
                                {v === 'public' ? '🌍' : v === 'unlisted' ? '🔗' : '🔒'} {v}
                            </button>
                        ))}
                    </div>
                </Field>

                {/* Submit */}
                <button
                    onClick={handleShare}
                    disabled={!title.trim()}
                    style={{
                        width: '100%',
                        padding: '10px 16px',
                        background: title.trim() ? 'rgba(0, 212, 255, 0.12)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${title.trim() ? 'rgba(0, 212, 255, 0.25)' : 'rgba(255,255,255,0.06)'}`,
                        color: title.trim() ? '#00D4FF' : 'rgba(255,255,255,0.15)',
                        fontSize: 12,
                        fontWeight: 700,
                        borderRadius: 4,
                        cursor: title.trim() ? 'pointer' : 'not-allowed',
                        fontFamily: 'inherit',
                        marginTop: 8,
                        transition: 'all 150ms',
                    }}
                >
                    🚀 Share Circuit
                </button>
            </div>
        </div>
    );
});

ShareCircuitDialog.displayName = 'ShareCircuitDialog';

// ─── Field ───────────────────────────────────────────────────────────────

const Field = memo(({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) => (
    <div style={{ marginBottom: 14, ...style }}>
        <label style={{ display: 'block', color: 'rgba(255,255,255,0.35)', fontSize: 9, marginBottom: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {label}
        </label>
        {children}
    </div>
));

Field.displayName = 'Field';

// ─── Styles ──────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(0, 212, 255, 0.1)',
    color: '#e6edf3',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    padding: '6px 10px',
    borderRadius: 4,
    outline: 'none',
    boxSizing: 'border-box',
};

const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: 'pointer',
};

const closeBtnStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.3)',
    fontSize: 14,
    cursor: 'pointer',
    padding: 4,
};

const addBtnStyle: React.CSSProperties = {
    background: 'rgba(0, 212, 255, 0.08)',
    border: '1px solid rgba(0, 212, 255, 0.15)',
    color: '#00D4FF',
    fontSize: 14,
    padding: '2px 10px',
    borderRadius: 4,
    cursor: 'pointer',
    fontFamily: "'IBM Plex Mono', monospace",
};
