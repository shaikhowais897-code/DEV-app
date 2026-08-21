import React, { useState } from 'react';
import { Bookmark, Play, Trash2, Clock, Check, Film, ArrowRight, Sparkles } from 'lucide-react';
import { Movie } from '../types';

interface WatchlistScreenProps {
  movies: Movie[];
  watchlist: string[];
  onToggleWatchlist: (movieId: string) => void;
  onSelectMovie: (movie: Movie) => void;
  onPlayMovie: (movie: Movie) => void;
  onNavigate: (tab: string) => void;
}

export const WatchlistScreen: React.FC<WatchlistScreenProps> = ({
  movies,
  watchlist,
  onToggleWatchlist,
  onSelectMovie,
  onPlayMovie,
  onNavigate,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'continue' | 'movies'>('all');

  const watchlistMovies = movies.filter((m) => watchlist.includes(m.id));
  const continueWatchingMovies = movies.filter((m) => m.continueProgress !== undefined);

  const displayedMovies =
    activeFilter === 'continue'
      ? continueWatchingMovies
      : activeFilter === 'movies'
      ? watchlistMovies.filter((m) => !m.episodeInfo)
      : watchlistMovies;

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight flex items-center gap-2.5">
            <Bookmark className="w-7 h-7 text-[#ffb4aa] fill-[#ffb4aa]/20" />
            <span>My Library & Watchlist</span>
          </h1>
          <p className="text-sm text-[#e3e2e2]/60 mt-1">
            Manage your saved titles and resume previous watch sessions across all devices.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 bg-[#1e2020] p-1 rounded-xl border border-white/10 self-start md:self-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'all'
                ? 'bg-[#c0342c] text-white shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            All Saved ({watchlistMovies.length})
          </button>
          <button
            onClick={() => setActiveFilter('continue')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'continue'
                ? 'bg-[#c0342c] text-white shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Continue Watching ({continueWatchingMovies.length})
          </button>
        </div>
      </div>

      {/* Main Grid */}
      {displayedMovies.length === 0 ? (
        <div className="py-20 text-center bg-[#1e2020]/40 border border-white/5 rounded-3xl p-8 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-white/30">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-xl text-white">
            {activeFilter === 'continue' ? 'No titles in progress' : 'Your watchlist is empty'}
          </h3>
          <p className="text-sm text-[#e3e2e2]/60">
            Explore our curated catalog and tap "+ Watchlist" on any title to save it for later.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 rounded-full bg-[#f59e0b] text-[#1e293b] font-bold text-sm hover:opacity-90 transition-opacity shadow-lg inline-flex items-center gap-2"
          >
            <span>Discover Popular Movies</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {displayedMovies.map((movie) => (
            <div
              key={movie.id}
              id={`watchlist-item-${movie.id}`}
              onClick={() => onSelectMovie(movie)}
              className="group relative cursor-pointer flex flex-col gap-2"
            >
              <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-[#1e2020] border border-white/10 transition-all duration-300 group-hover:scale-105 group-hover:border-[#ffb4aa]/50 shadow-xl">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />

                {/* If Continue Watching: show progress bar on card */}
                {movie.continueProgress !== undefined && (
                  <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/60">
                    <div
                      className="h-full bg-[#c0342c]"
                      style={{ width: `${movie.continueProgress}%` }}
                    ></div>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <span className="text-xs font-bold text-[#ffb4aa]">
                    {movie.rating} ★ • {movie.year}
                  </span>
                  <span className="text-sm font-bold text-white line-clamp-1">
                    {movie.title}
                  </span>
                  <div className="mt-2 flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayMovie(movie);
                      }}
                      className="w-8 h-8 rounded-full bg-[#f59e0b] text-[#1e293b] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                      title="Play Now"
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(movie.id);
                      }}
                      className="w-8 h-8 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/40 flex items-center justify-center transition-colors"
                      title="Remove from Watchlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-between gap-1 px-1">
                <div className="overflow-hidden">
                  <h3 className="font-semibold text-xs md:text-sm text-white truncate group-hover:text-[#ffb4aa] transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-[11px] text-white/50 truncate">
                    {movie.episodeInfo || movie.genre.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
