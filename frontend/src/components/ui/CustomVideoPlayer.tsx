import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, RotateCw } from 'lucide-react';

export interface VideoPlayerHandle {
  seek: (t: number) => void;
  play: () => void;
  pause: () => void;
  getCurrentTime: () => number;
}

interface CustomVideoPlayerProps {
  src: string;
  /** Theme accent (hex). Each module passes its own - cyan/amber/orange. */
  accent?: string;
  poster?: string;
  /** Optional WebVTT captions track (WCAG 1.2.2 for lecture content). */
  captionsSrc?: string;
  /** BCP-47 language for the captions track. */
  captionsLang?: string;
  className?: string;
  /** Optional element rendered top-left over the video (e.g. a chapter badge). */
  topBadge?: React.ReactNode;
  onTimeUpdate?: (t: number) => void;
  onLoadedMetadata?: (duration: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

const fmt = (s: number) => {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

/**
 * Themed video player with custom (non-native) controls so module lectures match
 * the app aesthetic. Drop-in replacement for the old `<video controls>` blocks.
 *
 * Exposes an imperative handle (seek/play/pause/getCurrentTime) so chapter +
 * transcript scenes can keep their click-to-seek behavior.
 */
export const CustomVideoPlayer = forwardRef<VideoPlayerHandle, CustomVideoPlayerProps>(
  (
    {
      src,
      accent = '#22d3ee',
      poster,
      captionsSrc,
      captionsLang = 'en',
      className = '',
      topBadge,
      onTimeUpdate,
      onLoadedMetadata,
      onPlay,
      onPause,
      onEnded,
    },
    ref,
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [playing, setPlaying] = useState(false);
    const [current, setCurrent] = useState(0);
    const [duration, setDuration] = useState(0);
    const [muted, setMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [controlsVisible, setControlsVisible] = useState(true);

    useImperativeHandle(
      ref,
      () => ({
        seek: (t: number) => {
          const v = videoRef.current;
          if (!v) return;
          v.currentTime = t;
          v.play().catch(() => {});
        },
        play: () => videoRef.current?.play().catch(() => {}),
        pause: () => videoRef.current?.pause(),
        getCurrentTime: () => videoRef.current?.currentTime ?? 0,
      }),
      [],
    );

    const togglePlay = useCallback(() => {
      const v = videoRef.current;
      if (!v) return;
      if (v.paused) v.play().catch(() => {});
      else v.pause();
    }, []);

    const skip = useCallback((delta: number) => {
      const v = videoRef.current;
      if (!v) return;
      v.currentTime = Math.min(Math.max(0, v.currentTime + delta), v.duration || 0);
    }, []);

    const toggleMute = useCallback(() => {
      const v = videoRef.current;
      if (!v) return;
      v.muted = !v.muted;
      setMuted(v.muted);
    }, []);

    const toggleFullscreen = useCallback(() => {
      const el = wrapRef.current;
      const v = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      } else if (el?.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if (v?.webkitEnterFullscreen) {
        // iOS Safari: only the video element supports fullscreen.
        v.webkitEnterFullscreen();
      }
    }, []);

    // Auto-hide controls while playing + idle.
    const nudgeControls = useCallback(() => {
      setControlsVisible(true);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        if (!videoRef.current?.paused) setControlsVisible(false);
      }, 2500);
    }, []);

    useEffect(() => () => { if (idleTimer.current) clearTimeout(idleTimer.current); }, []);

    // Keyboard controls when the player (or a child) is focused.
    const onKeyDown = (e: React.KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skip(-5);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skip(5);
          break;
        case 'm':
          toggleMute();
          break;
        case 'f':
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    const progressPct = duration > 0 ? (current / duration) * 100 : 0;

    return (
      <div
        ref={wrapRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseMove={nudgeControls}
        onMouseLeave={() => { if (!videoRef.current?.paused) setControlsVisible(false); }}
        className={`relative group rounded-3xl overflow-hidden border bg-black aspect-video outline-none focus-visible:ring-2 ${className}`}
        style={{ borderColor: `${accent}33`, boxShadow: `0 0 0 1px ${accent}10` }}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          playsInline
          className="w-full h-full block bg-black"
          onClick={togglePlay}
          onPlay={() => { setPlaying(true); nudgeControls(); onPlay?.(); }}
          onPause={() => { setPlaying(false); setControlsVisible(true); onPause?.(); }}
          onEnded={() => { setPlaying(false); setControlsVisible(true); onEnded?.(); }}
          onTimeUpdate={() => {
            const t = videoRef.current?.currentTime ?? 0;
            setCurrent(t);
            onTimeUpdate?.(t);
          }}
          onLoadedMetadata={() => {
            const d = videoRef.current?.duration ?? 0;
            setDuration(d);
            onLoadedMetadata?.(d);
          }}
          onVolumeChange={() => {
            const v = videoRef.current;
            if (!v) return;
            setMuted(v.muted);
            setVolume(v.volume);
          }}
        >
          {captionsSrc && (
            <track kind="captions" src={captionsSrc} srcLang={captionsLang} label="Captions" default />
          )}
        </video>

        {topBadge && <div className="absolute top-4 left-4 z-10 pointer-events-none">{topBadge}</div>}

        {/* Center play / replay overlay */}
        {!playing && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label="Play"
            className="absolute inset-0 m-auto h-16 w-16 rounded-full flex items-center justify-center text-black transition-transform hover:scale-105"
            style={{ background: `${accent}EE`, boxShadow: `0 8px 32px ${accent}55` }}
          >
            {duration > 0 && current >= duration ? <RotateCcw size={26} /> : <Play size={26} className="ml-0.5" />}
          </button>
        )}

        {/* Control bar */}
        <div
          className={`absolute inset-x-0 bottom-0 px-4 pt-10 pb-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent transition-opacity duration-300 ${
            controlsVisible || !playing ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Seek bar */}
          <div className="flex items-center gap-3 mb-2">
            <div
              role="slider"
              tabIndex={0}
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={Math.floor(duration) || 0}
              aria-valuenow={Math.floor(current)}
              aria-valuetext={`${fmt(current)} of ${fmt(duration)}`}
              className="relative flex-1 h-1.5 rounded-full bg-white/15 cursor-pointer group/seek"
              onKeyDown={(e) => {
                // Self-contained seek so the slider works when focused; stop the
                // event reaching the container's global key handler (avoids double skip).
                const v = videoRef.current;
                if (!v || !duration) return;
                let handled = true;
                switch (e.key) {
                  case 'ArrowLeft': case 'ArrowDown': v.currentTime = Math.max(0, v.currentTime - 5); break;
                  case 'ArrowRight': case 'ArrowUp': v.currentTime = Math.min(duration, v.currentTime + 5); break;
                  case 'Home': v.currentTime = 0; break;
                  case 'End': v.currentTime = duration; break;
                  default: handled = false;
                }
                if (handled) { e.preventDefault(); e.stopPropagation(); }
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = (e.clientX - rect.left) / rect.width;
                if (videoRef.current && duration) videoRef.current.currentTime = ratio * duration;
              }}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${progressPct}%`, background: accent }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full opacity-0 group-hover/seek:opacity-100 transition-opacity"
                style={{ left: `calc(${progressPct}% - 6px)`, background: accent, boxShadow: `0 0 8px ${accent}` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 text-white">
            <button type="button" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'} className="hover:text-white/80">
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button type="button" onClick={() => skip(-10)} aria-label="Back 10 seconds" className="hover:text-white/80">
              <RotateCcw size={16} />
            </button>
            <button type="button" onClick={() => skip(10)} aria-label="Forward 10 seconds" className="hover:text-white/80">
              <RotateCw size={16} />
            </button>

            <span className="font-mono text-[11px] tabular-nums text-white/80">
              {fmt(current)} <span className="text-white/30">/</span> {fmt(duration)}
            </span>

            <div className="flex-1" />

            <div className="flex items-center gap-2 group/vol">
              <button type="button" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'} className="hover:text-white/80">
                {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={(e) => {
                  const x = +e.target.value;
                  const v = videoRef.current;
                  if (v) { v.volume = x; v.muted = x === 0; }
                }}
                aria-label="Volume"
                className="w-0 group-hover/vol:w-16 transition-all duration-200 h-1 cursor-pointer"
                style={{ accentColor: accent }}
              />
            </div>

            <button type="button" onClick={toggleFullscreen} aria-label="Fullscreen" className="hover:text-white/80">
              <Maximize size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  },
);

CustomVideoPlayer.displayName = 'CustomVideoPlayer';
