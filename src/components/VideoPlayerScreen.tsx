import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Subtitles,
  Settings,
  Activity,
  Sliders,
  Sparkles,
  Check
} from 'lucide-react';
import { Movie } from '../types';

interface VideoPlayerScreenProps {
  movie: Movie;
  onBack: () => void;
  onUpdateProgress?: (movieId: string, progress: number) => void;
}

export const VideoPlayerScreen: React.FC<VideoPlayerScreenProps> = ({
  movie,
  onBack,
  onUpdateProgress,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(1452); // ~24:12 default start
  const [duration, setDuration] = useState(movie.durationSeconds || 5400);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState<'4K' | '1080p' | '720p' | 'Auto'>('Auto');
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>('English');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showSubtitlesMenu, setShowSubtitlesMenu] = useState(false);
  const [showTelemetry, setShowTelemetry] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) {
      const remainingMins = mins % 60;
      return `${hrs}:${remainingMins < 10 ? '0' : ''}${remainingMins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
    }
    return `${mins < 10 ? '0' : ''}${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // Reset idle timer to show/hide controls
  const handleUserActivity = () => {
    setShowControls(true);
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    if (isPlaying) {
      idleTimerRef.current = setTimeout(() => {
        if (!showSettingsMenu && !showSubtitlesMenu && !showTelemetry) {
          setShowControls(false);
        }
      }, 3500);
    }
  };

  useEffect(() => {
    handleUserActivity();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isPlaying, showSettingsMenu, showSubtitlesMenu, showTelemetry]);

  // Video element sync
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    handleUserActivity();
  };

  const handleSeek = (newSeconds: number) => {
    const clamped = Math.max(0, Math.min(duration, newSeconds));
    setCurrentTime(clamped);
    if (videoRef.current) {
      videoRef.current.currentTime = clamped;
    }
    if (onUpdateProgress) {
      onUpdateProgress(movie.id, Math.round((clamped / duration) * 100));
    }
  };

  const handleSeekRelative = (delta: number) => {
    handleSeek(currentTime + delta);
    handleUserActivity();
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Telemetry real-time stats simulator
  const bufferPercent = Math.min(100, Math.round(((currentTime + 600) / duration) * 100));
  const playedPercent = Math.min(100, (currentTime / duration) * 100);
  const remainingSecs = Math.max(0, duration - currentTime);

  return (
    <div
      ref={containerRef}
      id="video-player-container"
      onMouseMove={handleUserActivity}
      onTouchStart={handleUserActivity}
      className="fixed inset-0 z-50 bg-black text-[#e3e2e2] flex items-center justify-center overflow-hidden select-none font-sans"
    >
      {/* Video Stream Element */}
      <video
        ref={videoRef}
        src={movie.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'}
        poster={movie.backdropUrl}
        loop
        playsInline
        autoPlay
        muted={isMuted}
        onTimeUpdate={() => {
          if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
              setDuration(videoRef.current.duration);
            }
          }
        }}
        onClick={togglePlayPause}
        className="w-full h-full object-contain md:object-cover cursor-pointer"
      />

      {/* Fallback Ambient Backdrop if Video is loading or poster frame */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none -z-10 opacity-30 blur-2xl"
        style={{ backgroundImage: `url(${movie.backdropUrl})` }}
      />

      {/* Overlay Gradients */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black/95 via-black/60 to-transparent"></div>
      </div>

      {/* UI Overlay Controls */}
      <div
        className={`absolute inset-0 flex flex-col justify-between p-4 md:p-8 transition-opacity duration-300 ${
          showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between w-full">
          <button
            id="btn-player-back"
            onClick={onBack}
            className="w-11 h-11 rounded-full bg-[#1e2020]/80 backdrop-blur-md flex items-center justify-center text-white hover:text-[#ffb4aa] hover:bg-[#292a2b] transition-all border border-white/10 active:scale-95 cursor-pointer shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Title and Episode Info */}
          <div className="text-center px-4">
            <h2 className="font-display font-bold text-base md:text-xl text-white drop-shadow-md">
              {movie.title}
            </h2>
            <p className="text-xs md:text-sm text-[#ffb4aa] font-medium opacity-90">
              {movie.episodeInfo || movie.tagline || 'Now Streaming in 4K HDR'}
            </p>
          </div>

          {/* Right Top Status / Telemetry Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTelemetry(!showTelemetry)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border flex items-center gap-1.5 transition-colors cursor-pointer ${
                showTelemetry
                  ? 'bg-[#c0342c] border-[#ffb4aa] text-white'
                  : 'bg-[#1e2020]/70 border-white/15 text-white/70 hover:text-white hover:bg-[#292a2b]'
              }`}
              title="Toggle Live QoE Telemetry & CDN Stats"
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">QoE Telemetry</span>
            </button>
          </div>
        </div>

        {/* Center Playback Controls (Rewind 10s, Big Play/Pause, Forward 10s) */}
        <div className="flex items-center justify-center gap-8 md:gap-12 w-full my-auto">
          {/* Rewind 10s */}
          <button
            id="btn-rewind-10"
            onClick={() => handleSeekRelative(-10)}
            className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#1e2020]/60 backdrop-blur-md text-white/90 hover:text-white hover:bg-[#292a2b] flex items-center justify-center transition-all active:scale-90 shadow-xl border border-white/10"
            title="Rewind 10s"
          >
            <RotateCcw className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Big Play/Pause button */}
          <button
            id="btn-main-play-pause"
            onClick={togglePlayPause}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#c0342c] hover:bg-[#d44339] text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(192,52,44,0.6)] cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-10 h-10 md:w-12 md:h-12 fill-white" />
            ) : (
              <Play className="w-10 h-10 md:w-12 md:h-12 fill-white ml-1.5" />
            )}
          </button>

          {/* Forward 10s */}
          <button
            id="btn-forward-10"
            onClick={() => handleSeekRelative(10)}
            className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#1e2020]/60 backdrop-blur-md text-white/90 hover:text-white hover:bg-[#292a2b] flex items-center justify-center transition-all active:scale-90 shadow-xl border border-white/10"
            title="Fast Forward 10s"
          >
            <RotateCw className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>

        {/* Live QoE Telemetry Overlay Modal (if open) */}
        {showTelemetry && (
          <div className="absolute top-20 right-4 md:right-8 bg-[#1e2020]/95 backdrop-blur-xl border border-white/15 p-4 rounded-2xl shadow-2xl max-w-xs text-xs space-y-2 z-40 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#ffb4aa]" /> Streaming Telemetry
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                Optimal
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-white/70">
              <div>
                <p className="text-[10px] text-white/40">Protocol</p>
                <p className="font-mono text-white">HLS / CMAF ABR</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40">Rendition</p>
                <p className="font-mono text-[#ffb4aa]">
                  {selectedQuality === 'Auto' ? '4K UHD (2160p)' : selectedQuality}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-white/40">Bitrate</p>
                <p className="font-mono text-white">18.4 Mbps (VBR)</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40">Codec</p>
                <p className="font-mono text-white">HEVC / H.265</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40">Audio Track</p>
                <p className="font-mono text-white">Dolby Atmos (E-AC3)</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40">Buffer Health</p>
                <p className="font-mono text-emerald-400">42.8s buffered</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40">Rebuffer Ratio</p>
                <p className="font-mono text-emerald-400">0.00% (SLO Pass)</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40">CDN Pop</p>
                <p className="font-mono text-white">Edge-Sin1 (99.8% hit)</p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Bar: Timeline Progress & Controls */}
        <div className="flex flex-col w-full gap-3 bg-gradient-to-t from-black/80 to-transparent pt-4">
          {/* Progress Timeline Track */}
          <div className="flex items-center gap-3 w-full">
            <span className="text-xs md:text-sm font-mono text-white/80 tabular-nums w-12 text-right">
              {formatTime(currentTime)}
            </span>

            {/* Seek Bar */}
            <div
              id="player-seekbar"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                handleSeek(ratio * duration);
              }}
              className="relative flex-1 h-2.5 bg-[#333535] rounded-full cursor-pointer overflow-visible flex items-center group/track"
            >
              {/* Buffered Track */}
              <div
                className="absolute left-0 h-full bg-white/20 rounded-full transition-all"
                style={{ width: `${bufferPercent}%` }}
              ></div>

              {/* Played Track */}
              <div
                className="absolute left-0 h-full bg-[#c0342c] rounded-full flex justify-end items-center shadow-[0_0_12px_rgba(192,52,44,0.8)]"
                style={{ width: `${playedPercent}%` }}
              >
                {/* Glowing Thumb */}
                <div className="w-4 h-4 bg-[#ffb4aa] rounded-full translate-x-1/2 shadow-[0_0_10px_#ffb4aa] scale-75 group-hover/track:scale-125 transition-transform"></div>
              </div>
            </div>

            <span className="text-xs md:text-sm font-mono text-white/80 tabular-nums w-14">
              -{formatTime(remainingSecs)}
            </span>
          </div>

          {/* Bottom Tools Row */}
          <div className="flex items-center justify-between w-full">
            {/* Left: Volume Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  setIsMuted(val === 0);
                  if (videoRef.current) {
                    videoRef.current.volume = val;
                    videoRef.current.muted = val === 0;
                  }
                }}
                className="w-20 md:w-28 accent-[#ffb4aa] h-1.5 bg-white/20 rounded-lg cursor-pointer"
              />
            </div>

            {/* Right: Subtitles, Quality Settings, Fullscreen */}
            <div className="flex items-center gap-2 relative">
              {/* Subtitles CC Button */}
              <div className="relative">
                <button
                  id="btn-player-subtitles"
                  onClick={() => {
                    setShowSubtitlesMenu(!showSubtitlesMenu);
                    setShowSettingsMenu(false);
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    showSubtitlesMenu || selectedSubtitle !== 'Off'
                      ? 'text-[#ffb4aa] bg-white/10'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  title="Subtitles & Captions"
                >
                  <Subtitles className="w-5 h-5" />
                </button>

                {showSubtitlesMenu && (
                  <div className="absolute bottom-12 right-0 bg-[#1e2020] border border-white/15 rounded-xl shadow-2xl p-2 w-48 z-50 text-xs space-y-1">
                    <p className="px-3 py-1 text-white/40 font-bold uppercase text-[10px]">
                      Audio & Subtitles
                    </p>
                    {['Off', 'English', 'Spanish', 'French', 'Japanese'].map((sub) => (
                      <button
                        key={sub}
                        onClick={() => {
                          setSelectedSubtitle(sub);
                          setShowSubtitlesMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left transition-colors ${
                          selectedSubtitle === sub
                            ? 'bg-[#c0342c] text-white font-semibold'
                            : 'text-white/70 hover:bg-white/10'
                        }`}
                      >
                        <span>{sub}</span>
                        {selectedSubtitle === sub && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quality & Playback Speed Settings Button */}
              <div className="relative">
                <button
                  id="btn-player-settings"
                  onClick={() => {
                    setShowSettingsMenu(!showSettingsMenu);
                    setShowSubtitlesMenu(false);
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    showSettingsMenu
                      ? 'text-[#ffb4aa] bg-white/10'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  title="Stream Quality & Speed"
                >
                  <Settings className="w-5 h-5" />
                </button>

                {showSettingsMenu && (
                  <div className="absolute bottom-12 right-0 bg-[#1e2020] border border-white/15 rounded-xl shadow-2xl p-3 w-56 z-50 text-xs space-y-3">
                    <div>
                      <p className="px-1 text-white/40 font-bold uppercase text-[10px] mb-1">
                        Resolution (HLS ABR)
                      </p>
                      {(['Auto', '4K', '1080p', '720p'] as const).map((q) => (
                        <button
                          key={q}
                          onClick={() => {
                            setSelectedQuality(q);
                            setShowSettingsMenu(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                            selectedQuality === q
                              ? 'bg-[#c0342c] text-white font-semibold'
                              : 'text-white/70 hover:bg-white/10'
                          }`}
                        >
                          <span>{q === 'Auto' ? 'Auto (1080p - 4K)' : `${q} Ultra HD`}</span>
                          {selectedQuality === q && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>

                    <hr className="border-white/10" />

                    <div>
                      <p className="px-1 text-white/40 font-bold uppercase text-[10px] mb-1">
                        Playback Speed
                      </p>
                      <div className="grid grid-cols-4 gap-1">
                        {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                          <button
                            key={speed}
                            onClick={() => {
                              setPlaybackSpeed(speed);
                              if (videoRef.current) videoRef.current.playbackRate = speed;
                              setShowSettingsMenu(false);
                            }}
                            className={`py-1 rounded text-center font-mono ${
                              playbackSpeed === speed
                                ? 'bg-[#ffb4aa] text-black font-bold'
                                : 'bg-white/5 text-white/70 hover:bg-white/15'
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Fullscreen toggle */}
              <button
                id="btn-player-fullscreen"
                onClick={toggleFullscreen}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
