import React from 'react';
import { Compass, ExternalLink, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  useChatNavigation,
  parseNavigationPayload,
  NavigationPayload,
  UseChatNavigationOptions,
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

  // Render User or Standard Assistant Text Response
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

  // Render Navigation Action Card
  return (
    <div className="my-2 flex justify-start">
      <div className="w-[88%] space-y-2.5 rounded-2xl border-[2.5px] border-[#1B1436] bg-white p-4 shadow-[4px_4px_0_#1B1436] dark:border-[#4A3D7A] dark:bg-[#1B1540] dark:shadow-[4px_4px_0_#7A3FD0]">
        
        {/* Header & Target Route Message */}
        <div className="flex items-start gap-2.5 font-bold text-[#1B1436] dark:text-white">
          <Compass size={20} className="mt-0.5 flex-shrink-0 text-[#7A3FD0] dark:text-[#B98BFF]" />
          <div>
            <div className="text-[14px] leading-snug">
              {navPayload.message || `Taking you to ${navPayload.path}...`}
            </div>
            <div className="mt-0.5 font-mono text-[11px] text-[#6B5E86] dark:text-[#8E80B4]">
              Target: <span className="underline">{navPayload.path}</span>
            </div>
          </div>
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
            <span>Low confidence match — auto-navigation disabled. Click below to proceed.</span>
          </div>
        )}

        {/* Live Countdown Toast Indicator */}
        {isAutoNavigating && (
          <div className="flex items-center justify-between rounded-xl bg-[#F1ECFF] px-3 py-2 text-[12px] font-bold text-[#7A3FD0] dark:bg-[#2A1F52] dark:text-[#B98BFF]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7A3FD0] opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#7A3FD0]"></span>
              </span>
              <span>Redirecting automatically in {countdown}s...</span>
            </div>
            <button
              type="button"
              onClick={cancelRedirect}
              className="text-[11px] underline hover:text-[#1B1436] dark:hover:text-white"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Success Redirect Toast */}
        {redirected && (
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={16} />
            <span>Navigating now...</span>
          </div>
        )}

        {/* Manual Fallback Action Button */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={navigateNow}
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
