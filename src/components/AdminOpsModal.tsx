import React, { useState, useRef } from 'react';
import {
  Server,
  Activity,
  Layers,
  Database,
  Cpu,
  RefreshCw,
  Plus,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Radio,
  Wifi,
  Shield,
  FileText,
  X,
  Users,
  Film,
  Tv,
  Upload,
  Sparkles,
  Lock,
  Unlock,
  Key,
  Copy,
  Check,
  Crown,
  CreditCard,
  Trash2,
  Edit,
  Eye,
  Sliders,
  DollarSign,
  TrendingUp,
  Tag,
  Star,
  Clapperboard,
  Search,
  ExternalLink,
  ChevronRight,
  Image,
  ImageIcon,
  UploadCloud,
  FolderPlus,
  Crop,
  Maximize2,
  SlidersHorizontal,
  RotateCcw,
  CheckCircle,
  UserPlus,
  UserCheck,
  UserMinus,
  AlertCircle,
  Filter,
  CheckSquare,
  Square,
  User,
  FolderX,
  Trash,
} from 'lucide-react';
import { Movie, UserProfile, MediaJob, AuditEvent, SeriesEpisode, CastMember } from '../types';
import { MOCK_MEDIA_JOBS, MOCK_AUDIT_LOGS, DEFAULT_ADMIN_PASSWORD, enrichMovieWithRatings } from '../data/movies';

interface AdminOpsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onUpdateUsers: (users: UserProfile[]) => void;
  movies: Movie[];
  onAddMovie: (newMovie: Movie) => void;
  onUpdateMovie?: (updatedMovie: Movie) => void;
  onDeleteMovie: (movieId: string) => void;
  onToggleFeatureMovie: (movieId: string) => void;
  onSelectMovie: (movie: Movie) => void;
  onPlayMovie: (movie: Movie) => void;
  onShowToast: (message: string) => void;
}

// Preset High-Resolution Cast & Crew Avatars (Portraits)
const CAST_AVATAR_PRESETS = [
  {
    name: 'Shaikh Owais',
    role: 'Director & Executive Producer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Elena Rostova',
    role: 'Lead Protagonist',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Marcus Vance',
    role: 'Supporting Actor / Special Agent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Aria Chen',
    role: 'Lead Scientist / Co-Star',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Darius Thorne',
    role: 'Primary Antagonist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Sophia Martinez',
    role: 'Director of Photography',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Kenji Sato',
    role: 'Composer & Sound Design',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Zoe Sterling',
    role: 'Stunt Coordinator',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
  },
];

// Preset High-Resolution Vertical Movie Posters (2:3 Aspect Ratio)
const POSTER_PRESETS = [
  {
    name: 'Cyberpunk Neon Matrix (2:3)',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    theme: 'Cyberpunk Sci-Fi',
  },
  {
    name: 'Cosmic Stellar Odyssey (2:3)',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
    theme: 'Space Sci-Fi',
  },
  {
    name: 'Gotham Dark Knight Shadow (2:3)',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    theme: 'Dark Noir Thriller',
  },
  {
    name: 'Anime Tokyo Twilight (2:3)',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    theme: 'Anime Fantasy',
  },
  {
    name: 'Deep Oceanic Trench (2:3)',
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
    theme: 'Underwater Mystery',
  },
  {
    name: 'Synthwave Sunset Overdrive (2:3)',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    theme: 'Retro Synthwave',
  },
  {
    name: 'Quantum Cyber Protocol (2:3)',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    theme: 'Techno Thriller',
  },
  {
    name: 'Mythic Castle Fantasy (2:3)',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    theme: 'Epic Fantasy',
  },
];

// Preset High-Resolution Cinematic Backdrops (16:9 Landscape Ratio)
const BACKDROP_PRESETS = [
  {
    name: 'Cyberpunk Neon Metropolis (16:9)',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHX0QhO_zW3uJ4fO3oE_R6dZ4yXN606U16hN1l2wD94lE9OWOiSbzNyHH0kE2UXQHGJkgr9zQw',
    genre: ['Sci-Fi', 'Action', 'Cyberpunk'],
  },
  {
    name: 'Deep Space Supernova (16:9)',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYxAoIL2F1MEFlp2el4z7snk5ErabdpYt93Iuipa0SradRs-UVCLNubTrXUgHOEOedXnaoax4vMzRqDcU3rFW0D1sVU9DInnZF10DAST7r0lroTgHjdzIoM1pr7haqrJhlvmwAAy6PcP6vqkJ0jrQ5R7SWXCMMetjsGvG7WXmBxshjXMciqzyECL0pXssQG-Bq0o5GLgs5vdeim7uU8JNjrLzVPA679M8OdOY5V_FE-3-UxUJFykuz2w',
    genre: ['Sci-Fi', 'Adventure'],
  },
  {
    name: 'Dark Knight Gotham Noir (16:9)',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8D3R75i2tIq_4Z4aL9cZ4YvYtW5i0R9m7L5k2J4u8V2o6I1t0N7x9Z8w0K1v9B3o0Q7j4H8s2A3f7D1k2G4c9M0v1P2s4U8y0E4r6I9u2X7z9C1a3F5h7K9o',
    genre: ['Crime', 'Thriller', 'Action'],
  },
  {
    name: 'Fantasy Mythic Castle (16:9)',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfX2ABZz9DIQ1PJiuwTnU0-8bbFXHT1ZMTzPBt8ZhI5xuZCfry1goKEJXLvIzEk1vSC1z5J_mTE0HSGzhW_uS2iQl197PlApKeEbtjBgwPMTpvQny-Cay4syTnKsZb5rVuoHf61APTvpJVm8l2FcUFCebIh0ATbqD6zz9x7Cngv_zgKw8ovgPC_PDZQucN_TqhTiZh97Mx9SBKPIWKY8n7ojzrhaGu97qIBtBNQYCK3ZvStD1nr1utAA',
    genre: ['Fantasy', 'Adventure', 'Drama'],
  },
  {
    name: 'Anime Tokyo Twilight (16:9)',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhV1PBiGWI7b1dRcYkD-4mBC_TkJQsad-FzK5iARgdLwngDTKcO1yOD2RlBaGFjCvxkz3f8nPcHMqNrfiMza9CKnpZx46jufLu24SSySiwCOmJKITMIpcq8fCak3eQfxlJ-YVX5bXwj3vDyVIeE7TX5TNdkUFFrqRAvis0PhRXi7u9Ufc3KJ-TYDIy6LPbug6QIcidSbByUXv2HKzavcDfA0ZluyaQ--QwKcvSUpktd3bpBrd5PElFhQ',
    genre: ['Animation', 'Fantasy', 'Sci-Fi'],
  },
  {
    name: 'Deep Ocean Trench Abyss (16:9)',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ6BFGn1HlrXLoAre0UgL-G3EWxmN5-zXI4ShMQITc5KlJXTLJWOhbaIn5f52eH66sItdVNKP1K9ekb8kbqLoEaGiOAVLe4EYFK2cabAvZn7UJcuOzN6zhThlsdS3oLvyVEBRtxHPwQrBqPLvO5ZuoVz5EWh87wu3s6vZXQLuKMFG1Lr_41MZ8vQ8chZv-XQqmJkW2VUl_zp0IJq0T57oEnzMZOupmm3PU6H4n5BS7eJzPieqdbSD6ZQ',
    genre: ['Horror', 'Sci-Fi', 'Thriller'],
  },
];

