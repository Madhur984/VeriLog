import React from 'react';
import { Compass, ExternalLink, ArrowRight, CheckCircle2, AlertCircle, MapPin, Link2 } from 'lucide-react';
import {
  useChatNavigation,
  parseNavigationPayload,
  NavigationPayload,
} from '../hooks/useChatNavigation';

export interface ChatMessageData {
  id?: string;
  role: 'user' | 'assistant';
  content: string | NavigationPayload | Record<string, unknown>;
}

export interface ChatMessageProps {
  message: ChatMessageData;
  autoNavigate?: boolean;
  minConfidence?: number;
  delayMs?: number;
  onNavigate?: (path: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  autoNavigate = true,
  minConfidence = 0.70,
  delayMs = 2000,
  onNavigate,
}) => {
  const isUser = message.role === 'user';
  const navPayload = !isUser ? parseNavigationPayload(message.content) : null;

  const {
    navigateNow,
    cancelRedirect,
    countdown,
    progressPct,
    redirected,
    isAutoNavigating,
    isLowConfidence,
    resolvedPath,
  } = useChatNavigation(navPayload, {
    autoNavigate,
    minConfidence,
    delayMs,
    onNavigate,
  });

  // 1. Render User or Standard Assistant Text Response
  if (isUser || !navPayload) {
    const textContent = typeof message.content === 'string' 
      ? message.content 
      : JSON.stringify(message.content);

    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-2`}>
        <div
          className={`max-w-[85%] whitespace-pre-wrap rounded-2xl border-[2.5px] border-[#1B1436] px-4 py-3 text-[13.5px] leading-relaxed shadow-[3px_3px_0_#1B1436] dark:border-[#4A3D7A] dark:shadow-[3px_3px_0_#7A3FD0] ${
            isUser
              ? 'bg-[#7A3FD0] font-medium text-white'
              : 'bg-white text-[#1B1436] dark:bg-[#1B1540] dark:text-[#E9E4FA]'
          }`}
        >
          {textContent}
        </div>
      </div>
    );
  }

  const countdownText = countdown === 1 ? '1 second' : `${countdown} seconds`;
  const destinationUrl = resolvedPath?.url || navPayload.path;

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigateNow();
    }
  };

  // 2. Render Accessible Navigation Action Card with Clickable Hyperlink Icons
  return (
    <div className="my-2 flex justify-start">
      <div
        tabIndex={0}
        role="region"
        aria-label={`Navigation suggestion to ${destinationUrl}`}
        className="group relative w-[90%] space-y-2.5 rounded-2xl border-[2.5px] border-[#1B1436] bg-white p-4 shadow-[4px_4px_0_#1B1436] outline-none focus:ring-2 focus:ring-[#7A3FD0] dark:border-[#4A3D7A] dark:bg-[#1B1540] dark:shadow-[4px_4px_0_#7A3FD0]"
      >
        {/* Card Header & Clickable Navigation Link */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            {/* Clickable MapPin / Compass Icon */}
            <button
              type="button"
              onClick={navigateNow}
              title={`Navigate to ${destinationUrl}`}
              aria-label={`Navigate to ${destinationUrl}`}
              className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-xl border-[2px] border-[#1B1436] bg-[#F1ECFF] text-[#7A3FD0] shadow-[2px_2px_0_#1B1436] transition-transform hover:scale-105 active:scale-95 dark:border-[#4A3D7A] dark:bg-[#2A1F52] dark:text-[#B98BFF]"
            >
              <MapPin size={16} />
            </button>

            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-bold leading-snug text-[#1B1436] dark:text-white">
                {navPayload.message || `Taking you to ${navPayload.path}...`}
              </div>
              
              {/* Tooltip / Secondary Target Path link */}
              <button
                type="button"
                onClick={navigateNow}
                title={`Click to open ${destinationUrl}`}
                aria-label={`Open route ${destinationUrl}`}
                className="mt-1 inline-flex items-center gap-1 font-mono text-[11.5px] font-semibold text-[#7A3FD0] hover:underline dark:text-[#B98BFF]"
              >
                <Link2 size={13} />
                <span>{destinationUrl}</span>
              </button>
            </div>
          </div>

          {/* Top-Right Direct Navigation Arrow Button */}
          <button
            type="button"
            onClick={navigateNow}
            aria-label={`Navigate to ${destinationUrl}`}
            title={`Navigate to ${destinationUrl}`}
            className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-xl border-[2px] border-[#1B1436] bg-[#7A3FD0] text-white shadow-[2px_2px_0_#1B1436] transition-all hover:translate-x-0.5 hover:bg-[#6832BD] active:translate-y-0.5 dark:border-[#4A3D7A] dark:shadow-[2px_2px_0_#3A2064]"
          >
            {resolvedPath?.isExternal ? <ExternalLink size={15} /> : <ArrowRight size={15} />}
          </button>
        </div>

        {/* Confidence Indicator */}
        {navPayload.confidence && (
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#6B5E86] dark:text-[#8E80B4]">
            <span>Match Confidence:</span>
            <span className={isLowConfidence ? 'text-amber-500' : 'text-emerald-500'}>
              {Math.round(navPayload.confidence * 100)}%
            </span>
          </div>
        )}

        {/* Low Confidence Warning */}
        {isLowConfidence && !redirected && (
          <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[12px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
            <AlertCircle size={14} />
            <span>Low confidence match — click the icon above or button below to navigate manually.</span>
          </div>
        )}

        {/* Animated Progress Countdown Toast */}
        {isAutoNavigating && (
          <div className="relative overflow-hidden rounded-xl border border-[#7A3FD0]/30 bg-[#F1ECFF] p-2.5 text-[12px] font-bold text-[#7A3FD0] shadow-sm dark:border-[#B98BFF]/30 dark:bg-[#2A1F52] dark:text-[#B98BFF]">
            <div
              className="absolute left-0 top-0 h-1 bg-[#7A3FD0] transition-all duration-1000 ease-linear dark:bg-[#B98BFF]"
              style={{ width: `${progressPct}%` }}
            />

            <div className="flex items-center justify-between pt-0.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7A3FD0] opacity-75 dark:bg-[#B98BFF]"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#7A3FD0] dark:bg-[#B98BFF]"></span>
                </span>
                <span>Navigating in {countdownText}...</span>
              </div>
              
              <button
                type="button"
                onClick={cancelRedirect}
                className="text-[11px] underline hover:text-[#1B1436] dark:hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Success Redirect Toast */}
        {redirected && (
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={16} />
            <span>Navigating to {destinationUrl}...</span>
          </div>
        )}

        {/* Manual Fallback Action Button */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={navigateNow}
            onKeyDown={handleCardKeyDown}
            aria-label={`Go to ${destinationUrl}`}
            title={`Navigate to ${destinationUrl}`}
            className="flex items-center gap-1.5 rounded-xl border-[2px] border-[#1B1436] bg-[#7A3FD0] px-4 py-2 text-[12.5px] font-bold text-white shadow-[2px_2px_0_#1B1436] transition-transform hover:-translate-y-[1px] active:translate-y-[1px] dark:border-[#4A3D7A] dark:shadow-[2px_2px_0_#3A2064]"
          >
            <span>Go there</span>
            {resolvedPath?.isExternal ? <ExternalLink size={14} /> : <ArrowRight size={14} />}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ChatMessage;
