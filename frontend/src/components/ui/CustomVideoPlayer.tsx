import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, RotateCw, Gauge } from 'lucide-react';

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
  /**
   * Preload strategy. Default 'metadata' keeps the initial page light and lets
   * playback start fast while the rest streams in progressively (faststart MP4s).
   */
  preload?: 'none' | 'metadata' | 'auto';
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

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

/**
 * Themed video player with custom (non-native) controls so module lectures match
 * the app aesthetic. Drop-in replacement for the old `<video controls>` blocks.
 *
 * Smoothness: streams progressively (preload="metadata"), surfaces a buffering
 * spinner + a "loaded" bar so a network stall reads as buffering instead of a
 * frozen frame, and supports draggable scrubbing + playback speed.
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
      preload = 'metadata',
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
    const seekRef = useRef<HTMLDivElement>(null);
    const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [playing, setPlaying] = useState(false);
    const [current, setCurrent] = useState(0);
    const [duration, setDuration] = useState(0);
    const [muted, setMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [controlsVisible, setControlsVisible] = useState(true);
    const [buffering, setBuffering] = useState(false);
    const [buffered, setBuffered] = useState(0);
    const [rate, setRate] = useState(1);
    const [showRate, setShowRate] = useState(false);
    const [dragging, setDragging] = useState(false);

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

    // Track how much is downloaded so the seek bar shows a "loaded" region and
    // the user can see buffering progress rather than a frozen frame.
    const updateBuffered = useCallback(() => {
      const v = videoRef.current;
      if (!v || !v.duration || !v.buffered.length) return;
      let end = 0;
      for (let i = 0; i < v.buffered.length; i++) {
        const s = v.buffered.start(i);
        const e = v.buffered.end(i);
        if (s <= v.currentTime && v.currentTime <= e) { end = e; break; }
        end = Math.max(end, e);
      }
      setBuffered(end / v.duration);
    }, []);

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

    const changeRate = useCallback((r: number) => {
      const v = videoRef.current;
      if (v) v.playbackRate = r;
      setRate(r);
      setShowRate(false);
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

    // Seek from a pointer x-position over the seek track (click + drag scrub).
    const seekFromClientX = useCallback((clientX: number) => {
      const el = seekRef.current;
      const v = videoRef.current;
      if (!el || !v || !duration) return;
      const rect = el.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      v.currentTime = ratio * duration;
      setCurrent(ratio * duration);
    }, [duration]);

    const onSeekPointerDown = (e: React.PointerEvent) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      setDragging(true);
      seekFromClientX(e.clientX);
    };
    const onSeekPointerMove = (e: React.PointerEvent) => {
      if (!dragging) return;
      seekFromClientX(e.clientX);
    };
    const endSeekDrag = (e: React.PointerEvent) => {
      if (!dragging) return;
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
      setDragging(false);
    };

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
    const bufferedPct = Math.min(100, Math.max(progressPct, buffered * 100));

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
          preload={preload}
          playsInline
          className="w-full h-full block bg-black"
          onClick={togglePlay}
          onPlay={() => { setPlaying(true); nudgeControls(); onPlay?.(); }}
          onPause={() => { setPlaying(false); setControlsVisible(true); onPause?.(); }}
          onEnded={() => { setPlaying(false); setControlsVisible(true); onEnded?.(); }}
          onWaiting={() => setBuffering(true)}
          onStalled={() => setBuffering(true)}
          onPlaying={() => setBuffering(false)}
          onCanPlay={() => setBuffering(false)}
          onSeeking={() => setBuffering(true)}
          onSeeked={() => setBuffering(false)}
          onProgress={updateBuffered}
          onRateChange={() => setRate(videoRef.current?.playbackRate ?? 1)}
          onTimeUpdate={() => {
            const t = videoRef.current?.currentTime ?? 0;
            setCurrent(t);
            updateBuffered();
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

        {/* Buffering spinner - shown when the stream stalls mid-playback */}
        {buffering && playing && !dragging && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="h-12 w-12 rounded-full border-2 animate-spin"
              style={{ borderColor: 'rgba(255,255,255,0.18)', borderTopColor: accent }}
            />
          </div>
        )}

        {/* Center play / replay overlay */}
        {!playing && !buffering && (
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
          {/* Seek bar (buffered + progress + draggable thumb) */}
          <div className="flex items-center gap-3 mb-2">
            <div
              ref={seekRef}
              role="slider"
              tabIndex={0}
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={Math.floor(duration) || 0}
              aria-valuenow={Math.floor(current)}
              aria-valuetext={`${fmt(current)} of ${fmt(duration)}`}
              className="relative flex-1 h-1.5 rounded-full bg-white/15 cursor-pointer group/seek touch-none"
              onPointerDown={onSeekPointerDown}
              onPointerMove={onSeekPointerMove}
              onPointerUp={endSeekDrag}
              onPointerCancel={endSeekDrag}
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
            >
              {/* buffered / loaded region */}
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-white/30"
                style={{ width: `${bufferedPct}%` }}
              />
              {/* played region */}
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${progressPct}%`, background: accent }}
              />
              {/* scrub thumb */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full transition-opacity ${
                  dragging ? 'opacity-100' : 'opacity-0 group-hover/seek:opacity-100'
                }`}
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

            {/* Playback speed */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRate((s) => !s)}
                aria-label="Playback speed"
                className="flex items-center gap-1 font-mono text-[11px] tabular-nums hover:text-white/80"
                style={{ color: rate !== 1 ? accent : undefined }}
              >
                <Gauge size={16} /> {rate}×
              </button>
              {showRate && (
                <div
                  className="absolute bottom-full right-0 mb-2 flex flex-col rounded-lg border-2 border-edge bg-bg-elev p-1 shadow-brutal-sm"
                  onMouseLeave={() => setShowRate(false)}
                >
                  {SPEEDS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => changeRate(s)}
                      className="rounded px-3 py-1 text-left font-mono text-[11px] tabular-nums hover:bg-white/10"
                      style={{ color: s === rate ? accent : 'rgba(255,255,255,0.8)' }}
                    >
                      {s}×
                    </button>
                  ))}
                </div>
              )}
            </div>

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
