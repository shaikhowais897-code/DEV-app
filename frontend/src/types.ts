export interface CastMember {
  name: string;
  role: string;
  avatar: string;
}

export interface VideoRendition {
  resolution: '4K Ultra HD' | '1080p Full HD' | '720p HD' | '480p SD' | 'Auto';
  bitrate: string;
  codec: string;
}

export interface SeriesEpisode {
  id: string;
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  duration: string;
  durationSeconds: number;
  synopsis?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
}

export interface MovieRatingBreakdown {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface Movie {
  id: string;
  title: string;
  contentType?: 'movie' | 'series' | 'anime' | 'documentary';
  seasonsCount?: number;
  episodesCount?: number;
  episodes?: SeriesEpisode[];
  originalTitle?: string;
  episodeInfo?: string;
  tagline?: string;
  synopsis: string;
  year: number;
  duration: string; // e.g. "2h 15m" or "Season 1 (8 Ep)"
  durationSeconds: number;
  rating: number; // e.g. 4.8
  communityRating?: number; // average community score e.g. 4.8
  ratingCount?: number; // total count of community reviews e.g. 3420
  userRating?: number; // 1-5 star user rating if submitted
  ratingsBreakdown?: MovieRatingBreakdown;
  matchScore: number; // e.g. 98%
  genre: string[];
  badges: string[]; // e.g. ["4K Ultra HD", "Dolby Vision", "HDR10+", "5.1 Surround"]
  rankBadge?: string; // e.g. "Top 10 Today", "New Release", "Award Winner"
  backdropUrl: string;
  posterUrl: string;
  videoUrl?: string;
  director: string;
  audioInfo: string;
  subtitlesInfo: string;
  cast: CastMember[];
  relatedIds: string[];
  accessLevel: 'free' | 'premium';
  isFeatured?: boolean;
  continueProgress?: number; // percentage 0-100
  continueTimeFormatted?: string; // e.g. "45m left" or "1h 42m remaining"
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  coverImage: string;
  colSpan?: number;
  rowSpan?: number;
  accentColor?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'user';
  avatar: string;
  plan: 'Free' | 'Premium 4K HDR' | 'Family VIP';
  billingStatus: 'Active' | 'Trial' | 'Expired' | 'Suspended';
  nextBillingDate: string;
  monthlyFee?: string;
  joinedDate?: string;
  watchHours?: number;
  activeDevices?: number;
  ipRegion?: string;
  preferredQuality: 'Auto' | '4K' | '1080p' | '720p';
  preferredAudio: string;
  preferredSubtitle: string;
  autoplayNext: boolean;
}

export interface MediaJob {
  id: string;
  title: string;
  status: 'Completed' | 'Transcoding' | 'In Queue' | 'Failed' | 'completed' | 'in-progress' | 'error' | 'queued';
  progress: number;
  renditions?: string[];
  time?: string;
  duration?: string;
  codec: string;
  targetBitrate?: string;
  createdAt?: string;
  eta?: string;
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  target?: string;
  details?: string;
  timestamp: string;
  status: 'Success' | 'Warn' | 'Error' | string;
  ip: string;
}

