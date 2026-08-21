import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bookmark,
  Bell,
  SlidersHorizontal,
  Server,
  LogOut,
  Crown,
  Settings,
  Film,
  Sparkles,
  Tv,
  Check,
  Shield,
  Upload,
  User,
  Key
} from 'lucide-react';
import { UserProfile } from '../types';

interface TopAppBarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  user: UserProfile;
  onOpenAdmin: () => void;
  onOpenLogin: () => void;
  watchlistCount: number;
  onSelectMovie?: (movieId: string) => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentTab,
  onNavigate,
  user,
  onOpenAdmin,
  onOpenLogin,
  watchlistCount,
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const [logoPulse, setLogoPulse] = useState(false);
  const clickCountRef = React.useRef(0);
  const clickTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const isAdmin = user.role === 'admin' || user.email === 'shaikhowais897@gmail.com';

  const handleLogoClick = () => {
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    clickCountRef.current += 1;

    if (clickCountRef.current >= 4) {
      clickCountRef.current = 0;
      setLogoPulse(true);
      setTimeout(() => setLogoPulse(false), 800);
      onOpenAdmin();
      return;
    }

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1500);

    onNavigate('home');
  };

  const notifications = [
    { id: 1, title: 'New Arrival: Neon Horizon (4K HDR)', time: '10m ago', unread: true },
    { id: 2, title: 'Upload Pipeline: Ready for new 4K masters', time: '1h ago', unread: true },
    { id: 3, title: `Your ${user.plan} plan is active`, time: '1d ago', unread: false },
  ];

  return (
    <header
      id="top-nav"
      className="fixed top-0 left-0 w-full z-50 bg-[#121414]/90 backdrop-blur-xl border-b border-white/5 transition-all duration-300 px-4 md:px-8 h-16 flex items-center justify-between shadow-lg"
    >
      {/* Left side: Mobile Menu + Brand Logo */}
      <div className="flex items-center gap-4 md:gap-8">
        <button
          id="btn-mobile-menu"
          aria-label="Menu"
          onClick={() => onNavigate('search')}
          className="md:hidden w-10 h-10 flex items-center justify-center text-[#ffb4aa] hover:bg-white/5 rounded-full transition-colors active:scale-95 cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>

        <button
          id="btn-brand-logo"
          onClick={handleLogoClick}
          className="flex items-center gap-2 text-left group cursor-pointer select-none"
          title="Whoosh Cinema"
        >
          <div
            className={`w-8 h-8 rounded-lg bg-gradient-to-tr from-[#c0342c] to-[#f59e0b] flex items-center justify-center shadow-[0_0_15px_rgba(192,52,44,0.4)] group-hover:scale-105 transition-all duration-300 ${
              logoPulse ? 'ring-4 ring-[#ffb4aa] scale-125 rotate-12' : ''
            }`}
          >
            <Film className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-extrabold text-2xl md:text-3xl italic tracking-tighter text-[#ffb4aa] group-hover:text-white transition-colors">
            Whoosh
          </span>
          <span className="hidden lg:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#c0342c]/20 text-[#ffb4aa] border border-[#c0342c]/30">
            Cinema
          </span>
        </button>

        {/* Desktop Navigation Links (Clean, Secluded from public clutter) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            id="nav-home"
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
              currentTab === 'home'
                ? 'bg-white/10 text-[#ffb4aa] shadow-inner'
                : 'text-[#e3e2e2]/80 hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </button>
          <button
            id="nav-search"
            onClick={() => onNavigate('search')}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
              currentTab === 'search'
                ? 'bg-white/10 text-[#ffb4aa] shadow-inner'
                : 'text-[#e3e2e2]/80 hover:text-white hover:bg-white/5'
            }`}
          >
            Discover & Genres
          </button>
          <button
            id="nav-watchlist"
            onClick={() => onNavigate('watchlist')}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentTab === 'watchlist'
                ? 'bg-white/10 text-[#ffb4aa] shadow-inner'
                : 'text-[#e3e2e2]/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>My List</span>
            {watchlistCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#c0342c] text-white text-[11px] font-bold rounded-full">
                {watchlistCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Right side: Search, Sign In / Switcher, Notifications & User Avatar */}
      <div className="flex items-center gap-2 md:gap-3 relative">
        <button
          id="btn-top-search"
          aria-label="Search"
          onClick={() => onNavigate('search')}
          className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[#e3e2e2] hover:text-[#ffb4aa] hover:bg-white/5 transition-colors cursor-pointer"
        >
          <Search className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Quick Sign In / Switch Profile Button */}
        <button
          id="btn-open-login"
          onClick={onOpenLogin}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all cursor-pointer"
          title="Sign In or Switch Profile"
        >
          <User className="w-3.5 h-3.5 text-[#ffb4aa]" />
          <span>Sign In / Switch</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            id="btn-notifications"
            aria-label="Notifications"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileMenuOpen(false);
              setUnreadCount(0);
            }}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[#e3e2e2] hover:text-[#ffb4aa] hover:bg-white/5 transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4 md:w-5 md:h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#c0342c] shadow-[0_0_8px_#c0342c]"></span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 md:w-80 bg-[#1e2020] border border-white/10 rounded-2xl shadow-2xl p-3 z-50 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                <span className="font-bold text-white">Notifications</span>
                <span className="text-[11px] text-[#ffb4aa]">Live Feed</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl text-xs transition-colors flex justify-between items-start gap-2 ${
                      n.unread ? 'bg-white/5 text-white' : 'text-white/60'
                    }`}
                  >
                    <div>
                      <p className="font-medium">{n.title}</p>
                      <span className="text-[10px] text-white/40">{n.time}</span>
                    </div>
                    {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4aa] mt-1 shrink-0"></span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with dropdown */}
        <div className="relative">
          <button
            id="btn-profile-avatar"
            aria-label="User Profile"
            onClick={() => {
              setProfileMenuOpen(!profileMenuOpen);
              setNotificationsOpen(false);
            }}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-[#ffb4aa]/40 hover:border-[#ffb4aa] transition-all p-0.5 hover:scale-105 cursor-pointer relative"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
            {isAdmin && (
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#c0342c] rounded-full border border-black flex items-center justify-center text-[7px] text-white font-bold">
                👑
              </span>
            )}
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#1e2020] border border-white/10 rounded-2xl shadow-2xl p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10 mb-2">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#ffb4aa]/60"
                  />
                  {isAdmin && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#c0342c] rounded-full flex items-center justify-center text-[9px]">
                      👑
                    </span>
                  )}
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-white text-sm truncate">{user.name}</h4>
                    {isAdmin && (
                      <span className="px-1.5 py-0.2 bg-[#c0342c] text-white text-[9px] font-black rounded uppercase">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/50 truncate font-mono">{user.email}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#f59e0b] mt-0.5">
                    <Crown className="w-3 h-3" /> {user.plan}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <button
                  id="menu-item-profile"
                  onClick={() => {
                    onNavigate('profile');
                    setProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/90 hover:bg-white/10 transition-colors text-left cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-[#ffb4aa]" />
                  <span>Account & Subscription</span>
                </button>

                <button
                  id="menu-item-watchlist"
                  onClick={() => {
                    onNavigate('watchlist');
                    setProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/90 hover:bg-white/10 transition-colors text-left cursor-pointer"
                >
                  <Bookmark className="w-4 h-4 text-[#ffb4aa]" />
                  <span>My Saved Watchlist ({watchlistCount})</span>
                </button>
              </div>

              <div className="pt-2 mt-2 border-t border-white/10">
                <button
                  id="btn-logout"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onOpenLogin();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#ffb4aa] hover:bg-[#c0342c]/20 transition-colors text-left cursor-pointer font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Switch Account / Sign In</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

