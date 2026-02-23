/* ═══════════════════════════════════════════════════════════════════
   BotEvents — Lightweight pub/sub event bus for VoltMonkey
   ──────────────────────────────────────────────────────────────────
   Zero dependencies. Components dispatch events → BotBrain listens
   and reacts with mood/dialogue/animation changes.
   ═══════════════════════════════════════════════════════════════ */

export type BotEventType =
    | 'LEVEL_STARTED'
    | 'FIRST_VISIT'
    | 'QUESTION_CORRECT'
    | 'QUESTION_WRONG'
    | 'THREE_CORRECT_STREAK'
    | 'CIRCUIT_BROKEN'
    | 'SHORT_CIRCUIT'
    | 'LEVEL_COMPLETED'
    | 'USER_IDLE_30S'
    | 'NEW_PATH_UNLOCKED';

export interface BotEvent {
    type: BotEventType;
    payload?: Record<string, unknown>;
}

type Listener = (event: BotEvent) => void;

class EventBus {
    private listeners = new Map<BotEventType | '*', Set<Listener>>();

    on(type: BotEventType | '*', fn: Listener): () => void {
        if (!this.listeners.has(type)) this.listeners.set(type, new Set());
        this.listeners.get(type)!.add(fn);
        return () => this.listeners.get(type)?.delete(fn);
    }

    emit(type: BotEventType, payload?: Record<string, unknown>): void {
        const event: BotEvent = { type, payload };
        this.listeners.get(type)?.forEach(fn => fn(event));
        this.listeners.get('*')?.forEach(fn => fn(event));
    }
}

/** Singleton event bus — import and use across the app */
export const botBus = new EventBus();
