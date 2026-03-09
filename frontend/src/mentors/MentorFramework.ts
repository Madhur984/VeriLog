/**
 * MentorFramework.ts — Unified AI Mentor System
 *
 * Base framework for all AI mentors in the DigiLogic platform.
 * Provides common personality engine, dialogue system, and context management.
 * Individual mentors (SIGMA, VoltMonkey, Chronos, Verity, Archon) extend this.
 */

// ─── Types ──────────────────────────────────────────────────────────────

export type MentorId = 'sigma' | 'voltmonkey' | 'chronos' | 'verity' | 'archon';

export type EmotionState = 'neutral' | 'happy' | 'thinking' | 'excited' | 'concerned' | 'teaching' | 'celebrating';

export type HintLevel = 'nudge' | 'hint' | 'explanation' | 'solution';

export interface MentorPersonality {
    id: MentorId;
    name: string;
    title: string;
    domain: string;
    avatar: string;          // Emoji or icon identifier
    accentColor: string;
    greeting: string;
    encouragements: string[];
    corrections: string[];
    celebrations: string[];
    catchphrases: string[];
}

export interface MentorContext {
    currentModule: string;
    currentChallenge: string;
    userLevel: number;
    attemptCount: number;
    errorHistory: string[];
    successHistory: string[];
    lastInteraction: number;
}

export interface MentorMessage {
    id: string;
    mentorId: MentorId;
    emotion: EmotionState;
    text: string;
    hintLevel: HintLevel;
    timestamp: number;
    actions?: MentorAction[];
}

export interface MentorAction {
    label: string;
    type: 'navigate' | 'highlight' | 'explain' | 'quiz' | 'demo';
    payload: Record<string, unknown>;
}

export interface MentorHint {
    level: HintLevel;
    text: string;
    relatedConcept?: string;
    codeSnippet?: string;
}

// ─── Base Mentor Class ──────────────────────────────────────────────────

let msgCounter = 0;

export abstract class BaseMentor {
    readonly personality: MentorPersonality;
    protected context: MentorContext;
    protected emotion: EmotionState = 'neutral';
    protected messageHistory: MentorMessage[] = [];

    constructor(personality: MentorPersonality) {
        this.personality = personality;
        this.context = {
            currentModule: '',
            currentChallenge: '',
            userLevel: 1,
            attemptCount: 0,
            errorHistory: [],
            successHistory: [],
            lastInteraction: Date.now(),
        };
    }

    // ─── Public API ─────────────────────────────────────────────────

    /** Greet the user when entering a module */
    greet(): MentorMessage {
        this.emotion = 'happy';
        return this.createMessage(this.personality.greeting, 'nudge');
    }

    /** React to a user error */
    onError(errorType: string, details: string): MentorMessage {
        this.context.attemptCount++;
        this.context.errorHistory.push(errorType);
        this.emotion = 'concerned';

        const hint = this.generateHint(errorType, details);
        return this.createMessage(hint.text, hint.level);
    }

    /** React to a user success */
    onSuccess(achievementType: string): MentorMessage {
        this.context.successHistory.push(achievementType);
        this.emotion = 'celebrating';

        const celebration = this.pickRandom(this.personality.celebrations);
        return this.createMessage(celebration, 'nudge');
    }

    /** Provide progressive hints based on attempt count */
    getProgressiveHint(): MentorMessage {
        const level = this.getHintLevel();
        const hint = this.generateContextualHint(level);
        this.emotion = 'teaching';
        return this.createMessage(hint.text, hint.level);
    }

    /** Update context */
    setContext(update: Partial<MentorContext>): void {
        Object.assign(this.context, update);
        this.context.lastInteraction = Date.now();
    }

    /** Get current emotion */
    getEmotion(): EmotionState {
        return this.emotion;
    }

    /** Get message history */
    getHistory(): MentorMessage[] {
        return [...this.messageHistory];
    }

    // ─── Abstract Methods (implemented by each mentor) ──────────────

    /** Generate a domain-specific hint based on error type */
    protected abstract generateHint(errorType: string, details: string): MentorHint;

    /** Generate a contextual hint at the specified level */
    protected abstract generateContextualHint(level: HintLevel): MentorHint;

    // ─── Internal ───────────────────────────────────────────────────

    protected createMessage(text: string, hintLevel: HintLevel, actions?: MentorAction[]): MentorMessage {
        const msg: MentorMessage = {
            id: `msg-${++msgCounter}`,
            mentorId: this.personality.id,
            emotion: this.emotion,
            text,
            hintLevel,
            timestamp: Date.now(),
            actions,
        };
        this.messageHistory.push(msg);
        return msg;
    }

    protected getHintLevel(): HintLevel {
        if (this.context.attemptCount <= 1) return 'nudge';
        if (this.context.attemptCount <= 3) return 'hint';
        if (this.context.attemptCount <= 5) return 'explanation';
        return 'solution';
    }

    protected pickRandom(arr: string[]): string {
        return arr[Math.floor(Math.random() * arr.length)] || '';
    }
}
