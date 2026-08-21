import React, { useState } from 'react';
import {
  User,
  Crown,
  Check,
  CreditCard,
  Tv,
  Smartphone,
  ShieldCheck,
  HardDrive,
  Download,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  ArrowRight,
  Settings,
  HelpCircle,
  Film
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onShowToast: (message: string) => void;
  onOpenAdmin: () => void;
  onOpenLogin: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onUpdateUser,
  onShowToast,
  onOpenAdmin,
  onOpenLogin,
}) => {
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [autoplay, setAutoplay] = useState(user.autoplayNext);
  const [qualityPref, setQualityPref] = useState(user.preferredQuality);
  const [audioPref, setAudioPref] = useState(user.preferredAudio);

  const isAdmin = user.role === 'admin' || user.email === 'shaikhowais897@gmail.com';

  const plans = [
    {
      id: 'Free',
      name: 'Free Starter',
      price: '$0.00 / month',
      resolution: '720p HD',
      devices: '1 Screen',
      features: ['Access to 500+ free movies with ads', 'Stereo 2.0 Audio', 'Standard buffering'],
    },
    {
      id: 'Premium 4K HDR',
      name: 'Premium 4K HDR',
      price: '$14.99 / month',
      resolution: '4K Ultra HD + Dolby Vision',
      devices: '4 Screens simultaneously',
      features: ['Unlimited ad-free streaming', 'Dolby Atmos & Spatial Audio', 'Offline Downloads', 'Priority CDN bandwidth'],
      isPopular: true,
    },
    {
      id: 'Family VIP',
      name: 'Family VIP Suite',
      price: '$19.99 / month',
      resolution: '4K Ultra HD Master',
      devices: '6 Screens simultaneously',
      features: ['All Premium features', 'Separate Kids profiles', 'Uncompressed master audio stream'],
    },
  ];

  const handleSelectPlan = (planName: 'Free' | 'Premium 4K HDR' | 'Family VIP') => {
    onUpdateUser({ plan: planName });
    setShowPlanModal(false);
    onShowToast(`Subscription upgraded to ${planName}!`);
  };

  const handleSavePreferences = () => {
    onUpdateUser({
      autoplayNext: autoplay,
      preferredQuality: qualityPref,
      preferredAudio: audioPref,
    });
    onShowToast('Streaming preferences saved.');
  };

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-16 px-4 md:px-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Profile Overview Card */}
      <div className="bg-[#1a1c1c] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c0342c]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left z-10">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-[#ffb4aa] shadow-xl p-0.5 relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
            {isAdmin && (
              <span className="absolute bottom-0 right-0 w-6 h-6 bg-[#c0342c] rounded-full border-2 border-black flex items-center justify-center text-xs">
                👑
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className="font-display font-bold text-2xl md:text-3xl text-white">
                {user.name}
              </h1>
              {isAdmin ? (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#c0342c] text-white uppercase tracking-wide shadow-sm">
                  Super Admin
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#c0342c]/20 text-[#ffb4aa] border border-[#c0342c]/30">
                  Subscriber
                </span>
              )}
            </div>
            <p className="text-sm text-white/60 mt-0.5 font-mono">{user.email}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20 px-3 py-1 rounded-full">
                <Crown className="w-3.5 h-3.5" />
                <span>{user.plan}</span>
              </span>
              <span className="text-xs text-white/40">
                Renewal: {user.nextBillingDate}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            id="btn-manage-subscription"
            onClick={() => setShowPlanModal(true)}
            className="accent-amber font-bold text-sm px-5 py-3 rounded-full hover:opacity-95 active:scale-95 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Crown className="w-4 h-4" />
            <span>Change Plan</span>
          </button>

          <button
            id="btn-profile-switch"
            onClick={onOpenLogin}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-4 py-3 rounded-full active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-white/10"
            title="Switch Account / Sign in"
          >
            <User className="w-4 h-4 text-[#ffb4aa]" />
            <span>Switch Account</span>
          </button>
        </div>
      </div>

      {/* Plan Details & Features Matrix */}
      <section className="bg-[#1e2020] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg md:text-xl text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#ffb4aa]" />
            <span>Active Entitlement & Plan Details</span>
          </h2>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Active / Good Standing
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <p className="text-xs text-white/40 font-semibold uppercase">Max Resolution</p>
            <p className="font-bold text-white text-base">4K Ultra HD & Dolby Vision</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <p className="text-xs text-white/40 font-semibold uppercase">Concurrent Streams</p>
            <p className="font-bold text-white text-base">4 Devices at once</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <p className="text-xs text-white/40 font-semibold uppercase">Spatial Audio</p>
            <p className="font-bold text-white text-base">Dolby Atmos enabled</p>
          </div>
        </div>
      </section>

      {/* Streaming & Playback Preferences */}
      <section className="bg-[#1e2020] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
        <h2 className="font-display font-bold text-lg md:text-xl text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#ffb4aa]" />
          <span>Playback & Streaming Settings</span>
        </h2>

        <div className="space-y-4 divide-y divide-white/10 text-sm">
          {/* Default Quality */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
            <div>
              <p className="font-semibold text-white">Default Video Quality</p>
              <p className="text-xs text-white/50">Higher quality uses more network bandwidth.</p>
            </div>
            <select
              value={qualityPref}
              onChange={(e) => {
                setQualityPref(e.target.value as any);
                onUpdateUser({ preferredQuality: e.target.value as any });
              }}
              className="bg-[#292a2b] border border-white/15 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#ffb4aa]"
            >
              <option value="Auto">Auto (Adaptive Bitrate)</option>
              <option value="4K">4K Ultra HD (Best Quality)</option>
              <option value="1080p">1080p Full HD</option>
              <option value="720p">720p (Data Saver)</option>
            </select>
          </div>

          {/* Autoplay Next */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="font-semibold text-white">Autoplay Next Episode</p>
              <p className="text-xs text-white/50">Automatically starts the next episode in a series.</p>
            </div>
            <button
              onClick={() => {
                const next = !autoplay;
                setAutoplay(next);
                onUpdateUser({ autoplayNext: next });
              }}
              className="text-[#ffb4aa] focus:outline-none cursor-pointer"
            >
              {autoplay ? (
                <ToggleRight className="w-8 h-8 text-[#ffb4aa]" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-white/40" />
              )}
            </button>
          </div>

          {/* Audio Language */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4">
            <div>
              <p className="font-semibold text-white">Default Audio Track</p>
              <p className="text-xs text-white/50">Preferred language for movies and series.</p>
            </div>
            <select
              value={audioPref}
              onChange={(e) => {
                setAudioPref(e.target.value);
                onUpdateUser({ preferredAudio: e.target.value });
              }}
              className="bg-[#292a2b] border border-white/15 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#ffb4aa]"
            >
              <option value="English (Dolby Atmos 5.1)">English (Dolby Atmos 5.1)</option>
              <option value="Spanish (Latin America)">Spanish (Latin America)</option>
              <option value="French (Paris)">French</option>
              <option value="Japanese (Original Audio)">Japanese (Original Audio)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Security & Node Footer */}
      <div className="pt-4 pb-2 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Encrypted Stream Node (Edge v2.6.4)</span>
        </div>
        <div className="text-[11px] text-white/30">
          <span>Whoosh Cinema Network • Ultra HD Streaming</span>
        </div>
      </div>

      {/* Plan Selection Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1a1c1c] border border-white/15 rounded-3xl p-6 md:p-8 max-w-3xl w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="font-display font-bold text-xl md:text-2xl text-white">
                  Select Your Streaming Plan
                </h3>
                <p className="text-xs md:text-sm text-white/60">
                  Switch or cancel anytime. High-performance adaptive bitrate included.
                </p>
              </div>
              <button
                onClick={() => setShowPlanModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((p) => (
                <div
                  key={p.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                    user.plan === p.id
                      ? 'bg-[#c0342c]/15 border-[#c0342c] shadow-[0_0_20px_rgba(192,52,44,0.3)]'
                      : 'bg-[#1e2020] border-white/10 hover:border-white/30'
                  }`}
                >
                  <div>
                    {p.isPopular && (
                      <span className="inline-block mb-2 px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#f59e0b] text-[#1e293b] uppercase">
                        Most Popular
                      </span>
                    )}
                    <h4 className="font-display font-bold text-lg text-white">{p.name}</h4>
                    <p className="text-xl font-extrabold text-[#ffb4aa] mt-1">{p.price}</p>
                    <p className="text-xs text-white/60 mt-1 font-medium">{p.resolution}</p>
                    <p className="text-xs text-white/40 mb-4">{p.devices}</p>

                    <ul className="space-y-2 text-xs text-white/70 mb-6">
                      {p.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#ffb4aa] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleSelectPlan(p.id as any)}
                    className={`w-full py-2.5 rounded-full font-bold text-xs transition-all ${
                      user.plan === p.id
                        ? 'bg-white/20 text-white cursor-default'
                        : 'bg-[#c0342c] hover:bg-[#d44339] text-white shadow-md cursor-pointer'
                    }`}
                  >
                    {user.plan === p.id ? 'Current Plan' : 'Select Plan'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
