import React, { useState } from 'react';
import {
  ArrowLeft,
  Play,
  Plus,
  Check,
  Share2,
  Star,
  Volume2,
  Subtitles,
  Clapperboard,
  Sparkles,
  Award,
  Users,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { Movie } from '../types';

interface MovieDetailScreenProps {
  movie: Movie;
  allMovies: Movie[];
  onBack: () => void;
  onPlayMovie: (movie: Movie) => void;
  onSelectMovie: (movie: Movie) => void;
  watchlist: string[];
  onToggleWatchlist: (movieId: string) => void;
  onShowToast: (message: string) => void;
  onRateMovie?: (movieId: string, rating: number | undefined) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: '1★ · Poor',
  2: '2★ · Fair',
  3: '3★ · Good',
  4: '4★ · Great',
  5: '5★ · Masterpiece!',
};

export const MovieDetailScreen: React.FC<MovieDetailScreenProps> = ({
  movie,
  allMovies,
  onBack,
  onPlayMovie,
  onSelectMovie,
  watchlist,
  onToggleWatchlist,
  onShowToast,
  onRateMovie,
}) => {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [justRated, setJustRated] = useState(false);

  const isInWatchlist = watchlist.includes(movie.id);

  // Community rating and breakdown values
  const avgRating = movie.communityRating ?? movie.rating;
  const ratingCount = movie.ratingCount || 1420;
  const userRating = movie.userRating;

  // Rating breakdown distribution
  const breakdown = movie.ratingsBreakdown || {
    5: Math.round(ratingCount * 0.68),
    4: Math.round(ratingCount * 0.20),
    3: Math.round(ratingCount * 0.07),
    2: Math.round(ratingCount * 0.03),
    1: Math.max(0, ratingCount - Math.round(ratingCount * 0.98)),
  };

  const totalBreakdownVotes = Math.max(
    1,
    (breakdown[5] || 0) +
    (breakdown[4] || 0) +
    (breakdown[3] || 0) +
    (breakdown[2] || 0) +
    (breakdown[1] || 0)
  );

  // Find related movies
  const relatedMovies = allMovies
    .filter(
      (m) =>
        m.id !== movie.id &&
        (movie.relatedIds.includes(m.id) || m.genre.some((g) => movie.genre.includes(g)))
    )
    .slice(0, 6);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    onShowToast(`Link to "${movie.title}" copied to clipboard!`);
  };

  const handleSetRating = (score: number) => {
    if (onRateMovie) {
      onRateMovie(movie.id, score);
    }
    setJustRated(true);
    setTimeout(() => setJustRated(false), 2500);
    onShowToast(`You rated "${movie.title}" ${score} of 5 stars!`);
  };

  const handleClearRating = () => {
    if (onRateMovie) {
      onRateMovie(movie.id, undefined);
    }
    onShowToast(`Removed your rating for "${movie.title}"`);
  };

  const activeRatingValue = hoveredStar ?? userRating ?? 0;

  return (
    <div className="min-h-screen pb-24 md:pb-16 animate-in fade-in duration-300">
      {/* Floating Mobile/Desktop Back Button */}
      <div className="fixed top-4 left-4 md:top-6 md:left-8 z-50">
        <button
          id="btn-detail-back"
          onClick={onBack}
          aria-label="Go Back"
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1e2020]/80 backdrop-blur-md flex items-center justify-center text-white hover:text-[#ffb4aa] hover:bg-[#292a2b] shadow-2xl border border-white/10 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      {/* Hero Section / Backdrop */}
      <div className="relative w-full h-[540px] md:h-[700px] overflow-hidden">
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-top scale-100 animate-in fade-in zoom-in-95 duration-700"
        />

        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121414] via-[#121414]/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#121414]/90 via-[#121414]/40 to-transparent md:w-3/4"></div>

        {/* Content Container over Hero */}
        <div className="absolute bottom-0 left-0 w-full px-4 md:px-8 lg:px-12 pb-8 z-10 flex flex-col justify-end max-w-4xl">
          {/* Title */}
          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.1] mb-3 drop-shadow-lg">
            {movie.title}
          </h1>

          {movie.tagline && (
            <p className="text-sm md:text-base text-[#ffb4aa]/90 italic mb-4 max-w-xl">
              "{movie.tagline}"
            </p>
          )}

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-6">
            {/* Average Community Rating Badge */}
            <span
              id="badge-community-rating"
              className="px-3 py-1 bg-[#292a2b]/80 backdrop-blur-sm border border-[#ffb964]/40 rounded-full text-xs font-bold text-[#ffb964] flex items-center gap-1.5 shadow-sm"
              title={`Average Community Rating: ${avgRating.toFixed(1)} / 5 (${ratingCount.toLocaleString()} reviews)`}
            >
              <Star className="w-3.5 h-3.5 fill-[#ffb964]" />
              <span>{avgRating.toFixed(1)}</span>
              <span className="text-white/40 text-[10px] font-normal">
                ({ratingCount >= 1000 ? `${(ratingCount / 1000).toFixed(1)}k` : ratingCount})
              </span>
            </span>

            {/* User Rating Pill if rated */}
            {userRating && (
              <span
                id="badge-user-rating"
                className="px-3 py-1 bg-[#c0342c]/70 backdrop-blur-sm border border-[#ffb4aa]/60 rounded-full text-xs font-bold text-white flex items-center gap-1 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#ffb4aa]" />
                <span>You: {userRating}★</span>
              </span>
            )}

            <span className="px-3 py-1 bg-[#292a2b]/80 backdrop-blur-sm border border-white/10 rounded-full text-xs font-semibold text-[#e3e2e2]/90">
              {movie.year}
            </span>
            <span className="px-3 py-1 bg-[#292a2b]/80 backdrop-blur-sm border border-white/10 rounded-full text-xs font-semibold text-[#e3e2e2]/90">
              {movie.duration}
            </span>
            {movie.genre.slice(0, 2).map((g, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-[#292a2b]/80 backdrop-blur-sm border border-white/10 rounded-full text-xs font-semibold text-[#e3e2e2]/90"
              >
                {g}
              </span>
            ))}
            <span className="px-3 py-1 bg-[#292a2b]/80 backdrop-blur-sm border border-[#f59e0b]/50 rounded-full text-xs font-bold text-[#f59e0b] uppercase">
              4K Ultra HD
            </span>
          </div>

          {/* Actions: Play Now, Watchlist, Share */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              id="btn-play-now"
              onClick={() => onPlayMovie(movie)}
              className="accent-amber hover:opacity-90 active:scale-95 transition-all duration-200 h-12 px-8 rounded-full flex items-center justify-center gap-2.5 font-bold text-base shadow-[0_4px_24px_rgba(245,158,11,0.4)] cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Play Now</span>
            </button>

            <button
              id="btn-detail-watchlist"
              onClick={() => onToggleWatchlist(movie.id)}
              className={`w-12 h-12 rounded-full border flex items-center justify-center backdrop-blur-md active:scale-90 transition-all cursor-pointer ${
                isInWatchlist
                  ? 'bg-[#c0342c] border-[#ffb4aa] text-white shadow-lg'
                  : 'bg-[#1e2020]/70 border-white/20 text-white hover:bg-[#292a2b] hover:border-[#ffb4aa]'
              }`}
              title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              {isInWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>

            <button
              id="btn-detail-share"
              onClick={handleShare}
              className="w-12 h-12 rounded-full bg-[#1e2020]/70 border border-white/20 flex items-center justify-center text-white hover:bg-[#292a2b] hover:border-[#ffb4aa] backdrop-blur-md active:scale-90 transition-all cursor-pointer"
              title="Share Link"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Detail Grid (Synopsis & Cast on left, Specs & Ratings on right) */}
      <div className="px-4 md:px-8 lg:px-12 py-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        {/* Left Column: Synopsis, Cast, and Interactive Rating */}
        <div className="lg:col-span-2 space-y-10">
          {/* Synopsis */}
          <section>
            <h2 className="font-display font-bold text-xl md:text-2xl text-white mb-3">
              Synopsis
            </h2>
            <p className="text-sm md:text-base text-[#e2beba] leading-relaxed max-w-prose">
              {movie.synopsis}
            </p>
          </section>

          {/* Cast & Crew */}
          {movie.cast.length > 0 && (
            <section>
              <h2 className="font-display font-bold text-xl md:text-2xl text-white mb-4">
                Cast & Crew
              </h2>
              <div className="flex overflow-x-auto gap-6 pb-2 hide-scrollbar">
                {movie.cast.map((actor, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 min-w-[85px] group">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#ffb4aa] shadow-md transition-colors">
                      <img
                        src={actor.avatar}
                        alt={actor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs font-semibold text-white text-center whitespace-nowrap">
                      {actor.name}
                    </span>
                    <span className="text-[11px] text-[#ffb4aa] text-center whitespace-nowrap">
                      {actor.role}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Audience & Community Rating Section */}
          <section id="movie-community-ratings-section" className="bg-[#1a1c1c] border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <h2 className="font-display font-bold text-xl md:text-2xl text-white flex items-center gap-2.5">
                  <Star className="w-6 h-6 text-[#ffb964] fill-[#ffb964]" />
                  <span>Ratings & Community Reviews</span>
                </h2>
                <p className="text-xs md:text-sm text-[#e2beba]/80 mt-1">
                  Real-time aggregated score from verified Whoosh stream subscribers.
                </p>
              </div>

              {movie.matchScore && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#ffb964]/10 border border-[#ffb964]/30 rounded-xl text-[#ffb964] text-xs font-bold self-start sm:self-center">
                  <Award className="w-4 h-4" />
                  <span>{movie.matchScore}% Match for you</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6">
              {/* Average Rating Score Display */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-[#141516] rounded-xl border border-white/5 text-center">
                <span className="text-5xl md:text-6xl font-black text-white font-display tracking-tight">
                  {avgRating.toFixed(1)}
                </span>

                {/* 5-Star Average Indicator */}
                <div className="flex items-center gap-1.5 my-3">
                  {[1, 2, 3, 4, 5].map((starNum) => {
                    const filled = avgRating >= starNum;
                    const halfFilled = !filled && avgRating >= starNum - 0.5;
                    return (
                      <Star
                        key={starNum}
                        className={`w-5 h-5 ${
                          filled
                            ? 'text-[#ffb964] fill-[#ffb964]'
                            : halfFilled
                            ? 'text-[#ffb964] fill-[#ffb964]/50'
                            : 'text-white/20'
                        }`}
                      />
                    );
                  })}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#e2beba]/90 font-medium">
                  <Users className="w-3.5 h-3.5 text-[#ffb4aa]" />
                  <span>{ratingCount.toLocaleString()} total community reviews</span>
                </div>
              </div>

              {/* Community Rating Breakdown Distribution */}
              <div className="md:col-span-7 flex flex-col justify-center space-y-2.5">
                <h3 className="text-xs uppercase tracking-wider text-white/50 font-bold mb-1">
                  Community Rating Breakdown
                </h3>
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = breakdown[stars as keyof typeof breakdown] || 0;
                  const percentage = Math.round((count / totalBreakdownVotes) * 100);
                  const isUserRatingThis = userRating === stars;

                  return (
                    <div key={stars} className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1 w-8 shrink-0 font-bold text-white/90">
                        <span>{stars}</span>
                        <Star className="w-3 h-3 text-[#ffb964] fill-[#ffb964]" />
                      </div>

                      {/* Progress Bar Track */}
                      <div className="flex-1 h-3 bg-[#242627] rounded-full overflow-hidden relative">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isUserRatingThis
                              ? 'bg-gradient-to-r from-[#ffb964] to-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                              : 'bg-[#ffb964]/80 hover:bg-[#ffb964]'
                          }`}
                          style={{ width: `${Math.max(percentage, 2)}%` }}
                        ></div>
                      </div>

                      <div className="w-16 text-right shrink-0 font-medium text-white/60">
                        <span>{percentage}%</span>
                        <span className="text-[10px] text-white/40 ml-1">({count})</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive User Rating Input Widget */}
            <div
              id="user-rating-box"
              className="mt-8 pt-6 border-t border-white/10 bg-gradient-to-br from-[#242627]/50 to-transparent p-5 rounded-xl border border-white/5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#ffb4aa]" />
                    <span>{userRating ? 'Your Rating' : 'Rate This Movie'}</span>
                  </h3>
                  <p className="text-xs text-[#e2beba]/80 mt-0.5">
                    {userRating
                      ? 'Thank you for your rating! Click any star to adjust your score.'
                      : 'Share your verdict to help personalize recommendations for the community.'}
                  </p>
                </div>

                {userRating && (
                  <button
                    id="btn-clear-rating"
                    onClick={handleClearRating}
                    className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-[#ffb4aa] transition-colors self-start sm:self-center cursor-pointer px-2.5 py-1 rounded-md hover:bg-white/5"
                    title="Remove your rating"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Rating</span>
                  </button>
                )}
              </div>

              {/* Star-Based Input System */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-5">
                <div
                  id="star-input-group"
                  className="flex items-center gap-2 bg-[#141516] px-4 py-2.5 rounded-xl border border-white/10 w-fit"
                  onMouseLeave={() => setHoveredStar(null)}
                >
                  {[1, 2, 3, 4, 5].map((starValue) => {
                    const isFilled = activeRatingValue >= starValue;
                    return (
                      <button
                        key={starValue}
                        id={`star-rating-${starValue}`}
                        type="button"
                        onClick={() => handleSetRating(starValue)}
                        onMouseEnter={() => setHoveredStar(starValue)}
                        aria-label={`Rate ${starValue} stars out of 5`}
                        className="p-1 group focus:outline-none transition-transform duration-150 active:scale-125 hover:scale-110 cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 transition-all duration-150 ${
                            isFilled
                              ? 'text-[#ffb964] fill-[#ffb964] drop-shadow-[0_0_8px_rgba(255,185,100,0.6)]'
                              : 'text-white/20 group-hover:text-white/40'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Rating Label and Feedback */}
                <div className="flex items-center gap-3">
                  <span
                    id="rating-feedback-label"
                    className={`text-sm font-bold transition-all duration-200 ${
                      activeRatingValue > 0 ? 'text-[#ffb964]' : 'text-white/40'
                    }`}
                  >
                    {activeRatingValue > 0
                      ? RATING_LABELS[activeRatingValue]
                      : 'Select 1 to 5 stars to rate'}
                  </span>

                  {justRated && (
                    <span className="text-xs bg-[#c0342c]/40 border border-[#ffb4aa]/40 text-white px-2.5 py-0.5 rounded-full font-bold animate-in fade-in zoom-in-90 duration-200">
                      Saved!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Specifications Bento Box */}
        <div className="space-y-4">
          <div className="bg-[#1a1c1c] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-white/50 mb-1 font-semibold flex items-center gap-1.5">
                <Clapperboard className="w-3.5 h-3.5 text-[#ffb4aa]" />
                <span>Director</span>
              </h3>
              <p className="font-semibold text-sm md:text-base text-white">{movie.director}</p>
            </div>

            <hr className="border-white/10" />

            <div>
              <h3 className="text-xs uppercase tracking-wider text-white/50 mb-1 font-semibold flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#ffb4aa]" />
                <span>Audio</span>
              </h3>
              <p className="text-sm text-[#e3e2e2]/90">{movie.audioInfo}</p>
            </div>

            <hr className="border-white/10" />

            <div>
              <h3 className="text-xs uppercase tracking-wider text-white/50 mb-1 font-semibold flex items-center gap-1.5">
                <Subtitles className="w-3.5 h-3.5 text-[#ffb4aa]" />
                <span>Subtitles</span>
              </h3>
              <p className="text-sm text-[#e3e2e2]/90">{movie.subtitlesInfo}</p>
            </div>

            <hr className="border-white/10" />

            <div>
              <h3 className="text-xs uppercase tracking-wider text-white/50 mb-1 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span>Streaming Quality</span>
              </h3>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {movie.badges.map((b, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 border border-white/10 text-white/80"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* More Like This Poster Grid */}
      {relatedMovies.length > 0 && (
        <section className="px-4 md:px-8 lg:px-12 py-8 border-t border-white/10 max-w-7xl mx-auto">
          <h2 className="font-display font-bold text-xl md:text-2xl text-white mb-6 tracking-tight">
            More Like This
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedMovies.map((relMovie) => (
              <div
                key={relMovie.id}
                id={`related-movie-${relMovie.id}`}
                onClick={() => onSelectMovie(relMovie)}
                className="group relative rounded-xl overflow-hidden cursor-pointer hover:scale-[1.03] transition-all duration-300 shadow-lg border border-white/10 hover:border-[#ffb4aa]/40"
              >
                <div className="aspect-[2/3] w-full bg-[#1e2020]">
                  <img
                    src={relMovie.posterUrl}
                    alt={relMovie.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#121414]/95 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <span className="font-semibold text-xs text-white truncate">
                    {relMovie.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

