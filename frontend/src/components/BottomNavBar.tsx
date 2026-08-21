import React from 'react';
import { Home, Search, Bookmark, User } from 'lucide-react';

interface BottomNavBarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  watchlistCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onNavigate,
  watchlistCount,
}) => {
  return (
    <nav
      aria-label="Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-[#1e2020]/95 backdrop-blur-2xl rounded-t-2xl border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.8)] pb-[calc(0.5rem+env(safe-area-inset-bottom,16px))]"
    >
      {/* Home Tab */}
      <button
        id="tab-home"
        aria-label="Home"
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-200 active:scale-90 ${
          currentTab === 'home'
            ? 'text-[#ffb4aa] bg-[#ffb4aa]/15'
            : 'text-[#e3e2e2]/60 hover:text-white'
        }`}
      >
        <Home className="w-6 h-6" />
        <span className="sr-only">Home</span>
      </button>

      {/* Search Tab */}
      <button
        id="tab-search"
        aria-label="Search"
        onClick={() => onNavigate('search')}
        className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-200 active:scale-90 ${
          currentTab === 'search'
            ? 'text-[#ffb4aa] bg-[#ffb4aa]/15'
            : 'text-[#e3e2e2]/60 hover:text-white'
        }`}
      >
        <Search className="w-6 h-6" />
        <span className="sr-only">Search</span>
      </button>

      {/* Bookmark / Watchlist Tab */}
      <button
        id="tab-watchlist"
        aria-label="Watchlist"
        onClick={() => onNavigate('watchlist')}
        className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-200 active:scale-90 relative ${
          currentTab === 'watchlist'
            ? 'text-[#ffb4aa] bg-[#ffb4aa]/15'
            : 'text-[#e3e2e2]/60 hover:text-white'
        }`}
      >
        <Bookmark className="w-6 h-6" />
        {watchlistCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#c0342c]"></span>
        )}
        <span className="sr-only">Watchlist</span>
      </button>

      {/* Profile Tab */}
      <button
        id="tab-profile"
        aria-label="Profile"
        onClick={() => onNavigate('profile')}
        className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-200 active:scale-90 ${
          currentTab === 'profile'
            ? 'text-[#ffb4aa] bg-[#ffb4aa]/15'
            : 'text-[#e3e2e2]/60 hover:text-white'
        }`}
      >
        <User className="w-6 h-6" />
        <span className="sr-only">Profile</span>
      </button>
    </nav>
  );
};
