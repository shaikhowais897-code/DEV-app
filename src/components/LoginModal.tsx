import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Crown,
  Shield,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Film,
  Zap
} from 'lucide-react';
import { UserProfile } from '../types';
import { MOCK_USERS_DATABASE, DEFAULT_ADMIN_PASSWORD } from '../data/movies';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  onShowToast: (message: string) => void;
  allUsers: UserProfile[];
  onOpenAdmin?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
  onShowToast,
  allUsers,
  onOpenAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'email' | 'signup'>('quick');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'Free' | 'Premium 4K HDR' | 'Family VIP'>('Premium 4K HDR');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuickLogin = (user: UserProfile) => {
    onSelectUser(user);
    onClose();
    if (user.role === 'admin') {
      onShowToast(`Welcome, ${user.name}! Admin privileges enabled.`);
    } else {
      onShowToast(`Welcome back, ${user.name}! (${user.plan})`);
    }
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      onShowToast('Please enter your email address');
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Check if user exists
      const existingUser = allUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (existingUser) {
        onSelectUser(existingUser);
        onClose();
        if (existingUser.role === 'admin') {
          onShowToast(`Admin login successful: ${existingUser.name}`);
        } else {
          onShowToast(`Logged in successfully as ${existingUser.name}`);
        }
      } else {
        // Create dynamic user session
        const isEmailAdmin = email.toLowerCase().includes('admin') || email.toLowerCase() === 'shaikhowais897@gmail.com';
        const newUser: UserProfile = {
          id: `usr_${Date.now()}`,
          name: email.split('@')[0],
          email: email.trim(),
          role: isEmailAdmin ? 'admin' : 'user',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR7lKQ21WOMNWd0WsFyOKO1Hs6iVcjjnv2G7YbXUI8DIZoLLPHilMOXDzjMcAuF8QaK5rmVXp5QVdjDCi4XNWiShC_RVD5sS2hDHPPz4CmUjcVf6mD7vZcKvYtJRH9aI6z7bof_ygaKqr1Fs200jE_ccFWlGQ_PkislREiB4RTf2bXFJcojtQGULypbKyZPQJzypKhsAMFjXXUC4g5KfiS2vAxlC7sVnts3ID1HY9QMxFM4iY8zI1ofA',
          plan: 'Premium 4K HDR',
          billingStatus: 'Active',
          nextBillingDate: 'Sept 20, 2026',
          preferredQuality: 'Auto',
          preferredAudio: 'English (Dolby Atmos 5.1)',
          preferredSubtitle: 'English',
          autoplayNext: true,
        };
        onSelectUser(newUser);
        onClose();
        onShowToast(`Signed in as ${newUser.email}`);
      }
    }, 600);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      onShowToast('Please complete all required fields');
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const isEmailAdmin = email.toLowerCase() === 'shaikhowais897@gmail.com';
      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        role: isEmailAdmin ? 'admin' : 'user',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR7lKQ21WOMNWd0WsFyOKO1Hs6iVcjjnv2G7YbXUI8DIZoLLPHilMOXDzjMcAuF8QaK5rmVXp5QVdjDCi4XNWiShC_RVD5sS2hDHPPz4CmUjcVf6mD7vZcKvYtJRH9aI6z7bof_ygaKqr1Fs200jE_ccFWlGQ_PkislREiB4RTf2bXFJcojtQGULypbKyZPQJzypKhsAMFjXXUC4g5KfiS2vAxlC7sVnts3ID1HY9QMxFM4iY8zI1ofA',
        plan: selectedPlan,
        billingStatus: 'Active',
        nextBillingDate: 'Oct 01, 2026',
        monthlyFee: selectedPlan === 'Family VIP' ? '$19.99' : selectedPlan === 'Premium 4K HDR' ? '$14.99' : '$0.00',
        joinedDate: 'Just now',
        watchHours: 0,
        activeDevices: 1,
        preferredQuality: 'Auto',
        preferredAudio: 'English (Dolby Atmos 5.1)',
        preferredSubtitle: 'English',
        autoplayNext: true,
      };

      onSelectUser(newUser);
      onClose();
      onShowToast(`Account created! Welcome to Whoosh Cinema, ${newUser.name}!`);
    }, 600);
  };

  const handleAutofillAdmin = () => {
    setEmail('shaikhowais897@gmail.com');
    setPassword(DEFAULT_ADMIN_PASSWORD);
    setActiveTab('email');
  };

  const handleAutofillSubscriber = () => {
    setEmail('elena.r@stream.net');
    setPassword('subscriber2026!');
    setActiveTab('email');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto font-sans">
      <div className="bg-[#181a1b] border border-white/15 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#202223] via-[#1a1c1d] to-[#202223] border-b border-white/10 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#c0342c] to-[#f59e0b] flex items-center justify-center shadow-lg shadow-[#c0342c]/30">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-xl text-white tracking-tight">
                  Whoosh Sign In
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#c0342c]/20 text-[#ffb4aa] border border-[#c0342c]/30">
                  4K HDR
                </span>
              </div>
              <p className="text-xs text-[#e2beba]/80">
                Access your streaming library, subscription tier & master admin
              </p>
            </div>
          </div>

          <button
            id="btn-close-login-modal"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#141516] p-1.5 gap-1.5 px-6">
          <button
            id="tab-quick-login"
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'quick'
                ? 'bg-gradient-to-r from-[#c0342c] to-[#a32a23] text-white shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>1-Click Switcher</span>
          </button>
          <button
            id="tab-email-login"
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'email'
                ? 'bg-gradient-to-r from-[#c0342c] to-[#a32a23] text-white shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Sign In</span>
          </button>
          <button
            id="tab-signup"
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'signup'
                ? 'bg-gradient-to-r from-[#c0342c] to-[#a32a23] text-white shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* TAB 1: 1-Click Fast Switcher */}
          {activeTab === 'quick' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white/50">
                  Select a Profile to Switch Instantly
                </span>
                <span className="text-[11px] text-[#ffb964] font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> No password required
                </span>
              </div>

              {/* Master Admin Card */}
              {allUsers
                .filter((u) => u.role === 'admin')
                .map((adminUser) => (
                  <button
                    key={adminUser.id}
                    id={`btn-login-user-${adminUser.id}`}
                    onClick={() => handleQuickLogin(adminUser)}
                    className="w-full group p-4 rounded-2xl bg-gradient-to-r from-[#c0342c]/20 via-[#26201f] to-[#1e1e1e] border-2 border-[#c0342c]/60 hover:border-[#ffb4aa] hover:shadow-[0_0_20px_rgba(192,52,44,0.3)] transition-all flex items-center justify-between text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <img
                          src={adminUser.avatar}
                          alt={adminUser.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#ffb4aa]"
                        />
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#c0342c] text-white flex items-center justify-center shadow">
                          <Crown className="w-3 h-3 text-white" />
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-base group-hover:text-[#ffb4aa] transition-colors">
                            {adminUser.name}
                          </h4>
                          <span className="px-2 py-0.5 bg-[#c0342c] text-white text-[10px] font-black rounded-full uppercase tracking-wide">
                            👑 Master Account
                          </span>
                        </div>
                        <p className="text-xs text-[#e2beba]/80 font-mono mt-0.5">
                          {adminUser.email}
                        </p>
                        <p className="text-[11px] text-[#ffb964] mt-1 font-semibold flex items-center gap-1">
                          <Crown className="w-3 h-3" /> Premium 4K HDR • VIP Tier
                        </p>
                      </div>
                    </div>

                    <div className="px-3 py-1.5 bg-[#c0342c] text-white rounded-xl text-xs font-bold group-hover:bg-[#ffb4aa] group-hover:text-[#121414] transition-all flex items-center gap-1">
                      <span>Login</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}

              {/* Standard Subscribers List */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
                  Subscribed Members
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {allUsers
                    .filter((u) => u.role !== 'admin')
                    .map((member) => (
                      <button
                        key={member.id}
                        id={`btn-login-user-${member.id}`}
                        onClick={() => handleQuickLogin(member)}
                        className={`p-3 rounded-xl bg-[#1f2122] border transition-all flex items-center justify-between text-left cursor-pointer hover:scale-[1.02] ${
                          currentUser.id === member.id
                            ? 'border-[#ffb4aa] bg-[#2a2323]'
                            : 'border-white/10 hover:border-white/20 hover:bg-[#252829]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-9 h-9 rounded-full object-cover border border-white/20 shrink-0"
                          />
                          <div className="overflow-hidden">
                            <h5 className="font-bold text-white text-xs truncate">
                              {member.name}
                            </h5>
                            <span
                              className={`text-[10px] font-bold ${
                                member.plan === 'Family VIP'
                                  ? 'text-[#f59e0b]'
                                  : member.plan === 'Premium 4K HDR'
                                  ? 'text-[#ffb4aa]'
                                  : 'text-white/60'
                              }`}
                            >
                              {member.plan}
                            </span>
                          </div>
                        </div>

                        {currentUser.id === member.id && (
                          <span className="text-[10px] text-[#ffb4aa] font-bold bg-[#c0342c]/30 px-2 py-0.5 rounded-full shrink-0">
                            Active
                          </span>
                        )}
                      </button>
                    ))}
                </div>
              </div>

              {/* Quick Preset Autofill Banner */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                <span>Want to test password authentication?</span>
                <button
                  onClick={handleAutofillAdmin}
                  className="text-[#ffb4aa] hover:underline font-semibold cursor-pointer"
                >
                  Autofill Admin Email & Pass →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Email & Password Sign In */}
          {activeTab === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              {/* Quick Fill Pills */}
              <div className="flex items-center gap-2 pb-2">
                <span className="text-xs text-white/50">Quick Autofill:</span>
                <button
                  type="button"
                  onClick={handleAutofillAdmin}
                  className="px-2.5 py-1 bg-[#c0342c]/20 hover:bg-[#c0342c]/40 border border-[#c0342c]/40 text-[#ffb4aa] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  👑 Admin (Shaikh Owais)
                </button>
                <button
                  type="button"
                  onClick={handleAutofillSubscriber}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/15 border border-white/15 text-white/80 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  💎 Subscriber (Elena)
                </button>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-white/70">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. shaikhowais897@gmail.com"
                    className="w-full bg-[#131415] border border-white/15 focus:border-[#ffb4aa] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/70">
                    Password
                  </label>
                  <span className="text-[11px] text-[#ffb964]">
                    Master Admin Pass: <code className="font-mono bg-black/40 px-1 py-0.5 rounded">{DEFAULT_ADMIN_PASSWORD}</code>
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account or admin password"
                    className="w-full bg-[#131415] border border-white/15 focus:border-[#ffb4aa] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-[#131415] border-white/20 text-[#c0342c] focus:ring-0 cursor-pointer"
                  />
                  <span>Remember my login session</span>
                </label>
                <span className="text-white/40">Secure TLS 1.3</span>
              </div>

              {/* Submit Button */}
              <button
                id="btn-submit-email-login"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-[#c0342c] to-[#e6392f] hover:from-[#d13a30] hover:to-[#f0453a] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#c0342c]/30 hover:shadow-[#c0342c]/50 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <span className="animate-pulse">Authenticating session...</span>
                ) : (
                  <>
                    <span>Sign In to Whoosh</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: Create New Account */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-white/70">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-signup-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Shaikh Owais"
                    className="w-full bg-[#131415] border border-white/15 focus:border-[#ffb4aa] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-white/70">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. shaikhowais897@gmail.com"
                    className="w-full bg-[#131415] border border-white/15 focus:border-[#ffb4aa] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Plan Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-white/70">
                  Select Subscription Plan
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Free', name: 'Free', price: '$0.00' },
                    { id: 'Premium 4K HDR', name: 'Premium 4K', price: '$14.99' },
                    { id: 'Family VIP', name: 'Family VIP', price: '$19.99' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPlan(p.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedPlan === p.id
                          ? 'border-[#ffb4aa] bg-[#c0342c]/20 text-white'
                          : 'border-white/10 bg-[#131415] text-white/60 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{p.name}</div>
                      <div className="text-[11px] text-[#ffb964] font-medium">{p.price}/mo</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                id="btn-submit-signup"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-[#c0342c] to-[#e6392f] hover:from-[#d13a30] hover:to-[#f0453a] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#c0342c]/30 hover:shadow-[#c0342c]/50 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                {isLoading ? (
                  <span className="animate-pulse">Setting up profile...</span>
                ) : (
                  <>
                    <span>Create Account & Start Streaming</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