// Video Stream Presets
const VIDEO_STREAM_PRESETS = [
  { name: 'Tears of Steel 4K (CMAF / H.265)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
  { name: 'Big Buck Bunny 60fps (1080p Master)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  { name: 'Sintel 4K Cinema Master (Dolby 5.1)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' },
  { name: 'Elephants Dream (AV1 High-Profile)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
];

export const AdminOpsModal: React.FC<AdminOpsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allUsers,
  onUpdateUsers,
  movies,
  onAddMovie,
  onUpdateMovie,
  onDeleteMovie,
  onToggleFeatureMovie,
  onSelectMovie,
  onPlayMovie,
  onShowToast,
}) => {
  // Security Gate State
  const [adminPassword, setAdminPassword] = useState(DEFAULT_ADMIN_PASSWORD);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(currentUser.role === 'admin' || currentUser.email === 'shaikhowais897@gmail.com');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  // Active Panel Tab
  const [activeTab, setActiveTab] = useState<'users' | 'upload' | 'studio' | 'catalog' | 'ops'>('upload');

  // Users Management State
  const [userSearch, setUserSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<'All' | 'Free' | 'Premium 4K HDR' | 'Family VIP'>('All');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPlan, setNewUserPlan] = useState<'Free' | 'Premium 4K HDR' | 'Family VIP'>('Premium 4K HDR');
  const [newUserStatus, setNewUserStatus] = useState<'Active' | 'Trial' | 'Suspended'>('Active');

  // Upload Form State
  const [contentType, setContentType] = useState<'movie' | 'series' | 'anime'>('movie');
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [year, setYear] = useState(2026);
  const [duration, setDuration] = useState('2h 15m');
  const [ageRating, setAgeRating] = useState('PG-13');
  const [matchScore, setMatchScore] = useState(98);
  const [accessLevel, setAccessLevel] = useState<'free' | 'premium'>('premium');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Sci-Fi', 'Action']);
  const [selectedBadges, setSelectedBadges] = useState<string[]>(['4K Ultra HD', 'Dolby Vision', 'Dolby Atmos']);
  const [videoUrl, setVideoUrl] = useState(VIDEO_STREAM_PRESETS[0].url);
  const [backdropUrl, setBackdropUrl] = useState(BACKDROP_PRESETS[0].url);
  const [posterUrl, setPosterUrl] = useState(POSTER_PRESETS[0].url);
  const [director, setDirector] = useState('Shaikh Owais');
  const [isFeatured, setIsFeatured] = useState(true);

  // Cast and Crew Roster State for Uploading
  const [castList, setCastList] = useState<CastMember[]>([
    {
      name: 'Shaikh Owais',
      role: 'Director & Executive Producer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Elena Rostova',
      role: 'Lead Protagonist',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Marcus Vance',
      role: 'Co-Star / Special Agent',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    },
  ]);
  const [newCastName, setNewCastName] = useState('');
  const [newCastRole, setNewCastRole] = useState('Lead Actor');
  const [newCastAvatar, setNewCastAvatar] = useState(CAST_AVATAR_PRESETS[1].avatar);
  const [isDraggingCast, setIsDraggingCast] = useState(false);
  const [castFileName, setCastFileName] = useState('');
  const [editingCastIndex, setEditingCastIndex] = useState<number | null>(null);
  const castFileInputRef = useRef<HTMLInputElement>(null);

  // Catalog Management & Removal State
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  const [selectedMovieIdsForPurge, setSelectedMovieIdsForPurge] = useState<string[]>([]);
  const [showBatchDeleteConfirm, setShowBatchDeleteConfirm] = useState(false);
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');
  const [catalogTypeFilter, setCatalogTypeFilter] = useState<'all' | 'movie' | 'series' | 'anime'>('all');
  const [showRemovalPanel, setShowRemovalPanel] = useState(false);

  // Drag and drop & File State
  const [isDraggingPoster, setIsDraggingPoster] = useState(false);
  const [isDraggingBackdrop, setIsDraggingBackdrop] = useState(false);
  const [isDraggingStudio, setIsDraggingStudio] = useState(false);
  const [posterFileName, setPosterFileName] = useState<string>('');
  const [backdropFileName, setBackdropFileName] = useState<string>('');
  const [posterFileSize, setPosterFileSize] = useState<string>('');
  const [backdropFileSize, setBackdropFileSize] = useState<string>('');

  const posterFileInputRef = useRef<HTMLInputElement>(null);
  const backdropFileInputRef = useRef<HTMLInputElement>(null);
  const studioFileInputRef = useRef<HTMLInputElement>(null);

  // Poster Studio State
  const [studioCustomImage, setStudioCustomImage] = useState<string>(POSTER_PRESETS[0].url);
  const [studioSelectedMovieId, setStudioSelectedMovieId] = useState<string>(movies[0]?.id || '');
  const [studioTargetType, setStudioTargetType] = useState<'poster' | 'backdrop' | 'both'>('poster');
  const [studioRatio, setStudioRatio] = useState<'2:3' | '16:9'>('2:3');
  const [studioCustomTitle, setStudioCustomTitle] = useState('CYBER HORIZON 2099');
  const [studioCustomTagline, setStudioCustomTagline] = useState('The future has arrived in 4K HDR');
  const [studioShowOverlays, setStudioShowOverlays] = useState(true);

  // Poster change quick modal for catalog
  const [editingMoviePoster, setEditingMoviePoster] = useState<Movie | null>(null);
  const [quickPosterUrl, setQuickPosterUrl] = useState<string>('');
  const [quickBackdropUrl, setQuickBackdropUrl] = useState<string>('');

  // Series Specific State
  const [seasonsCount, setSeasonsCount] = useState(1);
  const [episodes, setEpisodes] = useState<SeriesEpisode[]>([
    {
      id: 'ep-01',
      episodeNumber: 1,
      seasonNumber: 1,
      title: 'Chapter I: The Genesis Code',
      duration: '54m',
      durationSeconds: 3240,
      synopsis: 'A clandestine signal from deep space triggers a planetary shutdown.',
      videoUrl: VIDEO_STREAM_PRESETS[0].url,
    },
    {
      id: 'ep-02',
      episodeNumber: 2,
      seasonNumber: 1,
      title: 'Chapter II: Ghost in the Quantum Lattice',
      duration: '49m',
      durationSeconds: 2940,
      synopsis: 'As encryption protocols fail, investigators breach the central core.',
      videoUrl: VIDEO_STREAM_PRESETS[1].url,
    },
  ]);

  // Cloud Ops Jobs
  const [jobs, setJobs] = useState<MediaJob[]>(MOCK_MEDIA_JOBS);
  const [isProcessing, setIsProcessing] = useState(false);

  // Esc key listener for instant secluded lock & exit
  React.useEffect(() => {
    const handleModalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleModalKeyDown);
    return () => window.removeEventListener('keydown', handleModalKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLockAndConceal = () => {
    setIsUnlocked(false);
    setEnteredPassword('');
    onClose();
    onShowToast('🔒 Admin Console Locked & Concealed');
  };

  const handleUnlockGate = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPassword === adminPassword || enteredPassword === DEFAULT_ADMIN_PASSWORD) {
      setIsUnlocked(true);
      onShowToast('👑 Admin Master Access Unlocked!');
    } else {
      onShowToast('❌ Incorrect Admin Password. Please verify and try again.');
    }
  };

  const handleOneClickAdminUnlock = () => {
    setIsUnlocked(true);
    onShowToast('👑 Verified Admin Session Unlocked (Shaikh Owais)');
  };

  const handleCopyPassword = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(adminPassword);
    }
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
    onShowToast('Master Password copied to clipboard!');
  };

  // User Management Actions
  const handleUpdateUserPlan = (userId: string, newPlan: 'Free' | 'Premium 4K HDR' | 'Family VIP') => {
    const updated = allUsers.map((u) => {
      if (u.id === userId) {
        const fee = newPlan === 'Family VIP' ? '$19.99' : newPlan === 'Premium 4K HDR' ? '$14.99' : '$0.00';
        return { ...u, plan: newPlan, monthlyFee: fee };
      }
      return u;
    });
    onUpdateUsers(updated);
    onShowToast(`Updated user plan to ${newPlan}`);
  };

  const handleUpdateUserStatus = (userId: string, newStatus: 'Active' | 'Trial' | 'Expired' | 'Suspended') => {
    const updated = allUsers.map((u) => (u.id === userId ? { ...u, billingStatus: newStatus } : u));
    onUpdateUsers(updated);
    onShowToast(`User billing status changed to ${newStatus}`);
  };

  const handleToggleUserAdmin = (userId: string) => {
    const updated = allUsers.map((u) => {
      if (u.id === userId) {
        const newRole: 'admin' | 'user' = u.role === 'admin' ? 'user' : 'admin';
        return { ...u, role: newRole };
      }
      return u;
    });
    onUpdateUsers(updated);
    onShowToast(`User role toggled.`);
  };

  // Image File Processors & Drag-Drop Handlers
  const processImageFile = (file: File, target: 'poster' | 'backdrop' | 'studio' | 'cast') => {
    if (!file.type.startsWith('image/')) {
      onShowToast('❌ Invalid format. Please upload an image (PNG, JPG, WEBP, AVIF).');
      return;
    }

    const sizeFormatted = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${(file.size / 1024).toFixed(0)} KB`;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      if (target === 'poster') {
        setPosterUrl(dataUrl);
        setPosterFileName(file.name);
        setPosterFileSize(sizeFormatted);
        onShowToast(`📸 Loaded Movie Poster: ${file.name} (${sizeFormatted})`);
      } else if (target === 'backdrop') {
        setBackdropUrl(dataUrl);
        setBackdropFileName(file.name);
        setBackdropFileSize(sizeFormatted);
        onShowToast(`🎬 Loaded Backdrop Artwork: ${file.name} (${sizeFormatted})`);
      } else if (target === 'studio') {
        setStudioCustomImage(dataUrl);
        onShowToast(`🎨 Studio Poster Ready: ${file.name} (${sizeFormatted})`);
      } else if (target === 'cast') {
        setNewCastAvatar(dataUrl);
        setCastFileName(file.name);
        onShowToast(`👤 Loaded Cast Avatar: ${file.name} (${sizeFormatted})`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePosterDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingPoster(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0], 'poster');
    }
  };

  const handleBackdropDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingBackdrop(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0], 'backdrop');
    }
  };

  const handleStudioDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingStudio(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0], 'studio');
    }
  };

  const handleCastDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingCast(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0], 'cast');
    }
  };

  // Cast & Crew Management Helpers
  const handleAddOrUpdateCastMember = () => {
    if (!newCastName.trim() || !newCastRole.trim()) {
      onShowToast('Please enter both the name and role of the cast/crew member.');
      return;
    }

    const member: CastMember = {
      name: newCastName.trim(),
      role: newCastRole.trim(),
      avatar: newCastAvatar.trim() || CAST_AVATAR_PRESETS[0].avatar,
    };

    if (editingCastIndex !== null && editingCastIndex >= 0 && editingCastIndex < castList.length) {
      const updated = [...castList];
      updated[editingCastIndex] = member;
      setCastList(updated);
      setEditingCastIndex(null);
      onShowToast(`✨ Updated credits for "${member.name}"`);
    } else {
      setCastList([...castList, member]);
      onShowToast(`🌟 Added "${member.name}" (${member.role}) to cast roster!`);
    }

    // Reset input fields
    setNewCastName('');
    setNewCastRole('Supporting Actor');
    setCastFileName('');
  };

  const handleEditCastMember = (index: number) => {
    const member = castList[index];
    if (!member) return;
    setEditingCastIndex(index);
    setNewCastName(member.name);
    setNewCastRole(member.role);
    setNewCastAvatar(member.avatar);
    onShowToast(`Editing: ${member.name}`);
  };

  const handleDeleteCastMember = (index: number) => {
    const member = castList[index];
    setCastList(castList.filter((_, i) => i !== index));
    if (editingCastIndex === index) {
      setEditingCastIndex(null);
      setNewCastName('');
    }
    onShowToast(`Removed ${member?.name || 'member'} from cast roster.`);
  };

  // Catalog Purge & Removal Handlers
  const handleToggleSelectMovieForPurge = (id: string) => {
    if (selectedMovieIdsForPurge.includes(id)) {
      setSelectedMovieIdsForPurge(selectedMovieIdsForPurge.filter((item) => item !== id));
    } else {
      setSelectedMovieIdsForPurge([...selectedMovieIdsForPurge, id]);
    }
  };

  const handleSelectAllMoviesForPurge = (filteredMovies: Movie[]) => {
    if (selectedMovieIdsForPurge.length === filteredMovies.length) {
      setSelectedMovieIdsForPurge([]);
    } else {
      setSelectedMovieIdsForPurge(filteredMovies.map((m) => m.id));
    }
  };

  const handleConfirmSingleDelete = () => {
    if (!movieToDelete) return;
    onDeleteMovie(movieToDelete.id);
    setSelectedMovieIdsForPurge(selectedMovieIdsForPurge.filter((id) => id !== movieToDelete.id));
    onShowToast(`🗑️ Permanently removed "${movieToDelete.title}" from catalog.`);
    setMovieToDelete(null);
  };

  const handleConfirmBatchDelete = () => {
    if (selectedMovieIdsForPurge.length === 0) return;
    selectedMovieIdsForPurge.forEach((id) => {
      onDeleteMovie(id);
    });
    onShowToast(`🗑️ Purged ${selectedMovieIdsForPurge.length} titles from catalog.`);
    setSelectedMovieIdsForPurge([]);
    setShowBatchDeleteConfirm(false);
  };

  const handleApplyStudioArtworkToMovie = () => {
    if (!studioSelectedMovieId) {
      onShowToast('Please select a target movie from the library.');
      return;
    }
    const targetMovie = movies.find((m) => m.id === studioSelectedMovieId);
    if (!targetMovie) {
      onShowToast('Target movie not found.');
      return;
    }

    const updatedMovie: Movie = {
      ...targetMovie,
      posterUrl: studioTargetType === 'backdrop' ? targetMovie.posterUrl : studioCustomImage,
      backdropUrl: studioTargetType === 'poster' ? targetMovie.backdropUrl : studioCustomImage,
    };

    if (onUpdateMovie) {
      onUpdateMovie(updatedMovie);
    }
    onShowToast(`✨ Successfully updated poster & artwork for "${targetMovie.title}"!`);
  };

  const handleSaveQuickPosterEdit = () => {
    if (!editingMoviePoster) return;
    const updatedMovie: Movie = {
      ...editingMoviePoster,
      posterUrl: quickPosterUrl || editingMoviePoster.posterUrl,
      backdropUrl: quickBackdropUrl || editingMoviePoster.backdropUrl,
    };

    if (onUpdateMovie) {
      onUpdateMovie(updatedMovie);
    }
    setEditingMoviePoster(null);
    onShowToast(`🎨 Saved new artwork for "${updatedMovie.title}"`);
  };

  const handleDeleteUser = (userId: string) => {
    if (allUsers.length <= 1) {
      onShowToast('Cannot delete the last remaining user account.');
      return;
    }
    const updated = allUsers.filter((u) => u.id !== userId);
    onUpdateUsers(updated);
    onShowToast('User removed from subscriber registry.');
  };

  const handleCreateNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      onShowToast('Please provide a name and email');
      return;
    }
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserEmail.toLowerCase().includes('admin') ? 'admin' : 'user',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR7lKQ21WOMNWd0WsFyOKO1Hs6iVcjjnv2G7YbXUI8DIZoLLPHilMOXDzjMcAuF8QaK5rmVXp5QVdjDCi4XNWiShC_RVD5sS2hDHPPz4CmUjcVf6mD7vZcKvYtJRH9aI6z7bof_ygaKqr1Fs200jE_ccFWlGQ_PkislREiB4RTf2bXFJcojtQGULypbKyZPQJzypKhsAMFjXXUC4g5KfiS2vAxlC7sVnts3ID1HY9QMxFM4iY8zI1ofA',
      plan: newUserPlan,
      billingStatus: newUserStatus,
      nextBillingDate: 'Oct 01, 2026',
      monthlyFee: newUserPlan === 'Family VIP' ? '$19.99' : newUserPlan === 'Premium 4K HDR' ? '$14.99' : '$0.00',
      joinedDate: 'Just now',
      watchHours: 0,
      activeDevices: 1,
      ipRegion: 'Global (Auto CDN)',
      preferredQuality: 'Auto',
      preferredAudio: 'English (Dolby Atmos 5.1)',
      preferredSubtitle: 'English',
      autoplayNext: true,
    };

    onUpdateUsers([newUser, ...allUsers]);
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    onShowToast(`Added new subscriber: ${newUser.name} (${newUser.plan})`);
  };

  // Movie Upload Actions
  const handleToggleGenre = (g: string) => {
    if (selectedGenres.includes(g)) {
      setSelectedGenres(selectedGenres.filter((item) => item !== g));
    } else {
      setSelectedGenres([...selectedGenres, g]);
    }
  };

  const handleToggleBadge = (b: string) => {
    if (selectedBadges.includes(b)) {
      setSelectedBadges(selectedBadges.filter((item) => item !== b));
    } else {
      setSelectedBadges([...selectedBadges, b]);
    }
  };

  const handleAddEpisode = () => {
    const nextNum = episodes.length + 1;
    const newEp: SeriesEpisode = {
      id: `ep-0${nextNum}`,
      episodeNumber: nextNum,
      seasonNumber: 1,
      title: `Chapter ${nextNum}: New Dawn`,
      duration: '48m',
      durationSeconds: 2880,
      synopsis: 'The team uncovers an ancient relay signal broadcasting from the edge of the galaxy.',
      videoUrl: VIDEO_STREAM_PRESETS[0].url,
    };
    setEpisodes([...episodes, newEp]);
    onShowToast(`Added Episode ${nextNum} to Series!`);
  };

  const handleUploadMovieOrSeries = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !synopsis.trim()) {
      onShowToast('Please fill out the Title and Synopsis');
      return;
    }

    const movieId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newMovie: Movie = {
      id: movieId || `title_${Date.now()}`,
      title: title.trim(),
      contentType,
      tagline: tagline.trim() || (contentType === 'series' ? 'An Original Premium Series' : 'A Whoosh Cinema Premiere'),
      synopsis: synopsis.trim(),
      year: Number(year) || 2026,
      duration: contentType === 'series' ? `Season ${seasonsCount} (${episodes.length} Ep)` : duration,
      durationSeconds: contentType === 'series' ? episodes.length * 3000 : 7800,
      rating: 5.0,
      communityRating: 5.0,
      ratingCount: 1420,
      ratingsBreakdown: {
        5: 1100,
        4: 250,
        3: 50,
        2: 15,
        1: 5,
      },
      matchScore: Number(matchScore) || 98,
      genre: selectedGenres.length > 0 ? selectedGenres : ['Sci-Fi', 'Action'],
      badges: selectedBadges.length > 0 ? selectedBadges : ['4K Ultra HD', 'Dolby Vision'],
      rankBadge: isFeatured ? '👑 Admin Premiere Pick' : undefined,
      backdropUrl: backdropUrl || BACKDROP_PRESETS[0].url,
      posterUrl: posterUrl || backdropUrl || BACKDROP_PRESETS[0].url,
      videoUrl: videoUrl || VIDEO_STREAM_PRESETS[0].url,
      director: director || (castList.find(c => c.role.toLowerCase().includes('director'))?.name) || 'Shaikh Owais',
      audioInfo: 'Dolby Atmos, 7.1 Surround, Dolby Audio',
      subtitlesInfo: 'English [CC], Spanish, French, German, Japanese, +12',
      cast: castList.length > 0 ? castList : [
        {
          name: 'Shaikh Owais',
          role: 'Executive Producer & Director',
          avatar: CAST_AVATAR_PRESETS[0].avatar,
        },
        {
          name: 'Elena Rostova',
          role: 'Lead Protagonist',
          avatar: CAST_AVATAR_PRESETS[1].avatar,
        },
      ],
      episodes: contentType === 'series' ? episodes : undefined,
      seasonsCount: contentType === 'series' ? seasonsCount : undefined,
      episodesCount: contentType === 'series' ? episodes.length : undefined,
      relatedIds: ['interstellar-voyage', 'neon-resonance'],
      accessLevel,
      isFeatured,
    };

    onAddMovie(newMovie);
    onShowToast(`🎉 Successfully published "${newMovie.title}" (${contentType.toUpperCase()}) to Whoosh Catalog!`);

    // Reset Form
    setTitle('');
    setTagline('');
    setSynopsis('');
    setActiveTab('catalog');
  };

  // Metrics Calculations
  const totalSubscribers = allUsers.length;
  const activeSubscribers = allUsers.filter((u) => u.billingStatus === 'Active').length;
  const totalMRR = allUsers.reduce((sum, u) => {
    if (u.billingStatus === 'Active') {
      const fee = u.plan === 'Family VIP' ? 19.99 : u.plan === 'Premium 4K HDR' ? 14.99 : 0;
      return sum + fee;
    }
    return sum;
  }, 0);
  const avgRevenuePerUser = activeSubscribers > 0 ? totalMRR / activeSubscribers : 0;

  // Filtered Users
  const filteredUsers = allUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesPlan = planFilter === 'All' || u.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto font-sans">
      <div className="bg-[#151718] border border-white/15 rounded-3xl max-w-6xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Panel Header */}
        <div className="bg-[#1b1e1f] border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#c0342c] to-[#f59e0b] flex items-center justify-center shadow-lg shadow-[#c0342c]/40">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-lg md:text-xl text-white tracking-tight">
                  Whoosh Private Admin Console
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#c0342c] text-white flex items-center gap-1">
                  <Crown className="w-3 h-3" /> Master Admin: Shaikh Owais
                </span>
              </div>
              <p className="text-xs text-white/50">
                Subscriber Entitlements, 4K Content Ingestion Pipeline & Cloud Edge Telemetry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isUnlocked && (
              <button
                id="btn-lock-conceal"
                onClick={handleLockAndConceal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#c0342c]/20 hover:bg-[#c0342c]/40 border border-[#c0342c]/40 text-[#ffb4aa] text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-105"
                title="Lock & Conceal Console immediately"
              >
                <Lock className="w-3.5 h-3.5 text-[#ffb4aa]" />
                <span className="hidden sm:inline">Lock & Conceal</span>
              </button>
            )}

            <button
              id="btn-close-admin-panel"
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Master Password Bar (Always visible for admin security reference & copy) */}
        <div className="bg-[#121414] border-b border-white/10 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-white/80">
            <Key className="w-4 h-4 text-[#ffb964]" />
            <span className="font-semibold text-white">Unique Master Admin Password:</span>
            <code className="bg-[#1f2122] px-2.5 py-1 rounded border border-white/15 text-[#ffb4aa] font-mono font-bold tracking-wider select-all">
              {adminPassword}
            </code>
            <button
              onClick={handleCopyPassword}
              className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors cursor-pointer"
              title="Copy Master Password"
            >
              {copiedPass ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-white/50">
              Admin Session: <strong className="text-emerald-400">Verified TLS Encrypted</strong>
            </span>
            {!isUnlocked && (
              <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold rounded-full">
                🔒 Security Locked
              </span>
            )}
          </div>
        </div>

        {/* Security Gate Check */}
        {!isUnlocked ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#c0342c]/20 border border-[#c0342c]/50 flex items-center justify-center text-[#ffb4aa] shadow-xl">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-bold font-display text-white">
                Private Admin Security Challenge
              </h3>
              <p className="text-xs text-white/60 mt-1">
                Enter the unique master password to access user subscription controls and 4K content ingestion.
              </p>
            </div>

            {/* If logged in as Shaikh Owais */}
            {currentUser.email === 'shaikhowais897@gmail.com' || currentUser.role === 'admin' ? (
              <div className="w-full bg-[#1e2020] border border-[#c0342c]/40 p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full border border-[#ffb4aa]"
                  />
                  <div className="text-left overflow-hidden">
                    <h5 className="font-bold text-white text-sm">{currentUser.name} (Admin)</h5>
                    <p className="text-[11px] text-emerald-400 font-medium">Logged-in credentials verified</p>
                  </div>
                </div>

                <button
                  id="btn-admin-one-click-unlock"
                  onClick={handleOneClickAdminUnlock}
                  className="w-full py-2.5 bg-[#c0342c] hover:bg-[#d63d34] text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Unlock className="w-4 h-4" />
                  <span>1-Click Unlock Verified Admin Session</span>
                </button>
              </div>
            ) : null}

            {/* Password Form */}
            <form onSubmit={handleUnlockGate} className="w-full space-y-3">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={enteredPassword}
                  onChange={(e) => setEnteredPassword(e.target.value)}
                  placeholder={`Enter Password: ${adminPassword}`}
                  className="w-full bg-[#131415] border border-white/20 focus:border-[#ffb4aa] rounded-xl px-4 py-3 text-sm text-white focus:outline-none font-mono"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEnteredPassword(DEFAULT_ADMIN_PASSWORD)}
                  className="px-3 py-2 bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Autofill Master Pass
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#c0342c] to-[#e6392f] hover:from-[#d13a30] hover:to-[#f0453a] text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Unlock Admin Console</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Main Admin Panel View */
          <>
            {/* Top Tab Bar */}
            <div className="flex border-b border-white/10 bg-[#161819] px-6 gap-2 overflow-x-auto">
              <button
                id="tab-admin-users"
                onClick={() => setActiveTab('users')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === 'users'
                    ? 'border-[#ffb4aa] text-[#ffb4aa] bg-white/5'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Users & Subscriptions ({allUsers.length})</span>
              </button>

              <button
                id="tab-admin-upload"
                onClick={() => setActiveTab('upload')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === 'upload'
                    ? 'border-[#ffb4aa] text-[#ffb4aa] bg-white/5'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Upload Movie / Series</span>
              </button>

              <button
                id="tab-admin-studio"
                onClick={() => setActiveTab('studio')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === 'studio'
                    ? 'border-[#ffb4aa] text-[#ffb4aa] bg-white/5'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-[#ffb4aa]" />
                <span>Poster & Artwork Studio</span>
                <span className="px-1.5 py-0.2 bg-[#c0342c] text-white text-[9px] font-black rounded">NEW</span>
              </button>

              <button
                id="tab-admin-catalog"
                onClick={() => setActiveTab('catalog')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === 'catalog'
                    ? 'border-[#ffb4aa] text-[#ffb4aa] bg-white/5'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Content Catalog Manager ({movies.length})</span>
              </button>

              <button
                id="tab-admin-ops"
                onClick={() => setActiveTab('ops')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === 'ops'
                    ? 'border-[#ffb4aa] text-[#ffb4aa] bg-white/5'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Cloud Ops & Transcoding</span>
              </button>
            </div>

            {/* TAB CONTENT CONTAINER */}
            <div className="p-6 overflow-y-auto flex-1 max-h-[70vh] space-y-6">
              {/* ======================================================== */}
              {/* TAB 1: USERS & SUBSCRIPTIONS */}
              {/* ======================================================== */}
              {activeTab === 'users' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* KPI Stat Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#1b1e1f] border border-white/10 rounded-2xl p-4">
                      <div className="flex items-center justify-between text-white/50 text-xs font-bold mb-1">
                        <span>Total Users</span>
                        <Users className="w-4 h-4 text-[#ffb4aa]" />
                      </div>
                      <div className="text-2xl md:text-3xl font-black text-white font-display">
                        {totalSubscribers}
                      </div>
                      <p className="text-[11px] text-emerald-400 mt-1 font-medium">
                        +14.2% this month
                      </p>
                    </div>

                    <div className="bg-[#1b1e1f] border border-white/10 rounded-2xl p-4">
                      <div className="flex items-center justify-between text-white/50 text-xs font-bold mb-1">
                        <span>Active Paid</span>
                        <Crown className="w-4 h-4 text-[#ffb964]" />
                      </div>
                      <div className="text-2xl md:text-3xl font-black text-[#ffb964] font-display">
                        {activeSubscribers}
                      </div>
                      <p className="text-[11px] text-white/40 mt-1">
                        {Math.round((activeSubscribers / Math.max(1, totalSubscribers)) * 100)}% Conversion rate
                      </p>
                    </div>

                    <div className="bg-[#1b1e1f] border border-white/10 rounded-2xl p-4">
                      <div className="flex items-center justify-between text-white/50 text-xs font-bold mb-1">
                        <span>Monthly MRR</span>
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-2xl md:text-3xl font-black text-emerald-400 font-display">
                        ${totalMRR.toFixed(2)}
                      </div>
                      <p className="text-[11px] text-white/40 mt-1">
                        ARR: ${(totalMRR * 12).toFixed(2)}
                      </p>
                    </div>

                    <div className="bg-[#1b1e1f] border border-white/10 rounded-2xl p-4">
                      <div className="flex items-center justify-between text-white/50 text-xs font-bold mb-1">
                        <span>ARPU</span>
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="text-2xl md:text-3xl font-black text-white font-display">
                        ${avgRevenuePerUser.toFixed(2)}
                      </div>
                      <p className="text-[11px] text-white/40 mt-1">
                        Average revenue / paid user
                      </p>
                    </div>
                  </div>

                  {/* Filter & Action Controls */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#1b1e1f] p-4 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                          placeholder="Search users by name or email..."
                          className="w-full bg-[#121414] border border-white/15 focus:border-[#ffb4aa] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <select
                        value={planFilter}
                        onChange={(e) => setPlanFilter(e.target.value as any)}
                        className="bg-[#121414] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                      >
                        <option value="All">All Plans</option>
                        <option value="Family VIP">Family VIP ($19.99)</option>
                        <option value="Premium 4K HDR">Premium 4K ($14.99)</option>
                        <option value="Free">Free Starter ($0)</option>
                      </select>
                    </div>

                    <button
                      id="btn-add-subscriber-dialog"
                      onClick={() => setShowAddUserModal(true)}
                      className="px-4 py-2 bg-[#c0342c] hover:bg-[#d63d34] text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Subscriber</span>
                    </button>
                  </div>

                  {/* Add User Modal / Inline Form */}
                  {showAddUserModal && (
                    <form
                      onSubmit={handleCreateNewUser}
                      className="bg-[#202324] border border-[#ffb4aa]/40 p-5 rounded-2xl space-y-4 animate-in fade-in duration-200"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                          <Plus className="w-4 h-4 text-[#ffb4aa]" />
                          <span>Register New Subscriber</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setShowAddUserModal(false)}
                          className="text-white/50 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-white/70 block mb-1">Full Name</label>
                          <input
                            type="text"
                            required
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                            placeholder="e.g. Maya Lin"
                            className="w-full bg-[#121414] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-white/70 block mb-1">Email</label>
                          <input
                            type="email"
                            required
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                            placeholder="e.g. maya@streaming.com"
                            className="w-full bg-[#121414] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-white/70 block mb-1">Subscription Plan</label>
                          <select
                            value={newUserPlan}
                            onChange={(e) => setNewUserPlan(e.target.value as any)}
                            className="w-full bg-[#121414] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                          >
                            <option value="Family VIP">Family VIP ($19.99/mo)</option>
                            <option value="Premium 4K HDR">Premium 4K HDR ($14.99/mo)</option>
                            <option value="Free">Free Starter ($0.00/mo)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-white/70 block mb-1">Billing Status</label>
                          <select
                            value={newUserStatus}
                            onChange={(e) => setNewUserStatus(e.target.value as any)}
                            className="w-full bg-[#121414] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                          >
                            <option value="Active">Active</option>
                            <option value="Trial">Trial Period</option>
                            <option value="Suspended">Suspended</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddUserModal(false)}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-[#c0342c] hover:bg-[#d63d34] text-white text-xs font-bold rounded-xl"
                        >
                          Save Subscriber
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Users Table */}
                  <div className="bg-[#1b1e1f] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#141516] border-b border-white/10 text-white/50 font-bold uppercase tracking-wider">
                          <tr>
                            <th className="py-3 px-4">Subscriber</th>
                            <th className="py-3 px-4">Role</th>
                            <th className="py-3 px-4">Plan & Monthly Fee</th>
                            <th className="py-3 px-4">Billing Status</th>
                            <th className="py-3 px-4">Streaming Stats</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-white/5 transition-colors">
                              {/* Subscriber Name & Email */}
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={u.avatar}
                                    alt={u.name}
                                    className="w-9 h-9 rounded-full object-cover border border-white/20 shrink-0"
                                  />
                                  <div className="overflow-hidden">
                                    <div className="font-bold text-white text-xs truncate">{u.name}</div>
                                    <div className="text-[11px] text-white/50 font-mono truncate">{u.email}</div>
                                  </div>
                                </div>
                              </td>

                              {/* Role */}
                              <td className="py-3.5 px-4">
                                {u.role === 'admin' || u.email === 'shaikhowais897@gmail.com' ? (
                                  <span className="px-2 py-0.5 bg-[#c0342c]/30 border border-[#c0342c]/60 text-[#ffb4aa] font-bold text-[10px] rounded-full uppercase flex items-center gap-1 w-fit">
                                    <Crown className="w-3 h-3 text-[#ffb4aa]" />
                                    <span>Master Admin</span>
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/60 font-semibold text-[10px] rounded-full uppercase">
                                    Subscriber
                                  </span>
                                )}
                              </td>

                              {/* Subscription Tier Dropdown */}
                              <td className="py-3.5 px-4">
                                <select
                                  value={u.plan}
                                  onChange={(e) => handleUpdateUserPlan(u.id, e.target.value as any)}
                                  className={`bg-[#121414] border rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer focus:outline-none ${
                                    u.plan === 'Family VIP'
                                      ? 'border-[#f59e0b]/50 text-[#f59e0b]'
                                      : u.plan === 'Premium 4K HDR'
                                      ? 'border-[#ffb4aa]/50 text-[#ffb4aa]'
                                      : 'border-white/20 text-white/60'
                                  }`}
                                >
                                  <option value="Family VIP">Family VIP ($19.99)</option>
                                  <option value="Premium 4K HDR">Premium 4K ($14.99)</option>
                                  <option value="Free">Free Starter ($0.00)</option>
                                </select>
                              </td>

                              {/* Billing Status */}
                              <td className="py-3.5 px-4">
                                <select
                                  value={u.billingStatus}
                                  onChange={(e) => handleUpdateUserStatus(u.id, e.target.value as any)}
                                  className={`bg-[#121414] border rounded-lg px-2 py-1 text-[11px] font-semibold cursor-pointer focus:outline-none ${
                                    u.billingStatus === 'Active'
                                      ? 'border-emerald-500/40 text-emerald-400'
                                      : u.billingStatus === 'Trial'
                                      ? 'border-blue-500/40 text-blue-400'
                                      : 'border-red-500/40 text-red-400'
                                  }`}
                                >
                                  <option value="Active">Active</option>
                                  <option value="Trial">Trial</option>
                                  <option value="Expired">Expired</option>
                                  <option value="Suspended">Suspended</option>
                                </select>
                              </td>

                              {/* Stats */}
                              <td className="py-3.5 px-4 text-[11px] text-white/60">
                                <div>{u.watchHours || 42} hrs streamed</div>
                                <div className="text-[10px] text-white/40">{u.ipRegion || 'Global CDN'}</div>
                              </td>

                              {/* Action Buttons */}
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleToggleUserAdmin(u.id)}
                                    title={u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                                    className="p-1.5 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Shield className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => handleDeleteUser(u.id)}
                                    title="Delete User"
                                    className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 2: UPLOAD MOVIES & SERIES HUB */}
              {/* ======================================================== */}
              {activeTab === 'upload' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
                  {/* Upload Form (Left Column) */}
                  <form onSubmit={handleUploadMovieOrSeries} className="lg:col-span-7 space-y-5">
                    {/* Content Type Picker */}
                    <div className="bg-[#1b1e1f] border border-white/10 p-4 rounded-2xl space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/70">
                        Select Content Format
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setContentType('movie');
                            setDuration('2h 15m');
                          }}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                            contentType === 'movie'
                              ? 'border-[#ffb4aa] bg-[#c0342c]/20 text-white'
                              : 'border-white/10 bg-[#121414] text-white/60 hover:text-white'
                          }`}
                        >
                          <Film className="w-4 h-4 text-[#ffb4aa]" />
                          <span className="text-xs font-bold">4K Movie</span>
                          <span className="text-[10px] text-white/40">Feature Film</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setContentType('series');
                            setDuration('Season 1 (8 Ep)');
                          }}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                            contentType === 'series'
                              ? 'border-[#ffb4aa] bg-[#c0342c]/20 text-white'
                              : 'border-white/10 bg-[#121414] text-white/60 hover:text-white'
                          }`}
                        >
                          <Tv className="w-4 h-4 text-[#ffb964]" />
                          <span className="text-xs font-bold">TV Series</span>
                          <span className="text-[10px] text-white/40">Multi-Episode</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setContentType('anime');
                            setDuration('Season 1 (12 Ep)');
                          }}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                            contentType === 'anime'
                              ? 'border-[#ffb4aa] bg-[#c0342c]/20 text-white'
                              : 'border-white/10 bg-[#121414] text-white/60 hover:text-white'
                          }`}
                        >
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold">Anime / Doc</span>
                          <span className="text-[10px] text-white/40">Original Series</span>
                        </button>
                      </div>
                    </div>

                    {/* Metadata Fields */}
                    <div className="bg-[#1b1e1f] border border-white/10 p-5 rounded-2xl space-y-4">
                      <h4 className="font-bold text-white text-sm">Title & Story Metadata</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-white/70 block mb-1">
                            Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Chrono Shift 2099"
                            className="w-full bg-[#121414] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ffb4aa]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-white/70 block mb-1">
                            Tagline / Subtitle
                          </label>
                          <input
                            type="text"
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                            placeholder="e.g. Time is no longer a constant."
                            className="w-full bg-[#121414] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ffb4aa]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-white/70 block mb-1">
                          Synopsis & Story Overview *
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={synopsis}
                          onChange={(e) => setSynopsis(e.target.value)}
                          placeholder="Provide the cinematic synopsis for subscribers..."
                          className="w-full bg-[#121414] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ffb4aa]"
                        />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-white/70 block mb-1">Year</label>
                          <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="w-full bg-[#121414] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-white/70 block mb-1">Duration</label>
                          <input
                            type="text"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            placeholder="2h 15m"
                            className="w-full bg-[#121414] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-white/70 block mb-1">Age Rating</label>
                          <select
                            value={ageRating}
                            onChange={(e) => setAgeRating(e.target.value)}
                            className="w-full bg-[#121414] border border-white/15 rounded-xl px-2 py-2 text-xs text-white focus:outline-none cursor-pointer"
                          >
                            <option value="PG">PG</option>
                            <option value="PG-13">PG-13</option>
                            <option value="R">R (18+)</option>
                            <option value="TV-MA">TV-MA</option>
                            <option value="TV-14">TV-14</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-white/70 block mb-1">Access Level</label>
                          <select
                            value={accessLevel}
                            onChange={(e) => setAccessLevel(e.target.value as any)}
                            className="w-full bg-[#121414] border border-white/15 rounded-xl px-2 py-2 text-xs text-white focus:outline-none cursor-pointer"
                          >
                            <option value="premium">Premium 4K</option>
                            <option value="free">Free Tier</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Genres Multi-Select */}
                    <div className="bg-[#1b1e1f] border border-white/10 p-4 rounded-2xl space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/70 block">
                        Select Genres
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          'Action',
                          'Sci-Fi',
                          'Thriller',
                          'Drama',
                          'Horror',
                          'Comedy',
                          'Animation',
                          'Adventure',
                          'Fantasy',
                          'Crime',
                          'Documentary',
                          'Mystery',
                        ].map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => handleToggleGenre(g)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                              selectedGenres.includes(g)
                                ? 'bg-[#c0342c] text-white border border-[#ffb4aa]/60 shadow-sm'
                                : 'bg-[#121414] text-white/60 border border-white/10 hover:text-white'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Format Badges Multi-Select */}
                    <div className="bg-[#1b1e1f] border border-white/10 p-4 rounded-2xl space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/70 block">
                        Format Badges
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          '4K Ultra HD',
                          'Dolby Vision',
                          'Dolby Atmos',
                          'HDR10+',
                          'IMAX Enhanced',
                          '5.1 Surround',
                        ].map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => handleToggleBadge(b)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                              selectedBadges.includes(b)
                                ? 'bg-[#ffb964]/20 text-[#ffb964] border border-[#ffb964]'
                                : 'bg-[#121414] text-white/50 border border-white/10 hover:text-white'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Video Stream Preset Picker */}
                    <div className="bg-[#1b1e1f] border border-white/10 p-4 rounded-2xl space-y-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/70 block">
                        Video Stream Source (HLS / MP4)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {VIDEO_STREAM_PRESETS.map((stream) => (
                          <button
                            key={stream.name}
                            type="button"
                            onClick={() => setVideoUrl(stream.url)}
                            className={`p-2 rounded-xl text-left border text-xs transition-all cursor-pointer truncate ${
                              videoUrl === stream.url
                                ? 'border-[#ffb4aa] bg-[#c0342c]/20 text-white font-bold'
                                : 'border-white/10 bg-[#121414] text-white/60 hover:text-white'
                            }`}
                          >
                            {stream.name}
                          </button>
                        ))}
                      </div>
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="Custom stream URL (https://...)"
                        className="w-full bg-[#121414] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>

                    {/* Dedicated Movie Poster & Backdrop Image Uploading Section */}
                    <div className="bg-[#1b1e1f] border border-[#ffb4aa]/30 p-5 rounded-2xl space-y-5 shadow-lg">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#c0342c]/20 border border-[#c0342c]/40 flex items-center justify-center text-[#ffb4aa]">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm flex items-center gap-2">
                              <span>Movie Poster & Artwork Ingestion</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#c0342c] text-white uppercase tracking-wider">
                                4K Media Pipeline
                              </span>
                            </h4>
                            <p className="text-[11px] text-white/50">
                              Upload high-resolution 2:3 vertical posters and 16:9 landscape backdrops from your local device or via URL.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setBackdropUrl(posterUrl);
                              onShowToast('Synced: Copied Poster URL to Backdrop');
                            }}
                            className="px-2.5 py-1 bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white text-[11px] font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            title="Copy Poster to Backdrop"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Poster → Backdrop</span>
                          </button>
                        </div>
                      </div>

                      {/* 1. Vertical Movie Poster (2:3 Aspect Ratio) */}
                      <div className="space-y-3 bg-[#131415] border border-white/10 p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider text-[#ffb4aa] flex items-center gap-1.5">
                            <Image className="w-3.5 h-3.5" />
                            <span>1. Vertical Movie Poster (2:3 Portrait Key Art)</span>
                          </label>
                          <span className="text-[10px] text-white/40 font-mono">Recommended: 800×1200 or higher</span>
                        </div>

                        {/* Drag and Drop Box */}
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingPoster(true);
                          }}
                          onDragLeave={() => setIsDraggingPoster(false)}
                          onDrop={handlePosterDrop}
                          onClick={() => posterFileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                            isDraggingPoster
                              ? 'border-[#ffb4aa] bg-[#c0342c]/20 scale-[1.01]'
                              : 'border-white/20 hover:border-[#ffb4aa]/60 bg-black/20 hover:bg-white/5'
                          }`}
                        >
                          <input
                            ref={posterFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                processImageFile(e.target.files[0], 'poster');
                              }
                            }}
                            className="hidden"
                          />
                          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-[#ffb4aa]">
                            <UploadCloud className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">
                              Drag & drop movie poster here, or <span className="text-[#ffb4aa] underline">Browse Files</span>
                            </p>
                            <p className="text-[10px] text-white/50 mt-0.5">Supports PNG, JPG, WEBP, AVIF (Max 15MB)</p>
                          </div>

                          {posterFileName && (
                            <div className="flex items-center gap-2 bg-[#1e2020] border border-emerald-500/40 px-3 py-1 rounded-full text-xs text-emerald-400 font-medium">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>{posterFileName} ({posterFileSize})</span>
                            </div>
                          )}
                        </div>

                        {/* Direct URL Input */}
                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            value={posterUrl}
                            onChange={(e) => {
                              setPosterUrl(e.target.value);
                              setPosterFileName('');
                            }}
                            placeholder="Or paste direct poster image URL (https://...)"
                            className="flex-1 bg-[#181a1b] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#ffb4aa]"
                          />
                          {posterUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                setPosterUrl('');
                                setPosterFileName('');
                              }}
                              className="px-2.5 py-2 bg-white/5 hover:bg-white/15 border border-white/10 text-white/60 hover:text-white rounded-xl text-xs"
                            >
                              Clear
                            </button>
                          )}
                        </div>

                        {/* 2:3 Presets Picker */}
                        <div>
                          <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block mb-1.5">
                            Or Select from 2:3 Poster Presets:
                          </span>
                          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                            {POSTER_PRESETS.map((preset) => (
                              <button
                                key={preset.name}
                                type="button"
                                onClick={() => {
                                  setPosterUrl(preset.url);
                                  setPosterFileName(preset.name);
                                }}
                                className={`relative aspect-[2/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer group ${
                                  posterUrl === preset.url
                                    ? 'border-[#ffb4aa] shadow-[0_0_10px_rgba(255,180,170,0.6)] scale-105'
                                    : 'border-white/10 opacity-70 hover:opacity-100'
                                }`}
                                title={preset.name}
                              >
                                <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] text-white font-bold p-0.5 text-center leading-tight">
                                  {preset.theme}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 2. Cinematic Backdrop Banner (16:9 Landscape Aspect Ratio) */}
                      <div className="space-y-3 bg-[#131415] border border-white/10 p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider text-[#ffb964] flex items-center gap-1.5">
                            <Film className="w-3.5 h-3.5" />
                            <span>2. Cinematic Backdrop Banner (16:9 Landscape)</span>
                          </label>
                          <span className="text-[10px] text-white/40 font-mono">Recommended: 1920×1080 or 4K</span>
                        </div>

                        {/* Drag and Drop Box for Backdrop */}
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingBackdrop(true);
                          }}
                          onDragLeave={() => setIsDraggingBackdrop(false)}
                          onDrop={handleBackdropDrop}
                          onClick={() => backdropFileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                            isDraggingBackdrop
                              ? 'border-[#ffb964] bg-[#ffb964]/20 scale-[1.01]'
                              : 'border-white/20 hover:border-[#ffb964]/60 bg-black/20 hover:bg-white/5'
                          }`}
                        >
                          <input
                            ref={backdropFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                processImageFile(e.target.files[0], 'backdrop');
                              }
                            }}
                            className="hidden"
                          />
                          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-[#ffb964]">
                            <UploadCloud className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">
                              Drag & drop 16:9 backdrop image here, or <span className="text-[#ffb964] underline">Browse Files</span>
                            </p>
                            <p className="text-[10px] text-white/50 mt-0.5">Supports PNG, JPG, WEBP, AVIF (Max 15MB)</p>
                          </div>

                          {backdropFileName && (
                            <div className="flex items-center gap-2 bg-[#1e2020] border border-emerald-500/40 px-3 py-1 rounded-full text-xs text-emerald-400 font-medium">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>{backdropFileName} ({backdropFileSize})</span>
                            </div>
                          )}
                        </div>

                        {/* Direct URL Input for Backdrop */}
                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            value={backdropUrl}
                            onChange={(e) => {
                              setBackdropUrl(e.target.value);
                              setBackdropFileName('');
                            }}
                            placeholder="Or paste direct 16:9 backdrop image URL (https://...)"
                            className="flex-1 bg-[#181a1b] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#ffb964]"
                          />
                          {backdropUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                setBackdropUrl('');
                                setBackdropFileName('');
                              }}
                              className="px-2.5 py-2 bg-white/5 hover:bg-white/15 border border-white/10 text-white/60 hover:text-white rounded-xl text-xs"
                            >
                              Clear
                            </button>
                          )}
                        </div>

                        {/* 16:9 Presets Picker */}
                        <div>
                          <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block mb-1.5">
                            Or Select from 16:9 Backdrop Presets:
                          </span>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {BACKDROP_PRESETS.map((preset) => (
                              <button
                                key={preset.name}
                                type="button"
                                onClick={() => {
                                  setBackdropUrl(preset.url);
                                  setBackdropFileName(preset.name);
                                }}
                                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all cursor-pointer group ${
                                  backdropUrl === preset.url
                                    ? 'border-[#ffb964] shadow-[0_0_10px_rgba(255,185,100,0.6)] scale-105'
                                    : 'border-white/10 opacity-70 hover:opacity-100'
                                }`}
                              >
                                <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] text-white font-bold p-1 text-center leading-tight">
                                  {preset.name}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dedicated Cast & Key Crew Production Roster with Image Uploading */}
                    <div className="bg-[#1b1e1f] border border-[#ffb4aa]/30 p-5 rounded-2xl space-y-5 shadow-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#c0342c]/20 border border-[#c0342c]/40 flex items-center justify-center text-[#ffb4aa]">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm flex items-center gap-2">
                              <span>Cast & Crew Production Roster</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#c0342c] text-white uppercase tracking-wider">
                                {castList.length} Credits
                              </span>
                            </h4>
                            <p className="text-[11px] text-white/50">
                              Attach lead actors, directors, cinematographers, and crew with high-resolution portraits.
                            </p>
                          </div>
                        </div>

                        {editingCastIndex !== null && (
                          <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-lg flex items-center gap-1 self-start sm:self-center">
                            <Edit className="w-3 h-3" />
                            <span>Editing Credit #{editingCastIndex + 1}</span>
                          </span>
                        )}
                      </div>

                      {/* Current Cast & Crew Chips / Cards Display */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-white/70 flex items-center justify-between">
                          <span>Attached Cast & Crew ({castList.length})</span>
                          <span className="text-[10px] text-white/40 normal-case">Displayed on movie detail page</span>
                        </label>

                        {castList.length === 0 ? (
                          <div className="p-4 bg-[#121414] border border-dashed border-white/15 rounded-xl text-center text-xs text-white/50">
                            No cast or crew members added yet. Use the form below to add actors and key production talent.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                            {castList.map((member, idx) => (
                              <div
                                key={idx}
                                className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                                  editingCastIndex === idx
                                    ? 'bg-[#c0342c]/20 border-[#ffb4aa]'
                                    : 'bg-[#131415] border-white/10 hover:border-white/20'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 overflow-hidden">
                                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shrink-0 bg-black">
                                    <img
                                      src={member.avatar}
                                      alt={member.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="overflow-hidden">
                                    <div className="text-xs font-bold text-white truncate">{member.name}</div>
                                    <div className="text-[10px] text-[#ffb4aa] truncate font-medium">{member.role}</div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handleEditCastMember(idx)}
                                    className="p-1.5 bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white rounded-lg transition-colors cursor-pointer"
                                    title="Edit details"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCastMember(idx)}
                                    className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-colors cursor-pointer"
                                    title="Remove from roster"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Cast & Crew Ingestion Form & Photo Uploader */}
                      <div className="bg-[#131415] border border-white/10 p-4 rounded-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                            <UserPlus className="w-3.5 h-3.5 text-[#ffb4aa]" />
                            <span>{editingCastIndex !== null ? 'Modify Cast/Crew Member' : 'Add New Cast / Crew Member'}</span>
                          </h5>
                          {editingCastIndex !== null && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCastIndex(null);
                                setNewCastName('');
                                setNewCastRole('Supporting Actor');
                              }}
                              className="text-[10px] text-white/60 hover:text-white underline cursor-pointer"
                            >
                              Cancel Edit
                            </button>
                          )}
                        </div>

                        {/* Name and Role Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-white/70 block mb-1">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              value={newCastName}
                              onChange={(e) => setNewCastName(e.target.value)}
                              placeholder="e.g. Elena Rostova / Shaikh Owais"
                              className="w-full bg-[#181a1b] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ffb4aa]"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-white/70 block mb-1">
                              Role / Character Title *
                            </label>
                            <input
                              type="text"
                              value={newCastRole}
                              onChange={(e) => setNewCastRole(e.target.value)}
                              placeholder="e.g. Lead Protagonist / Director"
                              className="w-full bg-[#181a1b] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ffb4aa]"
                            />
                          </div>
                        </div>

                        {/* Quick Role Suggestions */}
                        <div>
                          <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block mb-1.5">
                            Quick Role Selection:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              'Director',
                              'Executive Producer',
                              'Lead Protagonist',
                              'Lead Actor',
                              'Lead Actress',
                              'Supporting Actor',
                              'Supporting Actress',
                              'Cinematographer',
                              'Original Score & Composer',
                              'Screenplay Writer',
                              'Stunt Coordinator',
                              'Voice Actor',
                            ].map((role) => (
                              <button
                                key={role}
                                type="button"
                                onClick={() => setNewCastRole(role)}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-medium border transition-colors cursor-pointer ${
                                  newCastRole === role
                                    ? 'bg-[#c0342c] text-white border-[#ffb4aa]'
                                    : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                                }`}
                              >
                                {role}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Cast Avatar Image Upload Section */}
                        <div className="space-y-3 pt-2 border-t border-white/5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#ffb4aa] flex items-center gap-1.5">
                              <ImageIcon className="w-3.5 h-3.5" />
                              <span>Cast Portrait / Avatar Ingestion</span>
                            </label>
                            <span className="text-[10px] text-white/40 font-mono">1:1 Square Portrait</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                            {/* Drag & Drop Photo Box */}
                            <div className="sm:col-span-8">
                              <div
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  setIsDraggingCast(true);
                                }}
                                onDragLeave={() => setIsDraggingCast(false)}
                                onDrop={handleCastDrop}
                                onClick={() => castFileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-3 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                                  isDraggingCast
                                    ? 'border-[#ffb4aa] bg-[#c0342c]/20 scale-[1.01]'
                                    : 'border-white/20 hover:border-[#ffb4aa]/60 bg-black/20 hover:bg-white/5'
                                }`}
                              >
                                <input
                                  ref={castFileInputRef}
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      processImageFile(e.target.files[0], 'cast');
                                    }
                                  }}
                                  className="hidden"
                                />
                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-[#ffb4aa]">
                                  <UploadCloud className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-white">
                                    Drag & drop actor portrait, or <span className="text-[#ffb4aa] underline">Browse Files</span>
                                  </p>
                                  <p className="text-[10px] text-white/50">PNG, JPG, WEBP (Max 10MB)</p>
                                </div>

                                {castFileName && (
                                  <div className="flex items-center gap-1.5 bg-[#1e2020] border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-[10px] text-emerald-400 font-medium">
                                    <CheckCircle className="w-3 h-3" />
                                    <span>{castFileName}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Live Portrait Preview Box */}
                            <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 bg-[#181a1b] rounded-xl border border-white/10 text-center">
                              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#ffb4aa] shadow-md mb-1 bg-black">
                                <img
                                  src={newCastAvatar || CAST_AVATAR_PRESETS[0].avatar}
                                  alt="Avatar Preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="text-[10px] text-white/60 font-semibold truncate max-w-[120px]">
                                {newCastName || 'Name Preview'}
                              </span>
                              <span className="text-[9px] text-[#ffb4aa] font-medium truncate max-w-[120px]">
                                {newCastRole || 'Role Preview'}
                              </span>
                            </div>
                          </div>

                          {/* Direct Image URL Input */}
                          <div className="flex items-center gap-2">
                            <input
                              type="url"
                              value={newCastAvatar}
                              onChange={(e) => {
                                setNewCastAvatar(e.target.value);
                                setCastFileName('');
                              }}
                              placeholder="Or paste direct avatar image URL (https://...)"
                              className="flex-1 bg-[#181a1b] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#ffb4aa]"
                            />
                            {newCastAvatar && (
                              <button
                                type="button"
                                onClick={() => setNewCastAvatar('')}
                                className="px-2.5 py-2 bg-white/5 hover:bg-white/15 border border-white/10 text-white/60 hover:text-white rounded-xl text-xs cursor-pointer"
                              >
                                Clear
                              </button>
                            )}
                          </div>

                          {/* Preset Avatars Gallery */}
                          <div>
                            <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block mb-1.5">
                              Or Pick from Cast Talent Presets:
                            </span>
                            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                              {CAST_AVATAR_PRESETS.map((preset, pIdx) => (
                                <button
                                  key={pIdx}
                                  type="button"
                                  onClick={() => {
                                    setNewCastAvatar(preset.avatar);
                                    if (!newCastName) setNewCastName(preset.name.split(' (')[0]);
                                    if (!newCastRole || newCastRole === 'Supporting Actor') setNewCastRole(preset.role);
                                  }}
                                  className={`relative aspect-square rounded-full overflow-hidden border-2 transition-all cursor-pointer group ${
                                    newCastAvatar === preset.avatar
                                      ? 'border-[#ffb4aa] shadow-[0_0_8px_rgba(255,180,170,0.6)] scale-105'
                                      : 'border-white/10 opacity-70 hover:opacity-100'
                                  }`}
                                  title={`${preset.name} - ${preset.role}`}
                                >
                                  <img src={preset.avatar} alt={preset.name} className="w-full h-full object-cover" />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Add / Update Cast Button */}
                        <div className="flex justify-end pt-2">
                          <button
                            type="button"
                            onClick={handleAddOrUpdateCastMember}
                            className="px-4 py-2 bg-[#c0342c] hover:bg-[#d63d34] text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{editingCastIndex !== null ? 'Save Cast Credit' : 'Add Cast Member to Roster'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Series Episode Builder (If Series) */}
                    {contentType === 'series' && (
                      <div className="bg-[#1b1e1f] border border-[#ffb964]/40 p-4 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-white text-xs flex items-center gap-2">
                            <Tv className="w-4 h-4 text-[#ffb964]" />
                            <span>Season 1 Episodes ({episodes.length})</span>
                          </h4>
                          <button
                            type="button"
                            onClick={handleAddEpisode}
                            className="px-2.5 py-1 bg-[#ffb964]/20 hover:bg-[#ffb964]/30 border border-[#ffb964]/50 text-[#ffb964] text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Episode</span>
                          </button>
                        </div>

                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {episodes.map((ep, idx) => (
                            <div
                              key={ep.id}
                              className="p-2.5 rounded-xl bg-[#121414] border border-white/10 text-xs flex items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-2 overflow-hidden">
                                <span className="font-bold text-[#ffb964] shrink-0">E{ep.episodeNumber}</span>
                                <div className="overflow-hidden truncate">
                                  <div className="font-bold text-white truncate">{ep.title}</div>
                                  <div className="text-[10px] text-white/50">{ep.duration} • {ep.synopsis}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex items-center gap-3 pt-2">
                      <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isFeatured}
                          onChange={(e) => setIsFeatured(e.target.checked)}
                          className="rounded bg-[#121414] border-white/20 text-[#c0342c] focus:ring-0"
                        />
                        <span>Feature prominently on Hero Banner</span>
                      </label>

                      <button
                        type="submit"
                        className="ml-auto px-6 py-3 bg-gradient-to-r from-[#c0342c] to-[#e6392f] hover:from-[#d13a30] hover:to-[#f0453a] text-white font-bold text-xs md:text-sm rounded-xl shadow-lg shadow-[#c0342c]/40 flex items-center gap-2 cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Publish {contentType === 'series' ? 'Series' : 'Movie'} to Catalog</span>
                      </button>
                    </div>
                  </form>

                  {/* Live 4K Preview (Right Column) */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="sticky top-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-white/50">
                          Live Subscriber Card Preview
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                          4K Ready
                        </span>
                      </div>

                      {/* Movie Card Preview */}
                      <div className="bg-[#1b1e1f] border border-white/15 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="relative aspect-video w-full overflow-hidden bg-[#121414]">
                          <img
                            src={backdropUrl || BACKDROP_PRESETS[0].url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1b1e1f] via-transparent to-black/40"></div>

                          <div className="absolute top-3 left-3 flex gap-1.5">
                            {isFeatured && (
                              <span className="px-2 py-0.5 bg-[#c0342c] text-white text-[10px] font-black rounded-full uppercase">
                                👑 Admin Pick
                              </span>
                            )}
                            <span className="px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold rounded-full">
                              {ageRating}
                            </span>
                          </div>

                          <div className="absolute bottom-3 left-3 right-3">
                            <h3 className="font-display font-black text-xl text-white drop-shadow">
                              {title || 'Untitled Title'}
                            </h3>
                            <p className="text-xs text-[#ffb4aa] italic truncate">
                              "{tagline || 'Your tagline appears here'}"
                            </p>
                          </div>
                        </div>

                        <div className="p-4 space-y-3">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="flex items-center gap-1 font-bold text-[#ffb964]">
                              <Star className="w-3.5 h-3.5 fill-[#ffb964]" /> 5.0
                            </span>
                            <span className="text-white/40">•</span>
                            <span className="text-white/80">{year}</span>
                            <span className="text-white/40">•</span>
                            <span className="text-white/80">{duration}</span>
                            <span className="text-white/40">•</span>
                            <span className="text-emerald-400 font-bold">{matchScore}% Match</span>
                          </div>

                          <p className="text-xs text-white/70 line-clamp-3">
                            {synopsis || 'Synopsis story summary will be rendered here for viewers.'}
                          </p>

                          <div className="flex flex-wrap gap-1 pt-1">
                            {selectedBadges.map((b) => (
                              <span
                                key={b}
                                className="px-2 py-0.5 bg-[#252829] border border-white/10 text-white/80 text-[10px] font-bold rounded"
                              >
                                {b}
                              </span>
                            ))}
                          </div>

                          {/* Cast Preview in Subscriber Card */}
                          <div className="pt-2 border-t border-white/10 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-white/60 uppercase tracking-wider text-[10px]">
                                Cast & Production Crew ({castList.length})
                              </span>
                              <span className="text-[10px] text-[#ffb4aa] font-medium">Director: {director || (castList.find(c => c.role.toLowerCase().includes('director'))?.name) || 'Shaikh Owais'}</span>
                            </div>
                            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                              {castList.slice(0, 4).map((c, i) => (
                                <div key={i} className="flex items-center gap-1.5 bg-[#121414] border border-white/10 px-2 py-1 rounded-full shrink-0">
                                  <img src={c.avatar} alt={c.name} className="w-4 h-4 rounded-full object-cover border border-white/20" />
                                  <span className="text-[10px] text-white font-medium truncate max-w-[80px]">{c.name}</span>
                                </div>
                              ))}
                              {castList.length > 4 && (
                                <span className="text-[10px] text-white/50 shrink-0 font-bold">+{castList.length - 4} more</span>
                              )}
                            </div>
                          </div>

                          {/* 2:3 Vertical Poster Preview Thumbnail */}
                          {posterUrl && (
                            <div className="pt-2 border-t border-white/10 flex items-center gap-3">
                              <div className="w-10 aspect-[2/3] rounded-lg overflow-hidden border border-white/20 shrink-0 bg-black">
                                <img src={posterUrl} alt="Poster" className="w-full h-full object-cover" />
                              </div>
                              <div className="text-xs">
                                <div className="font-bold text-white text-[11px]">2:3 Vertical Poster Attached</div>
                                <div className="text-[10px] text-emerald-400">Ready for Mobile & Grid Display</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 3: POSTER & ARTWORK STUDIO */}
              {/* ======================================================== */}
              {activeTab === 'studio' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Studio Header Banner */}
                  <div className="bg-gradient-to-r from-[#1b1e1f] via-[#241a1a] to-[#1b1e1f] border border-[#ffb4aa]/30 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#c0342c] to-[#ffb4aa] flex items-center justify-center text-white shadow-lg shadow-[#c0342c]/40">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white font-display">
                            Interactive Poster & Key Art Studio
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#c0342c] text-white uppercase">
                            Admin Master Suite
                          </span>
                        </div>
                        <p className="text-xs text-white/60">
                          Upload, preview, customize, and apply high-resolution 2:3 vertical posters and 16:9 backdrops to any title in the library.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex bg-[#121414] p-1 rounded-xl border border-white/10">
                        <button
                          type="button"
                          onClick={() => setStudioRatio('2:3')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            studioRatio === '2:3'
                              ? 'bg-[#c0342c] text-white shadow-md'
                              : 'text-white/60 hover:text-white'
                          }`}
                        >
                          <Crop className="w-3.5 h-3.5" />
                          <span>2:3 Portrait Poster</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setStudioRatio('16:9')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            studioRatio === '16:9'
                              ? 'bg-[#c0342c] text-white shadow-md'
                              : 'text-white/60 hover:text-white'
                          }`}
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>16:9 Landscape Banner</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Studio 3-Column Workspace */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Image Ingestion & Presets (4 cols) */}
                    <div className="lg:col-span-4 space-y-4">
                      {/* Drag & Drop Box */}
                      <div className="bg-[#1b1e1f] border border-white/10 p-4 rounded-2xl space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#ffb4aa] flex items-center gap-1.5">
                          <UploadCloud className="w-4 h-4" />
                          <span>Upload Local Artwork</span>
                        </label>

                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingStudio(true);
                          }}
                          onDragLeave={() => setIsDraggingStudio(false)}
                          onDrop={handleStudioDrop}
                          onClick={() => studioFileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                            isDraggingStudio
                              ? 'border-[#ffb4aa] bg-[#c0342c]/20 scale-[1.02]'
                              : 'border-white/20 hover:border-[#ffb4aa]/60 bg-[#121414] hover:bg-white/5'
                          }`}
                        >
                          <input
                            ref={studioFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                processImageFile(e.target.files[0], 'studio');
                              }
                            }}
                            className="hidden"
                          />
                          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-[#ffb4aa]">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">
                              Drop image file here or <span className="text-[#ffb4aa] underline">Browse</span>
                            </p>
                            <p className="text-[10px] text-white/50 mt-0.5">PNG, JPG, WEBP, AVIF (Lossless Ingestion)</p>
                          </div>
                        </div>

                        {/* Direct URL Input */}
                        <div>
                          <label className="text-[11px] font-bold text-white/70 block mb-1">
                            Or Direct Image URL
                          </label>
                          <input
                            type="url"
                            value={studioCustomImage}
                            onChange={(e) => setStudioCustomImage(e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-[#121414] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#ffb4aa]"
                          />
                        </div>
                      </div>

                      {/* Presets Gallery */}
                      <div className="bg-[#1b1e1f] border border-white/10 p-4 rounded-2xl space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-white/70 block">
                          Curated Key Art Presets ({studioRatio === '2:3' ? '2:3 Posters' : '16:9 Backdrops'})
                        </label>
                        <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                          {(studioRatio === '2:3' ? POSTER_PRESETS : BACKDROP_PRESETS).map((p) => (
                            <button
                              key={p.name}
                              type="button"
                              onClick={() => setStudioCustomImage(p.url)}
                              className={`relative rounded-xl overflow-hidden border-2 text-left transition-all cursor-pointer group ${
                                studioRatio === '2:3' ? 'aspect-[2/3]' : 'aspect-video'
                              } ${
                                studioCustomImage === p.url
                                  ? 'border-[#ffb4aa] shadow-[0_0_12px_rgba(255,180,170,0.6)]'
                                  : 'border-white/10 opacity-70 hover:opacity-100'
                              }`}
                            >
                              <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                                <span className="text-[10px] font-bold text-white leading-tight truncate">
                                  {p.name}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Middle Column: Interactive Live Cinema Poster Canvas (4 cols) */}
                    <div className="lg:col-span-4 space-y-3 flex flex-col items-center">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                          Live Theater Mockup Preview
                        </span>
                        <button
                          type="button"
                          onClick={() => setStudioShowOverlays(!studioShowOverlays)}
                          className="text-[11px] text-[#ffb4aa] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>{studioShowOverlays ? 'Hide Cinema Badges' : 'Show Cinema Badges'}</span>
                        </button>
                      </div>

                      {/* Poster Mockup Card */}
                      <div
                        className={`relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-[#0e0f10] transition-all max-w-[320px] w-full ${
                          studioRatio === '2:3' ? 'aspect-[2/3]' : 'aspect-video'
                        }`}
                      >
                        <img
                          src={studioCustomImage || POSTER_PRESETS[0].url}
                          alt="Studio Artwork"
                          className="w-full h-full object-cover"
                        />

                        {studioShowOverlays && (
                          <>
                            {/* Gradient Vignette */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40"></div>

                            {/* Top Badges */}
                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                              <span className="px-2 py-0.5 bg-[#c0342c] text-white text-[9px] font-black rounded-full uppercase tracking-wider shadow">
                                Whoosh Premiere
                              </span>
                              <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[9px] text-[#ffb964] font-bold">
                                <Star className="w-2.5 h-2.5 fill-[#ffb964]" /> 5.0
                              </div>
                            </div>

                            {/* Center Cinematic Title Overlay */}
                            <div className="absolute bottom-3 left-3 right-3 space-y-1.5">
                              <h3 className="font-display font-black text-lg text-white leading-tight drop-shadow-md">
                                {studioCustomTitle}
                              </h3>
                              <p className="text-[11px] text-[#ffb4aa] italic truncate">
                                "{studioCustomTagline}"
                              </p>

                              <div className="flex flex-wrap items-center gap-1 pt-1">
                                <span className="px-1.5 py-0.5 bg-white/10 backdrop-blur-md text-[9px] font-bold text-white rounded">
                                  4K ULTRA HD
                                </span>
                                <span className="px-1.5 py-0.5 bg-white/10 backdrop-blur-md text-[9px] font-bold text-white rounded">
                                  DOLBY VISION
                                </span>
                                <span className="px-1.5 py-0.5 bg-white/10 backdrop-blur-md text-[9px] font-bold text-white rounded">
                                  ATMOS 7.1
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Mockup Customizer Inputs */}
                      <div className="w-full bg-[#1b1e1f] border border-white/10 p-3 rounded-xl space-y-2 mt-2">
                        <div className="text-[11px] font-bold text-white/70">Cinema Overlay Text Simulator</div>
                        <input
                          type="text"
                          value={studioCustomTitle}
                          onChange={(e) => setStudioCustomTitle(e.target.value)}
                          placeholder="Overlay Title"
                          className="w-full bg-[#121414] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                        <input
                          type="text"
                          value={studioCustomTagline}
                          onChange={(e) => setStudioCustomTagline(e.target.value)}
                          placeholder="Overlay Tagline"
                          className="w-full bg-[#121414] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* Right Column: Apply to Movie in Library (4 cols) */}
                    <div className="lg:col-span-4 space-y-4">
                      <div className="bg-[#1b1e1f] border border-[#ffb4aa]/40 p-5 rounded-2xl space-y-4 shadow-xl">
                        <div className="flex items-center gap-2 text-white">
                          <Crown className="w-4 h-4 text-[#ffb4aa]" />
                          <h4 className="font-bold text-sm">Apply Artwork to Library Title</h4>
                        </div>
                        <p className="text-xs text-white/60">
                          Select any published movie or series from the Whoosh Catalog to immediately update its visual assets.
                        </p>

                        {/* Movie Selector */}
                        <div>
                          <label className="text-[11px] font-bold text-white/70 block mb-1">
                            Target Movie / Series
                          </label>
                          <select
                            value={studioSelectedMovieId}
                            onChange={(e) => setStudioSelectedMovieId(e.target.value)}
                            className="w-full bg-[#121414] border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#ffb4aa] cursor-pointer font-bold"
                          >
                            {movies.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.title} ({m.year}) - {m.contentType?.toUpperCase() || 'MOVIE'}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Selected Movie Current Art Preview */}
                        {(() => {
                          const current = movies.find((m) => m.id === studioSelectedMovieId);
                          if (!current) return null;
                          return (
                            <div className="p-3 bg-[#121414] rounded-xl border border-white/10 space-y-2">
                              <div className="text-[11px] text-white/50 font-bold uppercase tracking-wider">
                                Current Catalog Artwork
                              </div>
                              <div className="flex gap-2">
                                <div className="w-12 aspect-[2/3] rounded-lg overflow-hidden border border-white/15 shrink-0 bg-black">
                                  <img src={current.posterUrl || current.backdropUrl} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="overflow-hidden truncate text-xs">
                                  <div className="font-bold text-white truncate">{current.title}</div>
                                  <div className="text-[11px] text-white/50">{current.genre.join(', ')}</div>
                                  <div className="text-[10px] text-emerald-400 font-bold mt-1">Ready for upgrade</div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Destination Target Switcher */}
                        <div>
                          <label className="text-[11px] font-bold text-white/70 block mb-1.5">
                            Update As:
                          </label>
                          <div className="grid grid-cols-3 gap-1.5">
                            <button
                              type="button"
                              onClick={() => setStudioTargetType('poster')}
                              className={`p-2 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                                studioTargetType === 'poster'
                                  ? 'bg-[#c0342c] text-white border-[#ffb4aa]'
                                  : 'bg-[#121414] text-white/60 border-white/10 hover:text-white'
                              }`}
                            >
                              Poster (2:3)
                            </button>
                            <button
                              type="button"
                              onClick={() => setStudioTargetType('backdrop')}
                              className={`p-2 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                                studioTargetType === 'backdrop'
                                  ? 'bg-[#c0342c] text-white border-[#ffb4aa]'
                                  : 'bg-[#121414] text-white/60 border-white/10 hover:text-white'
                              }`}
                            >
                              Backdrop (16:9)
                            </button>
                            <button
                              type="button"
                              onClick={() => setStudioTargetType('both')}
                              className={`p-2 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                                studioTargetType === 'both'
                                  ? 'bg-[#c0342c] text-white border-[#ffb4aa]'
                                  : 'bg-[#121414] text-white/60 border-white/10 hover:text-white'
                              }`}
                            >
                              Both Artworks
                            </button>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          type="button"
                          onClick={handleApplyStudioArtworkToMovie}
                          className="w-full py-3.5 bg-gradient-to-r from-[#c0342c] to-[#e6392f] hover:from-[#d13a30] hover:to-[#f0453a] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#c0342c]/40 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Apply Artwork to Selected Title</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Catalog Poster Grid */}
                  <div className="bg-[#1b1e1f] border border-white/10 p-5 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          Catalog Poster Wall ({movies.length} Titles Active)
                        </h4>
                        <p className="text-xs text-white/50">
                          Click on any title to quickly load its poster into the Studio or replace it with a new file.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                      {movies.map((movie) => (
                        <div
                          key={movie.id}
                          className="group relative bg-[#121414] rounded-xl overflow-hidden border border-white/10 hover:border-[#ffb4aa] transition-all flex flex-col"
                        >
                          <div className="relative aspect-[2/3] w-full overflow-hidden bg-black">
                            <img
                              src={movie.posterUrl || movie.backdropUrl}
                              alt={movie.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 gap-1.5 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setStudioSelectedMovieId(movie.id);
                                  setStudioCustomImage(movie.posterUrl || movie.backdropUrl);
                                  setStudioCustomTitle(movie.title.toUpperCase());
                                  setStudioCustomTagline(movie.tagline);
                                  onShowToast(`Loaded "${movie.title}" into Poster Studio`);
                                }}
                                className="w-full py-1 bg-[#c0342c] text-white font-bold text-[10px] rounded-lg shadow cursor-pointer"
                              >
                                Edit in Studio
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingMoviePoster(movie);
                                  setQuickPosterUrl(movie.posterUrl || movie.backdropUrl);
                                  setQuickBackdropUrl(movie.backdropUrl);
                                }}
                                className="w-full py-1 bg-white/20 hover:bg-white/30 text-white font-bold text-[10px] rounded-lg cursor-pointer"
                              >
                                Quick Replace
                              </button>
                            </div>
                          </div>
                          <div className="p-2 truncate">
                            <div className="text-xs font-bold text-white truncate">{movie.title}</div>
                            <div className="text-[10px] text-white/50">{movie.year}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 4: CONTENT CATALOG MANAGER & REMOVAL SUITE */}
              {/* ======================================================== */}
              {activeTab === 'catalog' && (() => {
                const filteredCatalog = movies.filter((m) => {
                  const matchesSearch =
                    m.title.toLowerCase().includes(catalogSearchQuery.toLowerCase()) ||
                    m.genre.some((g) => g.toLowerCase().includes(catalogSearchQuery.toLowerCase())) ||
                    (m.director && m.director.toLowerCase().includes(catalogSearchQuery.toLowerCase()));
                  const matchesType =
                    catalogTypeFilter === 'all'
                      ? true
                      : catalogTypeFilter === 'series'
                      ? m.contentType === 'series'
                      : catalogTypeFilter === 'anime'
                      ? m.genre.includes('Anime') || m.genre.includes('Animation')
                      : m.contentType === 'movie' || !m.contentType;
                  return matchesSearch && matchesType;
                });

                return (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    {/* Top Catalog Toolbar & Stats Header */}
                    <div className="bg-[#1b1e1f] border border-white/10 p-5 rounded-2xl space-y-4 shadow-xl">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#c0342c] to-[#ffb4aa] flex items-center justify-center text-white shadow-md">
                            <Film className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-base font-display flex items-center gap-2">
                              <span>Whoosh Master Catalog</span>
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#c0342c] text-white">
                                {movies.length} Published
                              </span>
                            </h4>
                            <p className="text-xs text-white/50">
                              Manage full library entries, remove outdated movies, update posters, and audit playback metadata.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Remove Movies Panel Toggle Button */}
                          <button
                            type="button"
                            onClick={() => setShowRemovalPanel(!showRemovalPanel)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              showRemovalPanel
                                ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 ring-2 ring-red-400'
                                : 'bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400'
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{showRemovalPanel ? 'Exit Removal Mode' : 'Remove Movies Panel'}</span>
                            {selectedMovieIdsForPurge.length > 0 && (
                              <span className="px-1.5 py-0.2 bg-white text-red-600 rounded-full text-[10px] font-black ml-1">
                                {selectedMovieIdsForPurge.length}
                              </span>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveTab('studio')}
                            className="px-3 py-2 bg-[#ffb4aa]/15 hover:bg-[#ffb4aa]/25 border border-[#ffb4aa]/40 text-[#ffb4aa] text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Poster Studio</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveTab('upload')}
                            className="px-3.5 py-2 bg-gradient-to-r from-[#c0342c] to-[#e6392f] hover:from-[#d13a30] hover:to-[#f0453a] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Upload Title</span>
                          </button>
                        </div>
                      </div>

                      {/* Search and Filters Bar */}
                      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-white/10">
                        <div className="relative flex-1 w-full">
                          <input
                            type="text"
                            value={catalogSearchQuery}
                            onChange={(e) => setCatalogSearchQuery(e.target.value)}
                            placeholder="Search catalog by title, genre, or director..."
                            className="w-full bg-[#121414] border border-white/15 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#ffb4aa]"
                          />
                          <Film className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                          {catalogSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setCatalogSearchQuery('')}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1 bg-[#121414] p-1 rounded-xl border border-white/10 shrink-0 self-start sm:self-center">
                          {(['all', 'movie', 'series', 'anime'] as const).map((tabKey) => (
                            <button
                              key={tabKey}
                              type="button"
                              onClick={() => setCatalogTypeFilter(tabKey)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                                catalogTypeFilter === tabKey
                                  ? 'bg-[#c0342c] text-white'
                                  : 'text-white/60 hover:text-white'
                              }`}
                            >
                              {tabKey}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Dedicated Movie Removal & Batch Purge Panel (Shown when active or items selected) */}
                    {(showRemovalPanel || selectedMovieIdsForPurge.length > 0) && (
                      <div className="bg-gradient-to-r from-red-950/40 via-[#1e1313] to-red-950/40 border-2 border-red-500/50 p-4 rounded-2xl space-y-3 animate-in fade-in shadow-2xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow">
                              <Trash2 className="w-4 h-4" />
                            </div>
                            <div>
                              <h5 className="text-sm font-bold text-white flex items-center gap-2">
                                <span>Catalog Removal & Bulk Purge Station</span>
                                <span className="px-2 py-0.5 rounded bg-red-500/30 border border-red-500 text-red-300 text-[10px] font-mono">
                                  {selectedMovieIdsForPurge.length} selected for deletion
                                </span>
                              </h5>
                              <p className="text-xs text-white/60">
                                Select individual titles using the check overlays, or purge multiple titles at once.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => handleSelectAllMoviesForPurge(filteredCatalog)}
                              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-xl cursor-pointer"
                            >
                              {selectedMovieIdsForPurge.length === filteredCatalog.length && filteredCatalog.length > 0
                                ? 'Deselect All'
                                : 'Select All Visible'}
                            </button>

                            {selectedMovieIdsForPurge.length > 0 && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setSelectedMovieIdsForPurge([])}
                                  className="px-3 py-1.5 bg-white/5 hover:bg-white/15 text-white/70 text-xs font-semibold rounded-xl cursor-pointer"
                                >
                                  Clear
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShowBatchDeleteConfirm(true)}
                                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/50 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Purge {selectedMovieIdsForPurge.length} Titles Permanently</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Catalog Grid */}
                    {filteredCatalog.length === 0 ? (
                      <div className="bg-[#1b1e1f] border border-white/10 rounded-2xl p-10 text-center space-y-3">
                        <Film className="w-10 h-10 text-white/20 mx-auto" />
                        <h5 className="text-sm font-bold text-white">No titles match your filter</h5>
                        <p className="text-xs text-white/50">
                          Try searching for another keyword or clear the active filter tabs.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setCatalogSearchQuery('');
                            setCatalogTypeFilter('all');
                          }}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl cursor-pointer"
                        >
                          Reset Filters
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCatalog.map((m) => {
                          const isSelectedForPurge = selectedMovieIdsForPurge.includes(m.id);

                          return (
                            <div
                              key={m.id}
                              className={`bg-[#1b1e1f] border rounded-2xl overflow-hidden transition-all flex flex-col justify-between group ${
                                isSelectedForPurge
                                  ? 'border-red-500 ring-2 ring-red-500/50 bg-red-950/10'
                                  : 'border-white/10 hover:border-white/25 hover:shadow-xl'
                              }`}
                            >
                              <div className="relative aspect-video w-full overflow-hidden bg-[#121414]">
                                <img
                                  src={m.backdropUrl || BACKDROP_PRESETS[0].url}
                                  alt={m.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1b1e1f] via-black/20 to-black/40"></div>

                                {/* Top Left Badges */}
                                <div className="absolute top-2.5 left-2.5 flex gap-1.5 items-center">
                                  {m.isFeatured && (
                                    <span className="px-2 py-0.5 bg-[#c0342c] text-white text-[9px] font-black rounded-full uppercase tracking-wider shadow">
                                      👑 Featured
                                    </span>
                                  )}
                                  <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md border border-white/15 text-white text-[9px] font-bold rounded-full">
                                    {m.contentType?.toUpperCase() || 'MOVIE'}
                                  </span>
                                  <span className="px-1.5 py-0.5 bg-black/60 text-emerald-400 text-[9px] font-bold rounded-full">
                                    {m.matchScore}% Match
                                  </span>
                                </div>

                                {/* Selection Checkbox Overlay (For batch purge) */}
                                <div className="absolute top-2.5 right-2.5">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleSelectMovieForPurge(m.id);
                                    }}
                                    className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                                      isSelectedForPurge
                                        ? 'bg-red-600 border-red-400 text-white shadow-lg scale-110'
                                        : 'bg-black/60 hover:bg-black/80 border-white/30 text-white/50 hover:text-white'
                                    }`}
                                    title={isSelectedForPurge ? 'Deselect from purge' : 'Select for purge'}
                                  >
                                    <Check className={`w-4 h-4 ${isSelectedForPurge ? 'opacity-100 stroke-[3]' : 'opacity-0'}`} />
                                  </button>
                                </div>

                                {/* Title & Year Overlay */}
                                <div className="absolute bottom-2.5 left-3 right-3">
                                  <h5 className="font-display font-bold text-base text-white truncate drop-shadow-md">
                                    {m.title}
                                  </h5>
                                  <div className="flex items-center gap-2 text-[11px] text-white/70">
                                    <span>{m.year}</span>
                                    <span>•</span>
                                    <span>{m.duration}</span>
                                    <span>•</span>
                                    <span className="text-[#ffb4aa] truncate">{m.genre.slice(0, 2).join(', ')}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="p-3.5 space-y-3">
                                <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                                  {m.synopsis}
                                </p>

                                {/* Cast & Director Footer Info */}
                                <div className="text-[11px] text-white/50 flex items-center justify-between pt-1 border-t border-white/5">
                                  <span className="truncate">Dir: <strong className="text-white/80">{m.director || 'Shaikh Owais'}</strong></span>
                                  <span>{m.cast?.length || 2} Cast Members</span>
                                </div>

                                {/* Actions Toolbar */}
                                <div className="flex items-center justify-between pt-2 border-t border-white/10 gap-2">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onSelectMovie(m);
                                        onClose();
                                      }}
                                      className="px-2.5 py-1 bg-white/5 hover:bg-white/15 text-white/80 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                                    >
                                      Details
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingMoviePoster(m);
                                        setQuickPosterUrl(m.posterUrl || m.backdropUrl);
                                        setQuickBackdropUrl(m.backdropUrl);
                                      }}
                                      className="px-2.5 py-1 bg-[#ffb4aa]/15 hover:bg-[#ffb4aa]/30 border border-[#ffb4aa]/30 text-[#ffb4aa] text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                                      title="Change Poster Artwork"
                                    >
                                      <ImageIcon className="w-3 h-3" />
                                      <span>Poster</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        onPlayMovie(m);
                                        onClose();
                                      }}
                                      className="px-2.5 py-1 bg-[#c0342c]/20 hover:bg-[#c0342c]/40 text-[#ffb4aa] text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                                    >
                                      <Play className="w-3 h-3 fill-current" />
                                      <span>Play</span>
                                    </button>
                                  </div>

                                  {/* Prominent Remove Movie Button with Confirmation */}
                                  <button
                                    type="button"
                                    onClick={() => setMovieToDelete(m)}
                                    className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-red-300 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer shrink-0"
                                    title="Remove this movie from catalog"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Remove</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ======================================================== */}
              {/* TAB 4: CLOUD OPS & TRANSCODING */}
              {/* ======================================================== */}
              {activeTab === 'ops' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* System Overview Diagram */}
                  <div className="bg-[#1b1e1f] border border-white/10 rounded-2xl p-5 space-y-4">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Server className="w-4 h-4 text-[#ffb964]" />
                      <span>Cloud Architecture Topology</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-[#141516] p-3.5 rounded-xl border border-white/10 space-y-1">
                        <div className="text-white font-bold flex items-center gap-1.5">
                          <Cpu className="w-4 h-4 text-[#ffb4aa]" />
                          <span>Ingestion Microservice</span>
                        </div>
                        <p className="text-[11px] text-white/50">
                          FFmpeg GPU cluster transcoding into 4K CMAF, HLS & AV1 renditions.
                        </p>
                        <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
                          ● Cluster Healthy (8 Nodes)
                        </span>
                      </div>

                      <div className="bg-[#141516] p-3.5 rounded-xl border border-white/10 space-y-1">
                        <div className="text-white font-bold flex items-center gap-1.5">
                          <Wifi className="w-4 h-4 text-blue-400" />
                          <span>Global Edge CDN</span>
                        </div>
                        <p className="text-[11px] text-white/50">
                          Anycast routing with sub-18ms TTFB across Asia, EU, and US hubs.
                        </p>
                        <span className="text-[10px] text-blue-400 font-semibold block mt-1">
                          ● 99.98% Cache Hit Ratio
                        </span>
                      </div>

                      <div className="bg-[#141516] p-3.5 rounded-xl border border-white/10 space-y-1">
                        <div className="text-white font-bold flex items-center gap-1.5">
                          <Database className="w-4 h-4 text-[#ffb964]" />
                          <span>Entitlement & Auth Gate</span>
                        </div>
                        <p className="text-[11px] text-white/50">
                          Real-time JWT token verification and DRM key rotation.
                        </p>
                        <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
                          ● Latency: 2.1ms
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Transcoding Queue */}
                  <div className="bg-[#1b1e1f] border border-white/10 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#ffb4aa]" />
                        <span>Active Video Transcoding Pipeline</span>
                      </h4>
                      <button
                        onClick={() => {
                          const newJob: MediaJob = {
                            id: `job_${Date.now()}`,
                            title: 'Chrono_Shift_Master_ProRes422.mov',
                            status: 'in-progress',
                            progress: 25,
                            codec: 'AV1 + Dolby E-AC3 (4K HDR)',
                            targetBitrate: '24 Mbps',
                            createdAt: 'Just now',
                            eta: '1m 15s',
                          };
                          setJobs([newJob, ...jobs]);
                          onShowToast('Queued new 4K transcoding job');
                        }}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Simulate Ingestion</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {jobs.map((j) => (
                        <div
                          key={j.id}
                          className="bg-[#141516] border border-white/10 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="font-bold text-white">{j.title}</div>
                            <div className="text-[10px] text-white/50">{j.codec} • {j.duration || '2h 10m'}</div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-[#252829] h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-[#c0342c] h-full rounded-full transition-all duration-300"
                                style={{ width: `${j.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-[11px] font-bold text-[#ffb4aa] w-10 text-right">
                              {j.progress}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Quick Poster & Backdrop Artwork Edit Modal */}
        {editingMoviePoster && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#1b1e1f] border border-[#ffb4aa]/40 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#c0342c]/20 border border-[#c0342c]/40 flex items-center justify-center text-[#ffb4aa]">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Update Artwork for "{editingMoviePoster.title}"</h4>
                    <p className="text-[11px] text-white/50">Replace vertical 2:3 poster or 16:9 backdrop banner.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingMoviePoster(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Side by side preview */}
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-5 space-y-1.5">
                  <span className="text-[10px] font-bold text-white/60 uppercase">Vertical Poster (2:3)</span>
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/15 bg-black">
                    <img src={quickPosterUrl || editingMoviePoster.posterUrl} alt="Poster" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="col-span-7 space-y-1.5">
                  <span className="text-[10px] font-bold text-white/60 uppercase">Backdrop Banner (16:9)</span>
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-white/15 bg-black">
                    <img src={quickBackdropUrl || editingMoviePoster.backdropUrl} alt="Backdrop" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* Poster File / URL */}
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-[#ffb4aa] block mb-1">
                    Movie Poster URL or Preset (2:3)
                  </label>
                  <input
                    type="url"
                    value={quickPosterUrl}
                    onChange={(e) => setQuickPosterUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#121414] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-[#ffb4aa]"
                  />
                  <div className="flex gap-1.5 mt-1.5 overflow-x-auto pb-1">
                    {POSTER_PRESETS.slice(0, 5).map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => setQuickPosterUrl(p.url)}
                        className="px-2 py-0.5 bg-white/5 hover:bg-white/15 border border-white/10 rounded text-[9px] text-white/70 hover:text-white shrink-0 cursor-pointer"
                      >
                        {p.theme}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#ffb964] block mb-1">
                    Backdrop Banner URL (16:9)
                  </label>
                  <input
                    type="url"
                    value={quickBackdropUrl}
                    onChange={(e) => setQuickBackdropUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#121414] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-[#ffb964]"
                  />
                  <div className="flex gap-1.5 mt-1.5 overflow-x-auto pb-1">
                    {BACKDROP_PRESETS.slice(0, 4).map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => setQuickBackdropUrl(p.url)}
                        className="px-2 py-0.5 bg-white/5 hover:bg-white/15 border border-white/10 rounded text-[9px] text-white/70 hover:text-white shrink-0 cursor-pointer"
                      >
                        {p.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingMoviePoster(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveQuickPosterEdit}
                  className="px-5 py-2 bg-[#c0342c] hover:bg-[#d63d34] text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Artwork Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Single Movie Removal Confirmation */}
        {movieToDelete && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-[#181a1b] border-2 border-red-500/50 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white font-display">Remove Movie from Catalog?</h4>
                  <p className="text-xs text-white/50">This action will unpublish the stream immediately.</p>
                </div>
              </div>

              {/* Title Summary Card */}
              <div className="p-3 bg-[#121414] rounded-xl border border-white/10 flex items-center gap-3">
                <div className="w-14 aspect-[2/3] rounded-lg overflow-hidden border border-white/15 shrink-0 bg-black">
                  <img
                    src={movieToDelete.posterUrl || movieToDelete.backdropUrl}
                    alt={movieToDelete.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="overflow-hidden text-xs space-y-1">
                  <div className="font-bold text-white text-sm truncate">{movieToDelete.title}</div>
                  <div className="text-[11px] text-white/60">{movieToDelete.year} • {movieToDelete.duration} • {movieToDelete.genre.join(', ')}</div>
                  <div className="text-[10px] text-red-400 font-medium">Permanent catalog unpublish</div>
                </div>
              </div>

              <p className="text-xs text-white/70 leading-relaxed">
                Are you sure you want to permanently delete <strong>"{movieToDelete.title}"</strong>? Viewers will no longer be able to discover or stream this content.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setMovieToDelete(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Keep Title
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSingleDelete}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/40 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yes, Delete Movie</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Batch Movies Purge Confirmation */}
        {showBatchDeleteConfirm && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-[#181a1b] border-2 border-red-500 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-600/50">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white font-display">Confirm Batch Catalog Purge</h4>
                  <p className="text-xs text-white/50">{selectedMovieIdsForPurge.length} titles marked for deletion</p>
                </div>
              </div>

              <div className="p-3 bg-red-950/30 border border-red-500/40 rounded-xl text-xs text-red-200 leading-relaxed">
                ⚠️ Warning: You are about to permanently remove <strong>{selectedMovieIdsForPurge.length} titles</strong> from the Whoosh Streaming Library. This operation cannot be undone.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowBatchDeleteConfirm(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleConfirmBatchDelete();
                    setShowBatchDeleteConfirm(false);
                  }}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/50 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Purge {selectedMovieIdsForPurge.length} Titles</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
