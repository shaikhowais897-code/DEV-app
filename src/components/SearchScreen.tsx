import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  TrendingUp,
  Play,
  Plus,
  Check,
  Star,
  Sparkles,
  Filter
} from 'lucide-react';
import { Movie, CategoryItem } from '../types';
import { CATEGORIES_DATABASE, TOP_SEARCH_TAGS } from '../data/movies';

interface SearchScreenProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onPlayMovie: (movie: Movie) => void;
  watchlist: string[];
  onToggleWatchlist: (movieId: string) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  movies,
  onSelectMovie,
  onPlayMovie,
  watchlist,
  onToggleWatchlist,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'All' | '4K' | 'Free' | 'Premium'>('All');
  const [showFilters, setShowFilters] = useState(false);

  // Filtered movies
  const searchResults = useMemo(() => {
    return movies.filter((movie) => {
      const matchesQuery =
        searchQuery.trim() === '' ||
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.synopsis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genre.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
        movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.cast.some((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesGenre =
        !selectedGenre ||
        movie.genre.some((g) => g.toLowerCase() === selectedGenre.toLowerCase());

      const matchesTier =
        selectedFilter === 'All' ||
        (selectedFilter === '4K' && movie.badges.some((b) => b.includes('4K'))) ||
        (selectedFilter === 'Free' && movie.accessLevel === 'free') ||
        (selectedFilter === 'Premium' && movie.accessLevel === 'premium');

      return matchesQuery && matchesGenre && matchesTier;
    });
  }, [movies, searchQuery, selectedGenre, selectedFilter]);

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    setSelectedGenre(null);
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedGenre(categoryName);
    setSearchQuery('');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedGenre(null);
  };

  const isBrowsing = searchQuery.trim() === '' && !selectedGenre;

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Sticky Search Bar Section */}
      <section className="sticky top-16 z-40 bg-[#121414]/95 backdrop-blur-md py-3 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="relative w-full max-w-3xl mx-auto flex items-center gap-2.5">
          <div className="relative flex-grow group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#e3e2e2]/50 group-focus-within:text-[#ffb4aa] transition-colors">
              <Search className="w-5 h-5" />
            </div>

            <input
              id="main-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies, TV shows, actors, genres..."
              className="w-full bg-[#292a2b]/90 border border-white/10 rounded-full py-3.5 pl-12 pr-10 text-white placeholder:text-[#e3e2e2]/50 focus:outline-none focus:border-[#ffb4aa] focus:ring-1 focus:ring-[#ffb4aa] focus:bg-[#333535] transition-all shadow-inner text-sm md:text-base font-medium"
            />

            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#e3e2e2]/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            id="btn-toggle-filters"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[#292a2b] border rounded-full transition-all active:scale-95 ${
              showFilters || selectedFilter !== 'All'
                ? 'border-[#ffb4aa] text-[#ffb4aa] bg-[#ffb4aa]/10'
                : 'border-white/10 text-white/70 hover:text-white hover:border-white/30'
            }`}
            title="Filter by Quality or Access"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Filter Badges drawer */}
        {showFilters && (
          <div className="max-w-3xl mx-auto mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 animate-in fade-in duration-200">
            <span className="text-xs text-white/50 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> Filters:
            </span>
            {(['All', '4K', 'Free', 'Premium'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedFilter(tier)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedFilter === tier
                    ? 'bg-[#c0342c] text-white shadow-md'
                    : 'bg-[#1e2020] text-white/70 border border-white/10 hover:border-white/30'
                }`}
              >
                {tier === '4K' ? '4K Ultra HD' : tier === 'Free' ? 'Free Tier' : tier}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Top Searches / Trending Tags (when not active query) */}
      {isBrowsing && (
        <section className="max-w-3xl mx-auto w-full pt-1">
          <h2 className="font-display font-bold text-lg md:text-xl text-white mb-3 flex items-center gap-2">
            <span>Top Searches</span>
            <TrendingUp className="w-4 h-4 text-[#f59e0b]" />
          </h2>

          <div className="flex flex-wrap gap-2">
            {TOP_SEARCH_TAGS.map((tag) => (
              <button
                key={tag}
                id={`tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleTagClick(tag)}
                className="px-4 py-2 bg-[#1e2020] border border-white/10 rounded-full text-xs md:text-sm font-semibold text-[#e3e2e2]/80 hover:text-[#ffb4aa] hover:bg-[#292a2b] hover:border-[#ffb4aa]/40 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <TrendingUp className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span>{tag}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Active Filter State Banner */}
      {selectedGenre && (
        <div className="max-w-7xl mx-auto flex items-center justify-between bg-[#1e2020] border border-[#ffb4aa]/30 rounded-xl p-3.5 px-5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50">Browsing Genre:</span>
            <span className="text-sm font-bold text-[#ffb4aa] uppercase tracking-wider">
              {selectedGenre}
            </span>
          </div>
          <button
            onClick={clearSearch}
            className="text-xs text-white/60 hover:text-white flex items-center gap-1 font-semibold"
          >
            <span>Show All Categories</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Browse Categories (Bento Grid) - Visible on Default Search */}
      {isBrowsing && (
        <section className="w-full pt-4">
          <h2 className="font-display font-bold text-xl md:text-2xl text-white mb-5 tracking-tight">
            Browse Categories
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[130px] md:auto-rows-[170px]">
            {/* Bento Block 1: Action (Large 2x2) */}
            <div
              id="category-action"
              onClick={() => handleCategoryClick('Action')}
              className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group border border-white/10 hover:border-[#ffb4aa]/60 transition-all duration-300 cursor-pointer shadow-xl"
            >
              <div className="absolute inset-0 bg-[#292a2b]">
                <img
                  src={CATEGORIES_DATABASE[0].coverImage}
                  alt="Action Category"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121414] via-[#121414]/30 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 p-5 md:p-6 w-full">
                <h3 className="font-display font-extrabold text-2xl md:text-3xl text-[#ffb4aa] tracking-tight mb-1 group-hover:-translate-y-1 transition-transform">
                  Action
                </h3>
                <p className="text-xs md:text-sm font-semibold uppercase tracking-wider text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  Adrenaline Rush
                </p>
              </div>
            </div>

            {/* Bento Block 2: Sci-Fi (1x1) */}
            <div
              id="category-sci-fi"
              onClick={() => handleCategoryClick('Sci-Fi')}
              className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden group border border-white/10 hover:border-[#ffb4aa]/60 transition-all duration-300 cursor-pointer shadow-lg"
            >
              <div className="absolute inset-0 bg-[#292a2b]">
                <img
                  src={CATEGORIES_DATABASE[1].coverImage}
                  alt="Sci-Fi Category"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121414]/90 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <h3 className="font-display font-bold text-lg md:text-xl text-white group-hover:text-[#ffb4aa] transition-colors">
                  Sci-Fi
                </h3>
              </div>
            </div>

            {/* Bento Block 3: Drama (1x2 tall) */}
            <div
              id="category-drama"
              onClick={() => handleCategoryClick('Drama')}
              className="col-span-1 row-span-2 relative rounded-2xl overflow-hidden group border border-white/10 hover:border-[#ffb4aa]/60 transition-all duration-300 cursor-pointer shadow-xl"
            >
              <div className="absolute inset-0 bg-[#292a2b]">
                <img
                  src={CATEGORIES_DATABASE[2].coverImage}
                  alt="Drama Category"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121414] via-[#121414]/50 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 p-4 md:p-5 w-full">
                <h3 className="font-display font-bold text-lg md:text-xl text-white group-hover:text-[#ffb4aa] transition-colors">
                  Drama
                </h3>
                <p className="text-xs uppercase tracking-wider text-white/70 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Deep Cuts
                </p>
              </div>
            </div>

            {/* Bento Block 4: Comedy (1x1) */}
            <div
              id="category-comedy"
              onClick={() => handleCategoryClick('Comedy')}
              className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden group border border-white/10 hover:border-[#ffb4aa]/60 transition-all duration-300 cursor-pointer shadow-lg"
            >
              <div className="absolute inset-0 bg-[#292a2b]">
                <img
                  src={CATEGORIES_DATABASE[3].coverImage}
                  alt="Comedy Category"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121414]/90 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <h3 className="font-display font-bold text-lg md:text-xl text-white group-hover:text-[#ffb4aa] transition-colors">
                  Comedy
                </h3>
              </div>
            </div>

            {/* Bento Block 5: Horror (Wide 3-col) */}
            <div
              id="category-horror"
              onClick={() => handleCategoryClick('Horror')}
              className="col-span-2 md:col-span-3 row-span-1 relative rounded-2xl overflow-hidden group border border-white/10 hover:border-[#ffb4ab]/60 transition-all duration-300 cursor-pointer shadow-xl"
            >
              <div className="absolute inset-0 bg-[#0d0e0f]">
                <img
                  src={CATEGORIES_DATABASE[4].coverImage}
                  alt="Horror Category"
                  className="w-full h-full object-cover opacity-45 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#121414] via-[#121414]/40 to-transparent"></div>
              </div>
              <div className="absolute left-0 inset-y-0 flex flex-col justify-center p-5 md:p-6 w-full max-w-sm">
                <h3 className="font-display font-extrabold text-2xl text-[#ffb4ab] tracking-tight mb-1 group-hover:translate-x-1 transition-transform">
                  Horror
                </h3>
                <p className="text-xs md:text-sm text-[#e3e2e2]/70 font-medium">
                  Don't look behind you.
                </p>
              </div>
            </div>

            {/* Bento Block 6: Animation */}
            <div
              id="category-animation"
              onClick={() => handleCategoryClick('Animation')}
              className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden group border border-white/10 hover:border-[#ffb4aa]/60 transition-all duration-300 cursor-pointer shadow-lg"
            >
              <div className="absolute inset-0 bg-[#292a2b]">
                <img
                  src={CATEGORIES_DATABASE[5].coverImage}
                  alt="Animation Category"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121414]/90 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <h3 className="font-display font-bold text-base md:text-lg text-white group-hover:text-[#ffb4aa] transition-colors">
                  Animation
                </h3>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search Results Grid */}
      {(!isBrowsing || searchQuery.trim() !== '') && (
        <section className="w-full pt-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-xl md:text-2xl text-white tracking-tight">
              {searchQuery ? `Results for "${searchQuery}"` : `${selectedGenre} Titles`}
            </h2>
            <span className="text-xs text-white/50 font-medium">
              {searchResults.length} {searchResults.length === 1 ? 'title' : 'titles'} found
            </span>
          </div>

          {searchResults.length === 0 ? (
            <div className="py-16 text-center bg-[#1e2020]/50 border border-white/5 rounded-2xl p-8 max-w-lg mx-auto">
              <Search className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <h3 className="font-display font-bold text-lg text-white mb-1">
                No matching movies found
              </h3>
              <p className="text-sm text-white/50 mb-6">
                Try searching for another keyword, actor name, or exploring one of the top categories.
              </p>
              <button
                onClick={clearSearch}
                className="px-6 py-2.5 rounded-full bg-[#c0342c] text-white font-semibold text-sm hover:bg-[#c0342c]/90 transition-colors shadow-md"
              >
                Clear Search & Browse All
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {searchResults.map((movie) => (
                <div
                  key={movie.id}
                  id={`search-item-${movie.id}`}
                  onClick={() => onSelectMovie(movie)}
                  className="group cursor-pointer flex flex-col gap-2"
                >
                  <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#1e2020] border border-white/10 transition-all duration-300 group-hover:scale-105 group-hover:border-[#ffb4aa]/50 shadow-xl">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                      <span className="text-xs font-bold text-[#ffb4aa]">
                        {movie.matchScore}% Match
                      </span>
                      <span className="text-sm font-bold text-white line-clamp-1">
                        {movie.title}
                      </span>
                      <span className="text-[11px] text-white/70">
                        {movie.year} • {movie.duration}
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

                  <h3 className="font-semibold text-xs md:text-sm text-white truncate group-hover:text-[#ffb4aa] transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                    <span>{movie.year}</span>
                    <span>•</span>
                    <span>{movie.genre[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
