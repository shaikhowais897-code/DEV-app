import React, { useState, useEffect } from 'react';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { HomeScreen } from './components/HomeScreen';
import { SearchScreen } from './components/SearchScreen';
import { MovieDetailScreen } from './components/MovieDetailScreen';
import { VideoPlayerScreen } from './components/VideoPlayerScreen';
import { WatchlistScreen } from './components/WatchlistScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { AdminOpsModal } from './components/AdminOpsModal';
import { LoginModal } from './components/LoginModal';
import { Movie, UserProfile } from './types';
import { MOVIES_DATABASE, CURRENT_USER, MOCK_USERS_DATABASE } from './data/movies';

export function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'search' | 'watchlist' | 'profile'>('home');
  const [movies, setMovies] = useState<Movie[]>(MOVIES_DATABASE);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>([
    'interstellar-voyage',
    'the-cipher-protocol',
    'neon-resonance',
  ]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>(MOCK_USERS_DATABASE);
  const [user, setUser] = useState<UserProfile>(CURRENT_USER);
  const [adminOpen, setAdminOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Global Secluded Admin Shortcut: Ctrl+Shift+A or Cmd+Shift+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3000);
  };

  const handleToggleWatchlist = (movieId: string) => {
    if (watchlist.includes(movieId)) {
      setWatchlist((prev) => prev.filter((id) => id !== movieId));
      const movie = movies.find((m) => m.id === movieId);
      showToast(`Removed "${movie?.title || 'Title'}" from Watchlist`);
    } else {
      setWatchlist((prev) => [...prev, movieId]);
      const movie = movies.find((m) => m.id === movieId);
      showToast(`Added "${movie?.title || 'Title'}" to Watchlist`);
    }
  };

  const handleAddMovie = (newMovie: Movie) => {
    setMovies((prev) => [newMovie, ...prev]);
    showToast(`Added "${newMovie.title}" (${newMovie.contentType?.toUpperCase() || 'TITLE'}) to library`);
  };

  const handleDeleteMovie = (movieId: string) => {
    const target = movies.find((m) => m.id === movieId);
    setMovies((prev) => prev.filter((m) => m.id !== movieId));
    setWatchlist((prev) => prev.filter((id) => id !== movieId));
    if (selectedMovie?.id === movieId) setSelectedMovie(null);
    showToast(`Deleted "${target?.title || 'Title'}" from catalog`);
  };

  const handleToggleFeatureMovie = (movieId: string) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === movieId ? { ...m, isFeatured: !m.isFeatured } : m))
    );
    const target = movies.find((m) => m.id === movieId);
    showToast(`Toggled feature spotlight for "${target?.title}"`);
  };

  const handleUpdateMovie = (updatedMovie: Movie) => {
    setMovies((prev) => prev.map((m) => (m.id === updatedMovie.id ? updatedMovie : m)));
    if (selectedMovie?.id === updatedMovie.id) {
      setSelectedMovie(updatedMovie);
    }
    showToast(`Updated "${updatedMovie.title}" artwork & metadata`);
  };

  const handleRateMovie = (movieId: string, rating: number | undefined) => {
    setMovies((prevMovies) => {
      const updatedMovies = prevMovies.map((m) => {
        if (m.id !== movieId) return m;

        const prevUserRating = m.userRating;
        const prevCount = m.ratingCount || 1200;
        const currentBreakdown = m.ratingsBreakdown
          ? { ...m.ratingsBreakdown }
          : {
              5: Math.round(prevCount * 0.68),
              4: Math.round(prevCount * 0.2),
              3: Math.round(prevCount * 0.07),
              2: Math.round(prevCount * 0.03),
              1: Math.max(0, prevCount - Math.round(prevCount * 0.98)),
            };

        let newCount = prevCount;

        if (rating !== undefined) {
          if (prevUserRating) {
            currentBreakdown[prevUserRating as keyof typeof currentBreakdown] = Math.max(
              0,
              (currentBreakdown[prevUserRating as keyof typeof currentBreakdown] || 1) - 1
            );
            currentBreakdown[rating as keyof typeof currentBreakdown] =
              (currentBreakdown[rating as keyof typeof currentBreakdown] || 0) + 1;
          } else {
            currentBreakdown[rating as keyof typeof currentBreakdown] =
              (currentBreakdown[rating as keyof typeof currentBreakdown] || 0) + 1;
            newCount += 1;
          }
        } else if (prevUserRating) {
          currentBreakdown[prevUserRating as keyof typeof currentBreakdown] = Math.max(
            0,
            (currentBreakdown[prevUserRating as keyof typeof currentBreakdown] || 1) - 1
          );
          newCount = Math.max(1, newCount - 1);
        }

        const totalPoints =
          (currentBreakdown[5] || 0) * 5 +
          (currentBreakdown[4] || 0) * 4 +
          (currentBreakdown[3] || 0) * 3 +
          (currentBreakdown[2] || 0) * 2 +
          (currentBreakdown[1] || 0) * 1;
        const newAverage = Number((totalPoints / Math.max(1, newCount)).toFixed(1));

        const updatedMovie: Movie = {
          ...m,
          userRating: rating,
          ratingCount: newCount,
          communityRating: newAverage,
          rating: newAverage,
          ratingsBreakdown: currentBreakdown,
        };

        if (selectedMovie && selectedMovie.id === movieId) {
          setSelectedMovie(updatedMovie);
        }

        return updatedMovie;
      });

      return updatedMovies;
    });
  };

  const handleSelectMovie = (movie: Movie) => {
    // Find latest state of the movie in movies
    const latest = movies.find((m) => m.id === movie.id) || movie;
    setSelectedMovie(latest);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayMovie = (movie: Movie) => {
    setPlayingMovie(movie);
  };

  const handleUpdateProgress = (movieId: string, progress: number) => {
    // Updates continue progress
    console.log(`Updated progress for ${movieId}: ${progress}%`);
  };

  return (
    <div className="min-h-screen bg-[#121414] text-[#e3e2e2] flex flex-col font-sans selection:bg-[#c0342c] selection:text-white">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1e2020] border border-[#ffb4aa]/40 text-white px-5 py-2.5 rounded-full shadow-2xl text-xs md:text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="w-2 h-2 rounded-full bg-[#ffb4aa]"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top App Bar (Hidden when in Fullscreen Player) */}
      {!playingMovie && (
        <TopAppBar
          currentTab={selectedMovie ? '' : currentTab}
          onNavigate={(tab) => {
            setSelectedMovie(null);
            setCurrentTab(tab as any);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          user={user}
          onOpenAdmin={() => setAdminOpen(true)}
          onOpenLogin={() => setLoginOpen(true)}
          watchlistCount={watchlist.length}
          onSelectMovie={(id) => {
            const found = movies.find((m) => m.id === id);
            if (found) handleSelectMovie(found);
          }}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {/* Fullscreen Video Player Mode */}
        {playingMovie ? (
          <VideoPlayerScreen
            movie={playingMovie}
            onBack={() => setPlayingMovie(null)}
            onUpdateProgress={handleUpdateProgress}
          />
        ) : selectedMovie ? (
          /* Movie Detail Screen */
          <MovieDetailScreen
            movie={selectedMovie}
            allMovies={movies}
            onBack={() => setSelectedMovie(null)}
            onPlayMovie={handlePlayMovie}
            onSelectMovie={handleSelectMovie}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onShowToast={showToast}
            onRateMovie={handleRateMovie}
          />
        ) : currentTab === 'home' ? (
          /* Home Screen */
          <HomeScreen
            movies={movies}
            onSelectMovie={handleSelectMovie}
            onPlayMovie={handlePlayMovie}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onNavigate={(tab) => {
              setCurrentTab(tab as any);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : currentTab === 'search' ? (
          /* Search & Category Bento Screen */
          <SearchScreen
            movies={movies}
            onSelectMovie={handleSelectMovie}
            onPlayMovie={handlePlayMovie}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
          />
        ) : currentTab === 'watchlist' ? (
          /* Watchlist & Continue Watching Screen */
          <WatchlistScreen
            movies={movies}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onSelectMovie={handleSelectMovie}
            onPlayMovie={handlePlayMovie}
            onNavigate={(tab) => {
              setCurrentTab(tab as any);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          /* User Profile & Subscription Screen */
          <ProfileScreen
            user={user}
            onUpdateUser={(updated) => {
              setUser((prev) => {
                const newUser = { ...prev, ...updated };
                setAllUsers((list) =>
                  list.map((u) => (u.id === newUser.id ? { ...u, ...updated } : u))
                );
                return newUser;
              });
            }}
            onShowToast={showToast}
            onOpenAdmin={() => setAdminOpen(true)}
            onOpenLogin={() => setLoginOpen(true)}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Hidden when in Fullscreen Player) */}
      {!playingMovie && (
        <BottomNavBar
          currentTab={selectedMovie ? '' : currentTab}
          onNavigate={(tab) => {
            setSelectedMovie(null);
            setCurrentTab(tab as any);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          watchlistCount={watchlist.length}
        />
      )}

      {/* Private Admin & Content Upload Modal */}
      <AdminOpsModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        currentUser={user}
        allUsers={allUsers}
        onUpdateUsers={setAllUsers}
        movies={movies}
        onAddMovie={handleAddMovie}
        onUpdateMovie={handleUpdateMovie}
        onDeleteMovie={handleDeleteMovie}
        onToggleFeatureMovie={handleToggleFeatureMovie}
        onSelectMovie={handleSelectMovie}
        onPlayMovie={handlePlayMovie}
        onShowToast={showToast}
      />

      {/* User Login & Profile Switch Modal */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        currentUser={user}
        onSelectUser={(newUser) => {
          setUser(newUser);
          // Also make sure it is updated in allUsers if new
          if (!allUsers.find((u) => u.id === newUser.id)) {
            setAllUsers((prev) => [...prev, newUser]);
          }
        }}
        onShowToast={showToast}
        allUsers={allUsers}
        onOpenAdmin={() => {
          setLoginOpen(false);
          setAdminOpen(true);
        }}
      />
    </div>
  );
}

export default App;

