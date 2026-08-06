import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface NavigationPayload {
  type: 'navigate';
  path: string;
  message?: string;
  confidence?: number;
}

export interface UseChatNavigationOptions {
  autoNavigate?: boolean;
  delayMs?: number; // e.g. 2000ms delay before redirecting
  minConfidence?: number; // threshold required for auto-navigation (default 0.70)
  onNavigate?: (path: string) => void;
}

export interface ResolvedPath {
  isExternal: boolean;
  url: string;
}

/**
 * Normalizes relative routes ("/dashboard") vs full URLs ("https://example.com/dashboard").
 */
export function normalizePath(path: string): ResolvedPath {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return { isExternal: true, url: path };
  }
  return { isExternal: false, url: path.startsWith('/') ? path : `/${path}` };
}

/**
 * Safely parses navigation JSON payload from assistant response strings or objects.
 */
export function parseNavigationPayload(content: unknown): NavigationPayload | null {
  if (typeof content === 'object' && content !== null) {
    const obj = content as Record<string, unknown>;
    if (obj.type === 'navigate' && typeof obj.path === 'string') {
      return {
        type: 'navigate',
        path: obj.path,
        message: typeof obj.message === 'string' ? obj.message : undefined,
        confidence: typeof obj.confidence === 'number' ? obj.confidence : undefined,
      };
    }
  }

  if (typeof content === 'string') {
    try {
      const jsonMatch = content.match(/\{[\s\S]*"type"\s*:\s*"navigate"[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.type === 'navigate' && typeof parsed.path === 'string') {
          return parsed as NavigationPayload;
        }
      }
    } catch {
      /* Return null if not a valid navigation JSON payload */
    }
  }

  return null;
}

/**
 * Custom hook to handle automatic & manual navigation with live countdown progress calculation.
 */
export function useChatNavigation(
  payload: NavigationPayload | null,
  options: UseChatNavigationOptions = {}
) {
  const {
    autoNavigate = true,
    delayMs = 2000,
    minConfidence = 0.70,
    onNavigate,
  } = options;

  const navigate = useNavigate();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [progressPct, setProgressPct] = useState<number>(100);
  const [redirected, setRedirected] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const confidence = payload?.confidence ?? 1.0;
  const isConfidenceMet = confidence >= minConfidence;
  const shouldAutoNavigate = autoNavigate && isConfidenceMet && !cancelled && !redirected;

  const resolved = payload ? normalizePath(payload.path) : null;

  // Execute navigation immediately (manual click or countdown expiration)
  const navigateNow = useCallback(() => {
    if (!resolved || redirected) return;
    setRedirected(true);
    setCountdown(0);
    setProgressPct(0);

    onNavigate?.(resolved.url);

    if (resolved.isExternal) {
      window.open(resolved.url, '_self');
    } else {
      navigate(resolved.url);
    }
  }, [resolved, redirected, navigate, onNavigate]);

  // Cancel auto-redirection
  const cancelRedirect = useCallback(() => {
    setCancelled(true);
    setCountdown(null);
    setProgressPct(0);
  }, []);

  // Timer effect for auto-navigation countdown and progress calculation
  useEffect(() => {
    if (!shouldAutoNavigate || !payload) return;

    const initialSeconds = Math.ceil(delayMs / 1000);
    setCountdown(initialSeconds);
    setProgressPct(100);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(interval);
          navigateNow();
          return 0;
        }
        const next = prev - 1;
        setProgressPct(Math.round((next / initialSeconds) * 100));
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [shouldAutoNavigate, payload, delayMs, navigateNow]);

  return {
    navigateNow,
    cancelRedirect,
    countdown,
    progressPct,
    redirected,
    cancelled,
    resolvedPath: resolved,
    isAutoNavigating: shouldAutoNavigate && countdown !== null && countdown > 0,
    isLowConfidence: !isConfidenceMet,
  };
}
