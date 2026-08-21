import React, { useState } from 'react';
import { Play, Plus, Check, Star, Info, Volume2, VolumeX, Sparkles, ChevronRight } from 'lucide-react';
import { Movie } from '../types';

interface HomeScreenProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onPlayMovie: (movie: Movie) => void;
  watchlist: string[];
  onToggleWatchlist: (movieId: string) => void;
  onNavigate: (tab: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  movies,
  onSelectMovie,
  onPlayMovie,
  watchlist,
  onToggleWatchlist,
  onNavigate,
}) => {
  const [heroMuted, setHeroMuted] = useState(true);

  // Featured Hero movie
  const heroMovie = movies.find((m) => m.id === 'interstellar-voyage') || movies[0];
  const continueWatching = movies.filter((m) => m.continueProgress !== undefined);
  const trendingMovies = movies.filter((m) => m.rankBadge || m.rating >= 4.7);
  const sciFiMovies = movies.filter((m) => m.genre.includes('Sci-Fi'));
  const actionMovies = movies.filter((m) => m.genre.includes('Action'));

  const isHeroInWatchlist = watchlist.includes(heroMovie.id);

  return (
    <div className="min-h-screen pb-24 md:pb-16 animate-in fade-in duration-300">
      {/* Hero Section */}
      <section className="relative w-full h-[540px] md:h-[660px] lg:h-[720px] mb-8 md:mb-12">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121414] via-[#121414]/40 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#121414] via-[#121414]/30 to-transparent z-10 md:w-2/3"></div>
          
          <img
            src={heroMovie.backdropUrl}
            alt={heroMovie.title}
            className="w-full h-full object-cover object-top scale-100 hover:scale-105 transition-transform duration-1000 ease-out"
          />
        </div>

        {/* Hero Content Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 lg:p-12 z-20 flex flex-col justify-end max-w-4xl">
          {/* Format Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {heroMovie.badges.map((badge, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded text-[11px] font-bold border border-white/20 bg-black/40 backdrop-blur-md text-[#e3e2e2] uppercase tracking-wider"
              >
                {badge}
              </span>
            ))}
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#c0342c]/80 text-white uppercase">
              ★ {heroMovie.rating}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-[1.08] mb-3 text-shadow-lg drop-shadow-md">
            {heroMovie.title}
          </h1>

          {/* Synopsis */}
          <p className="font-sans text-sm sm:text-base md:text-lg text-[#e2beba] max-w-2xl mb-6 line-clamp-2 md:line-clamp-3 leading-relaxed drop-shadow">
            {heroMovie.synopsis}
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              id="hero-play-button"
              onClick={() => onPlayMovie(heroMovie)}
              className="accent-amber hover:opacity-95 active:scale-95 transition-all duration-200 h-12 px-8 rounded-full flex items-center justify-center gap-2.5 font-bold text-base shadow-[0_4px_20px_rgba(245,158,11,0.5)] cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Play</span>
            </button>

            <button
              id="hero-watchlist-button"
              onClick={() => onToggleWatchlist(heroMovie.id)}
              className={`h-12 px-6 rounded-full flex items-center justify-center gap-2 font-semibold text-sm md:text-base backdrop-blur-xl border transition-all duration-200 cursor-pointer active:scale-95 ${
                isHeroInWatchlist
                  ? 'bg-white/20 border-[#ffb4aa] text-[#ffb4aa]'
                  : 'bg-[#292a2b]/80 border-white/15 text-white hover:bg-[#333535]'
              }`}
            >
              {isHeroInWatchlist ? (
                <>
                  <Check className="w-5 h-5 text-[#ffb4aa]" />
                  <span>In Watchlist</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Watchlist</span>
                </>
              )}
            </button>

            <button
              id="hero-info-button"
              onClick={() => onSelectMovie(heroMovie)}
              className="h-12 px-5 rounded-full flex items-center justify-center gap-2 font-semibold text-sm bg-black/40 hover:bg-black/60 border border-white/10 text-white/90 backdrop-blur-md transition-all active:scale-95"
            >
              <Info className="w-4 h-4" />
              <span>Details</span>
            </button>
          </div>
        </div>
      </section>

      <div className="space-y-10 md:space-y-12">
        {/* Continue Watching Row */}
        {continueWatching.length > 0 && (
          <section className="pl-4 md:pl-8">
            <div className="flex items-center justify-between pr-4 md:pr-8 mb-4">
              <h2 className="font-display font-bold text-xl md:text-2xl text-white tracking-tight">
                Continue Watching
              </h2>
              <button
                onClick={() => onNavigate('watchlist')}
                className="text-xs font-semibold text-[#ffb4aa] hover:underline flex items-center gap-1"
              >
                <span>View History</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto hide-scrollbar pr-4 md:pr-8 snap-x pb-2">
              {continueWatching.map((movie) => (
                <div
                  key={movie.id}
                  id={`continue-card-${movie.id}`}
                  onClick={() => onPlayMovie(movie)}
                  className="snap-start shrink-0 w-64 md:w-80 group cursor-pointer"
                >
                  <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-2 bg-[#1e2020] border border-white/10 transition-transform duration-300 group-hover:scale-[1.02] shadow-md">
                    <img
                      src={movie.backdropUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/25 group-hover:bg-transparent transition-colors duration-300"></div>

                    {/* Hover Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 rounded-full bg-[#1e2020]/90 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-xl scale-95 group-hover:scale-100 transition-transform">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Progress Bar with Glowing Dot */}
                    <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#333535]">
                      <div
                        className="h-full bg-[#c0342c] relative"
                        style={{ width: `${movie.continueProgress || 50}%` }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#ffb4aa] shadow-[0_0_8px_#c0342c]"></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-2 px-0.5">
                    <div className="overflow-hidden">
                      <h3 className="font-semibold text-sm md:text-base text-white truncate group-hover:text-[#ffb4aa] transition-colors">
                        {movie.title}
                      </h3>
                      <p className="text-xs text-[#e3e2e2]/60 truncate">
                        {movie.episodeInfo || movie.continueTimeFormatted || `${movie.duration} left`}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMovie(movie);
                      }}
                      className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10"
                      title="View Details"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trending Now Row (Vertical 2:3 Posters) */}
        <section className="pl-4 md:pl-8">
          <div className="flex items-center justify-between pr-4 md:pr-8 mb-4">
            <h2 className="font-display font-bold text-xl md:text-2xl text-white tracking-tight flex items-center gap-2">
              <span>Trending Now</span>
              <Sparkles className="w-5 h-5 text-[#f59e0b]" />
            </h2>
            <button
              onClick={() => onNavigate('search')}
              className="text-xs font-semibold text-[#ffb4aa] hover:underline flex items-center gap-1"
            >
              <span>Explore All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto hide-scrollbar pr-4 md:pr-8 snap-x pb-3">
            {trendingMovies.map((movie) => (
              <div
                key={movie.id}
                id={`trending-card-${movie.id}`}
                onClick={() => onSelectMovie(movie)}
                className="snap-start shrink-0 w-[140px] sm:w-[160px] md:w-[190px] group cursor-pointer"
              >
                <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#1e2020] border border-white/10 transition-all duration-300 group-hover:scale-105 group-hover:z-10 group-hover:border-[#ffb4aa]/40 shadow-xl">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Badge Pill in corner */}
                  {movie.rankBadge && (
                    <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-[#c0342c] text-[10px] font-extrabold text-white shadow-md uppercase tracking-wider">
                      {movie.rankBadge}
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <span className="text-xs font-bold text-[#ffb4aa] mb-0.5">
                      {movie.matchScore}% Match
                    </span>
                    <span className="text-sm font-bold text-white line-clamp-1">
                      {movie.title}
                    </span>
                    <span className="text-[11px] text-white/70">
                      {movie.genre.slice(0, 2).join(' • ')}
                    </span>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlayMovie(movie);
                        }}
                        className="w-8 h-8 rounded-full bg-[#f59e0b] text-[#1e293b] flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                      >
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(movie.id);
                        }}
                        className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        {watchlist.includes(movie.id) ? (
                          <Check className="w-4 h-4 text-[#ffb4aa]" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <h3 className="mt-2 font-semibold text-xs md:text-sm text-[#e3e2e2] truncate group-hover:text-[#ffb4aa] transition-colors">
                  {movie.title}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Sci-Fi & Cyberpunk Spotlights */}
        <section className="pl-4 md:pl-8">
          <div className="flex items-center justify-between pr-4 md:pr-8 mb-4">
            <h2 className="font-display font-bold text-xl md:text-2xl text-white tracking-tight">
              Sci-Fi & Cyberpunk Sagas
            </h2>
            <button
              onClick={() => onNavigate('search')}
              className="text-xs font-semibold text-[#ffb4aa] hover:underline"
            >
              See More
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto hide-scrollbar pr-4 md:pr-8 snap-x pb-3">
            {sciFiMovies.map((movie) => (
              <div
                key={movie.id}
                id={`scifi-card-${movie.id}`}
                onClick={() => onSelectMovie(movie)}
                className="snap-start shrink-0 w-[140px] sm:w-[160px] md:w-[190px] group cursor-pointer"
              >
                <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#1e2020] border border-white/10 transition-all duration-300 group-hover:scale-105 group-hover:border-[#ffb4aa]/40 shadow-xl">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <span className="text-xs font-bold text-[#ffb4aa]">
                      {movie.year} • {movie.duration}
                    </span>
                    <span className="text-sm font-bold text-white truncate">
                      {movie.title}
                    </span>
                  </div>
                </div>
                <h3 className="mt-2 font-semibold text-xs md:text-sm text-[#e3e2e2] truncate group-hover:text-[#ffb4aa] transition-colors">
                  {movie.title}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Action & High-Octane Thrillers */}
        <section className="pl-4 md:pl-8">
          <div className="flex items-center justify-between pr-4 md:pr-8 mb-4">
            <h2 className="font-display font-bold text-xl md:text-2xl text-white tracking-tight">
              Action & High-Octane Thrillers
            </h2>
            <button
              onClick={() => onNavigate('search')}
              className="text-xs font-semibold text-[#ffb4aa] hover:underline"
            >
              See More
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto hide-scrollbar pr-4 md:pr-8 snap-x pb-3">
            {actionMovies.map((movie) => (
              <div
                key={movie.id}
                id={`action-card-${movie.id}`}
                onClick={() => onSelectMovie(movie)}
                className="snap-start shrink-0 w-[140px] sm:w-[160px] md:w-[190px] group cursor-pointer"
              >
                <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#1e2020] border border-white/10 transition-all duration-300 group-hover:scale-105 group-hover:border-[#ffb4aa]/40 shadow-xl">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <span className="text-xs font-bold text-[#f59e0b]">
                      {movie.matchScore}% Match
                    </span>
                    <span className="text-sm font-bold text-white truncate">
                      {movie.title}
                    </span>
                  </div>
                </div>
                <h3 className="mt-2 font-semibold text-xs md:text-sm text-[#e3e2e2] truncate group-hover:text-[#ffb4aa] transition-colors">
                  {movie.title}
                </h3>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
