/**
 * Database seeder — migrates existing frontend mock data to MongoDB.
 * Run: cd backend && node src/utils/seed.js
 */
import mongoose from 'mongoose';
import connectDB from '../config/database.js';
import logger from '../config/logger.js';
import User from '../models/User.js';
import Movie from '../models/Movie.js';
import AuditLog from '../models/AuditLog.js';
import Watchlist from '../models/Watchlist.js';
import WatchProgress from '../models/WatchProgress.js';

// ─── Seed Data (from frontend src/data/movies.ts) ──────────

const SEED_USERS = [
  {
    name: 'Shaikh Owais',
    email: 'shaikhowais897@gmail.com',
    passwordHash: 'WhooshAdmin2026!#',
    role: 'admin',
    avatar: '',
    plan: 'Family VIP',
    billingStatus: 'Active',
    nextBillingDate: 'Oct 01, 2026',
    monthlyFee: '$19.99',
    joinedDate: 'Jan 12, 2025',
    watchHours: 348,
    activeDevices: 5,
    ipRegion: 'Asia-South (Mumbai/Singapore)',
    preferredQuality: '4K',
    preferredAudio: 'English (Dolby Atmos 5.1)',
    preferredSubtitle: 'English',
    autoplayNext: true,
  },
  {
    name: 'Elena Rostova',
    email: 'elena.r@stream.net',
    passwordHash: 'Subscriber2026!',
    role: 'user',
    avatar: '',
    plan: 'Premium 4K HDR',
    billingStatus: 'Active',
    nextBillingDate: 'Sept 14, 2026',
    monthlyFee: '$14.99',
    joinedDate: 'Mar 04, 2025',
    watchHours: 112,
    activeDevices: 3,
    ipRegion: 'EU-Central (Frankfurt)',
    preferredQuality: 'Auto',
    preferredAudio: 'Original (Dolby Atmos)',
    preferredSubtitle: 'English',
    autoplayNext: true,
  },
  {
    name: 'Marcus & Family',
    email: 'marcus.v@familycast.io',
    passwordHash: 'Family2026!',
    role: 'user',
    plan: 'Family VIP',
    billingStatus: 'Active',
    nextBillingDate: 'Sept 28, 2026',
    monthlyFee: '$19.99',
    joinedDate: 'Nov 18, 2024',
    watchHours: 420,
    activeDevices: 6,
    preferredQuality: '4K',
    preferredAudio: 'English (Dolby Atmos 5.1)',
    preferredSubtitle: 'Off',
    autoplayNext: true,
  },
  {
    name: 'Zoe Tanaka',
    email: 'zoe.tanaka@gmail.com',
    passwordHash: 'FreeTier2026!',
    role: 'user',
    plan: 'Free',
    billingStatus: 'Trial',
    nextBillingDate: 'Aug 30, 2026',
    monthlyFee: '$0.00',
    joinedDate: 'Aug 02, 2026',
    watchHours: 18,
    activeDevices: 1,
    preferredQuality: '720p',
    preferredAudio: 'Japanese',
    preferredSubtitle: 'English',
    autoplayNext: false,
  },
];

const SEED_MOVIES = [
  {
    slug: 'interstellar-voyage',
    title: 'Interstellar Voyage',
    tagline: "Beyond the edge of the known universe",
    synopsis: "When humanity's last hope rests on a desperate mission beyond the edge of the known universe, a team of scientists must confront the unknown to secure our future.",
    year: 2024,
    duration: '2h 38m',
    durationSeconds: 9480,
    rating: 4.9,
    communityRating: 4.9,
    ratingCount: 3200,
    matchScore: 99,
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    badges: ['4K Ultra HD', 'Dolby Vision', 'Dolby Atmos'],
    rankBadge: 'Featured Premiere',
    backdropUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYxAoIL2F1MEFlp2el4z7snk5ErabdpYt93Iuipa0SradRs-UVCLNubTrXUgHOEOedXnaoax4vMzRqDcU3rFW0D1sVU9DInnZF10DAST7r0lroTgHjdzIoM1pr7haqrJhlvmwAAy6PcP6vqkJ0jrQ5R7SWXCMMetjsGvG7WXmBxshjXMciqzyECL0pXssQG-Bq0o5GLgs5vdeim7uU8JNjrLzVPA679M8OdOY5V_FE-3-UxUJFykuz2w',
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYxAoIL2F1MEFlp2el4z7snk5ErabdpYt93Iuipa0SradRs-UVCLNubTrXUgHOEOedXnaoax4vMzRqDcU3rFW0D1sVU9DInnZF10DAST7r0lroTgHjdzIoM1pr7haqrJhlvmwAAy6PcP6vqkJ0jrQ5R7SWXCMMetjsGvG7WXmBxshjXMciqzyECL0pXssQG-Bq0o5GLgs5vdeim7uU8JNjrLzVPA679M8OdOY5V_FE-3-UxUJFykuz2w',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    director: 'Christopher Nolan & Elara Vance',
    audioInfo: 'Dolby Atmos, 7.1 Surround, Dolby Audio',
    subtitlesInfo: 'English [CC], Spanish, French, German, Japanese, +12',
    cast: [
      { name: 'Matthew Thorne', role: 'Commander Cooper', avatar: '' },
      { name: 'Dr. Evelyn Brand', role: 'Chief Astrobiologist', avatar: '' },
      { name: 'T.A.R.S. Core', role: 'Tactical AI', avatar: '' },
    ],
    relatedSlugs: ['neon-resonance', 'quantum-rift', 'stellar-burn', 'neon-horizon'],
    accessLevel: 'premium',
    isFeatured: true,
  },
  {
    slug: 'neon-resonance',
    title: 'Neon Resonance',
    tagline: 'Memories are the only currency left',
    synopsis: 'In a dystopian metropolis where memories are currency, a rogue archivist discovers a fragmented recording that could dismantle the ruling corporation.',
    year: 2024,
    duration: '2h 15m',
    durationSeconds: 8100,
    rating: 4.8,
    communityRating: 4.8,
    ratingCount: 2800,
    matchScore: 98,
    genre: ['Sci-Fi', 'Cyberpunk', 'Action', 'Thriller'],
    badges: ['4K Ultra HD', 'Dolby Atmos', 'HDR10+'],
    rankBadge: 'New Release',
    backdropUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAf0Jsw5do-B590ZocWfw3aif_N9QP4M6UKT7J92u7oECkAN1G5iAwqCSSZwYhsQdw491pgc9L1OMjCQCfwdTJBam5uWqU_Rq4IMVaN2GH4Z0mtQhm25jt2cmq9TXT0CQQ2x5GDUhyFToUz44U29V-kD5soEdWwqWCc-QhDu2PtIB1_lmIHGl5NmYnQZZLCNDPQ2QNPXjLfWNOn6BjkU_XNKDLCqlr88V1SyqxgapGuTR0NTRn7gsyjqA',
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2-OnFEcmYTPtcbeBx6slcJxuxufRMdQvuYueZiakAFYhkmrVTXzOiY3d_xVLPAt_k5VLRrXMkviVlNUVkeqkEpZFPnfDq_s9-rGgfV4LKmJ-QgopwmpTKIVPEhUZ9YLeHbZMqOAoxh8dzgY_XvkvnxiCvAhQZ8rqqGwX-UDR14F__5JlvXddmNXhr1N4ZreY0wdq-_ds8IlNWw7NZu0ZJ5QfGCGn0KIKsa6ZrqBhTKf8TOBy_ZOSJLQ',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    director: 'Elara Vance',
    audioInfo: 'Dolby Atmos, 5.1 Surround',
    subtitlesInfo: 'English, Spanish, French, +5',
    cast: [
      { name: 'J. Doe', role: 'Lead', avatar: '' },
      { name: 'A. Smith', role: 'Archivist', avatar: '' },
    ],
    relatedSlugs: ['cyber-storm', 'void-protocol', 'echoes-of-tomorrow', 'synthetic-soul'],
    accessLevel: 'premium',
    isFeatured: true,
  },
  {
    slug: 'nebula-drift',
    title: 'Nebula Drift',
    episodeInfo: 'S1:E4 "The Void"',
    tagline: 'Deep space holds secrets no map can show',
    synopsis: 'Trapped inside an uncharted anomaly in the Orion nebula, the crew of the exploratory cruiser must decipher synthetic radio beacons before gravitational collapse.',
    year: 2024,
    duration: '45m',
    durationSeconds: 2700,
    rating: 4.7,
    communityRating: 4.7,
    ratingCount: 1500,
    matchScore: 96,
    genre: ['Sci-Fi', 'Mystery', 'Space Opera'],
    badges: ['4K Ultra HD', 'Dolby Atmos'],
    rankBadge: 'Trending Series',
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKZVu7IfzsgDxj8ckZXrO2yMoREZ9D_dKYV90QBe_4Qe0XXZlV_WT-bmt8ewLssUznmkuzGDsf8_TJxeCcAHorly9hhxi1C59tC6VN1FcGO6hE9WFALW45AEmQFKP3GIQJlvk7Q-7YPpA9hZId-fIWKVfC-YeKWASw2haMkP6KAHT6KGZoM_OHkR3y_mSI6l6FG9wZaEzvIujVLIVoxV1rqdFDw0msoWD1rnJsJHwGgf8_SaNIha-tEQ',
    backdropUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKZVu7IfzsgDxj8ckZXrO2yMoREZ9D_dKYV90QBe_4Qe0XXZlV_WT-bmt8ewLssUznmkuzGDsf8_TJxeCcAHorly9hhxi1C59tC6VN1FcGO6hE9WFALW45AEmQFKP3GIQJlvk7Q-7YPpA9hZId-fIWKVfC-YeKWASw2haMkP6KAHT6KGZoM_OHkR3y_mSI6l6FG9wZaEzvIujVLIVoxV1rqdFDw0msoWD1rnJsJHwGgf8_SaNIha-tEQ',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    director: 'Darius Thorne',
    audioInfo: 'Dolby Atmos, 5.1 Surround',
    subtitlesInfo: 'English, Spanish, German, Japanese',
    cast: [
      { name: 'Kaelen Vance', role: 'Captain Jaxon', avatar: '' },
      { name: 'Lyra Thorne', role: 'Chief Engineer', avatar: '' },
    ],
    relatedSlugs: ['interstellar-voyage', 'stellar-burn'],
    accessLevel: 'premium',
  },
  {
    slug: 'cipher-protocol',
    title: 'The Cipher Protocol',
    episodeInfo: 'S2:E4 "Checkmate"',
    synopsis: 'A tense spy thriller set in a rainy European metropolis. Secret intelligence analyst Marcus Cross uncovers an undercover cabal within the agency itself.',
    year: 2024,
    duration: '52m',
    durationSeconds: 3120,
    rating: 4.8,
    communityRating: 4.8,
    ratingCount: 2100,
    matchScore: 97,
    genre: ['Thriller', 'Crime', 'Drama'],
    badges: ['4K Ultra HD', '5.1 Audio'],
    rankBadge: 'Popular',
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcLR5eenoMQlQ3USdMrVssqj3y18zExxv9rjW9wAo2kzgpFeJbgq7eSlIPvcbzgjSC7fQk-Yy8rJJU-Fj_kMikjbY1GaaneD8Rln-shNTQGHrv99tWqsWc5WZrOx4yEzE9WUt2e11Kh1FKFG9OJ0ngJMc-8cT5ksEr-6A4C9NaaePs04rwLBsegHlOjjDYBBmLPt262J2VMCnGDFzR4sfyV8huniirG7uel4tj5H7fqJAHXSTXuXFQbw',
    backdropUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcLR5eenoMQlQ3USdMrVssqj3y18zExxv9rjW9wAo2kzgpFeJbgq7eSlIPvcbzgjSC7fQk-Yy8rJJU-Fj_kMikjbY1GaaneD8Rln-shNTQGHrv99tWqsWc5WZrOx4yEzE9WUt2e11Kh1FKFG9OJ0ngJMc-8cT5ksEr-6A4C9NaaePs04rwLBsegHlOjjDYBBmLPt262J2VMCnGDFzR4sfyV8huniirG7uel4tj5H7fqJAHXSTXuXFQbw',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    director: 'Viktor Romanov',
    audioInfo: 'Dolby Atmos, 5.1 Surround',
    subtitlesInfo: 'English, French, German',
    cast: [{ name: 'Marcus Cross', role: 'Special Agent', avatar: '' }],
    relatedSlugs: ['night-shift', 'whoosh-drift', 'void-protocol'],
    accessLevel: 'free',
  },
  {
    slug: 'realms-of-aethelgard',
    title: 'Realms of Aethelgard',
    tagline: 'Ancient ruins awake under twin moons',
    synopsis: 'A grand fantasy saga following a banished paladin who must assemble legendary relics to protect the mystical sanctum of Aethelgard from a rising shadow titan.',
    year: 2024,
    duration: '2h 24m',
    durationSeconds: 8640,
    rating: 4.9,
    communityRating: 4.9,
    ratingCount: 2900,
    matchScore: 98,
    genre: ['Fantasy', 'Adventure', 'Action'],
    badges: ['4K Ultra HD', 'Dolby Vision'],
    rankBadge: 'Critically Acclaimed',
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBftcKybp9virxYDTaV-RUy1K3IgfMQ8vUI5lco_7lGUYZE_dnckbMw3lQoUXZhZJYHqQikEOi8GtCpzE9O2f9n1K85OmR-77Bjo08WY2GiKuGhB3zTpLX-yjH6krrNKUOMngCcGXbbEhGd3qxy0oDAYVVSDjsYiAWCkiUucjacA2epMlDi8xLtGPnqhJyUWY2jDfB97ekWPIBqQFfnuJngW73ArBpobhGD3_i0YVhbhCKKpPi8tRzn6w',
    backdropUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBftcKybp9virxYDTaV-RUy1K3IgfMQ8vUI5lco_7lGUYZE_dnckbMw3lQoUXZhZJYHqQikEOi8GtCpzE9O2f9n1K85OmR-77Bjo08WY2GiKuGhB3zTpLX-yjH6krrNKUOMngCcGXbbEhGd3qxy0oDAYVVSDjsYiAWCkiUucjacA2epMlDi8xLtGPnqhJyUWY2jDfB97ekWPIBqQFfnuJngW73ArBpobhGD3_i0YVhbhCKKpPi8tRzn6w',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    director: 'Kaelen Vance',
    audioInfo: 'Dolby Atmos, 7.1 Audio',
    subtitlesInfo: 'English, Spanish, Italian, Japanese',
    cast: [{ name: 'Kaelen Vance', role: 'Paladin Eldor', avatar: '' }],
    relatedSlugs: ['epic-drama', 'interstellar-voyage', 'neon-resonance'],
    accessLevel: 'premium',
  },
  {
    slug: 'night-shift',
    title: 'Night Shift',
    tagline: "In every city, there's a dark corner",
    synopsis: 'A seasoned neo-noir detective investigates a string of high-profile disappearances in the city underworld, uncovering ties to top political dynasties.',
    year: 2024,
    duration: '1h 58m',
    durationSeconds: 7080,
    rating: 4.7,
    matchScore: 98,
    genre: ['Thriller', 'Crime', 'Mystery'],
    badges: ['4K Ultra HD', 'Dolby Audio'],
    rankBadge: '98% Match',
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAFR6vGJp33z4BC1k5iWH1U8-pIvE4dXNf5TGxmODvqSDypeHNwfhjI6Y7Aj8ciJC8uJJ7ewDQKc_rlkDMVosa5cyZIa0-xCuirbIpXfxDJcfcwE_OMsv-2HQu6O15iQoMXaKPDRN3YGch40g9s5q0W5r32pAa0z-uxkzp8nrRIBj79BO-IRwaRE8EhKhJlIdPWgcAO8E2H_4D5uiQ2AywD94lE9OWOiSbzNyHH0kE2UXQHGJkgr9zQw',
    backdropUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAFR6vGJp33z4BC1k5iWH1U8-pIvE4dXNf5TGxmODvqSDypeHNwfhjI6Y7Aj8ciJC8uJJ7ewDQKc_rlkDMVosa5cyZIa0-xCuirbIpXfxDJcfcwE_OMsv-2HQu6O15iQoMXaKPDRN3YGch40g9s5q0W5r32pAa0z-uxkzp8nrRIBj79BO-IRwaRE8EhKhJlIdPWgcAO8E2H_4D5uiQ2AywD94lE9OWOiSbzNyHH0kE2UXQHGJkgr9zQw',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    director: 'Aiden Brooks',
    audioInfo: '5.1 Surround',
    subtitlesInfo: 'English, Spanish',
    cast: [{ name: 'Detective Cole', role: 'Lead Detective', avatar: '' }],
    relatedSlugs: ['cipher-protocol', 'whoosh-drift'],
    accessLevel: 'free',
  },
  {
    slug: 'whoosh-drift',
    title: 'Whoosh: The Thrill is Real',
    tagline: 'Coming soon to stream: A high-octane thrill ride',
    synopsis: 'An underground street-racing champion gets caught between rival racing syndicates and high-tech automotive espionage across treacherous mountain passes.',
    year: 2024,
    duration: '2h 04m',
    durationSeconds: 7440,
    rating: 4.8,
    matchScore: 97,
    genre: ['Action', 'Thriller', 'Automotive'],
    badges: ['4K HDR', 'Dolby Vision', 'Dolby Atmos'],
    rankBadge: 'Top 10 Today',
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNR8ORTAp3K1irE6l9t-RqYjyNCT2vcmBlZXn6RKHr0PTLw-Gh7V-1DNtGPuIQwPNGbQcOVeDvEjOPkk8nRP7lsUmlob9AlX2lNhLh0Aqaek2_QHQ7eDONs1rZ09T9VHqAb2dPHzWNxBPSrqxL-xLeK6OSNHjaz_P_D8HCVIBpgGw0NN_kNgzZ3UunkheOlErG3dfNrEeCrvzehmm5srDzhEgrUMyBd2cMdGrctARMk-XGUr9J2szn3A',
    backdropUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNR8ORTAp3K1irE6l9t-RqYjyNCT2vcmBlZXn6RKHr0PTLw-Gh7V-1DNtGPuIQwPNGbQcOVeDvEjOPkk8nRP7lsUmlob9AlX2lNhLh0Aqaek2_QHQ7eDONs1rZ09T9VHqAb2dPHzWNxBPSrqxL-xLeK6OSNHjaz_P_D8HCVIBpgGw0NN_kNgzZ3UunkheOlErG3dfNrEeCrvzehmm5srDzhEgrUMyBd2cMdGrctARMk-XGUr9J2szn3A',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    director: 'Jax Mercer',
    audioInfo: 'Dolby Atmos Engine Sound Mix',
    subtitlesInfo: 'English, Spanish, Portuguese',
    cast: [{ name: 'Leo Chase', role: 'Driver', avatar: '' }],
    relatedSlugs: ['neon-horizon', 'cyber-storm', 'night-shift'],
    accessLevel: 'premium',
  },
  {
    slug: 'neon-horizon',
    title: 'Neon Horizon',
    tagline: 'Overwritten or reborn: the fight for human code',
    synopsis: 'In the year 2142, a rogue AI network seizes control of the global infrastructure. A specialized operative must navigate the neon-lit depths of the underground city to find the kill switch.',
    year: 2024,
    duration: '2h 15m',
    durationSeconds: 8100,
    rating: 4.8,
    matchScore: 98,
    genre: ['Sci-Fi', 'Action', 'Cyberpunk'],
    badges: ['4K Ultra HD', 'Dolby Atmos', 'HDR10+'],
    rankBadge: 'New Release',
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxhXxEgWZbimTIGPAQu9JwJ_tKFysLSGay_h1igtDMG_B3xr_MMJTxiZW6Vsudz2jClJA7g12WTPIi1KiEfPaauGS-0-jjy2faP3TJr9HDroUcuxnryzMVGbgKR7fK2QZ6dz5MYkxN1HW9iCWScoQFaVzh9RKhMRKc5gVsywTtt0Pu5Amke3xKzc4681yloKVI6EmGGXJ2WbkYZ57akgqX2fcd4moo_Sfnl4KKzMlmcGUMiXh-An2IWw',
    backdropUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAklqIZ1LRSTrastSs9wfhKeDOzzsy7c54wcTH_qSzSd7xH9HoMMrJn8bHQER4jF2F__OB_6ZGClYJRqnJ6oFdk94-HTZLbdf4pdVbVs34QNUgVcrnGH630oRBPtCl-TeZ9itdSzLYB4Ya-Stqr41OqjFYt6I2THhu66RCap_LiIEnFdTlSY1w_H3jDZvsqyz6Y2r9gFP4cMnETGJIGUpRcLLgQxsETrZ93eNnDEsymFwkewN_1jU5zKA',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    director: 'Elena Rostova',
    audioInfo: 'Dolby Atmos, 5.1 Surround',
    subtitlesInfo: 'English, Spanish, French',
    cast: [
      { name: 'Kaelen Vance', role: 'Jaxon', avatar: '' },
      { name: 'Lyra Thorne', role: 'Dr. Aris', avatar: '' },
    ],
    relatedSlugs: ['quantum-rift', 'stellar-burn', 'neon-resonance'],
    accessLevel: 'premium',
  },
  {
    slug: 'quantum-rift',
    title: 'Quantum Rift',
    synopsis: 'A catastrophic rupture in spacetime opens a pathway to an anti-matter reality. Physicist Dr. Cole races against time to seal the anomaly.',
    year: 2024,
    duration: '2h 10m',
    durationSeconds: 7800,
    rating: 4.7,
    matchScore: 95,
    genre: ['Sci-Fi', 'Thriller'],
    badges: ['4K HDR'],
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVxQKZWTJdLg2io2M9sPmkoEv9OQlCZ2vXcXAuMQo_E9NTQIdc9VbqkgJJ_JDppqCnmf5e8cg3tEH3OxmAov-7QgRIuOE2Rh8qx2XrTeQ6u8lurvxuOnNweCtO7pzFb8b4UbD_XhK51ljkp0cj0u7rb34PxcZLDMOlFrTBzEx6qe_tesIK_d4KVIC9Fy3aCg0CEuJXdTqLquFIo0ca1OUNxqdtBFczCRiS394iXxp-lUzTR4n3iRNQ2A',
    backdropUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVxQKZWTJdLg2io2M9sPmkoEv9OQlCZ2vXcXAuMQo_E9NTQIdc9VbqkgJJ_JDppqCnmf5e8cg3tEH3OxmAov-7QgRIuOE2Rh8qx2XrTeQ6u8lurvxuOnNweCtO7pzFb8b4UbD_XhK51ljkp0cj0u7rb34PxcZLDMOlFrTBzEx6qe_tesIK_d4KVIC9Fy3aCg0CEuJXdTqLquFIo0ca1OUNxqdtBFczCRiS394iXxp-lUzTR4n3iRNQ2A',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    director: 'Elara Vance',
    audioInfo: '5.1 Surround',
    subtitlesInfo: 'English, Spanish',
    cast: [{ name: 'Dr. Cole', role: 'Lead Physicist', avatar: '' }],
    relatedSlugs: ['neon-horizon', 'stellar-burn'],
    accessLevel: 'free',
  },
  {
    slug: 'stellar-burn',
    title: 'Stellar Burn',
    synopsis: 'When a nearby star begins its premature supernova countdown, deep space miners on an orbital refinery face impossible odds of survival.',
    year: 2024,
    duration: '1h 55m',
    durationSeconds: 6900,
    rating: 4.8,
    matchScore: 97,
    genre: ['Sci-Fi', 'Action', 'Survival'],
    badges: ['4K Ultra HD', 'Dolby Atmos'],
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlimoFIlzSs26KSCkP63wKD1BiuQMIHx4oXVnfLIL-7Y7D8bKfzu-1n-23fORo3E5xGbpy9huyWuIw3MHQ_cIV33SIko2obY8CG88Mqp4fQnEmOA2frrOwZG-ya8xmTQ9pQRoT8CPL45G-ivvV3D5_WkddUiyIrvqHoP6kdkPn1kQR-N1PgEWN43zyNEe1s70gJaEVd5Q1NkwvYvzV3qrQE_1i6W9vzHZhZHcYdcafS0mi0oHl9N-CIw',
    backdropUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlimoFIlzSs26KSCkP63wKD1BiuQMIHx4oXVnfLIL-7Y7D8bKfzu-1n-23fORo3E5xGbpy9huyWuIw3MHQ_cIV33SIko2obY8CG88Mqp4fQnEmOA2frrOwZG-ya8xmTQ9pQRoT8CPL45G-ivvV3D5_WkddUiyIrvqHoP6kdkPn1kQR-N1PgEWN43zyNEe1s70gJaEVd5Q1NkwvYvzV3qrQE_1i6W9vzHZhZHcYdcafS0mi0oHl9N-CIw',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    director: 'Kai Zeller',
    audioInfo: 'Dolby Atmos',
    subtitlesInfo: 'English, French',
    cast: [{ name: 'Jack Miller', role: 'Station Lead', avatar: '' }],
    relatedSlugs: ['interstellar-voyage', 'neon-horizon'],
    accessLevel: 'premium',
  },
  {
    slug: 'epic-drama',
    title: 'Crown of Aethel',
    tagline: 'Honor, betrayal, and the rise of an empire',
    synopsis: 'A grand historical drama following a lone warrior who unites shattered nomadic tribes across the golden steppes to challenge an unyielding conqueror.',
    year: 2024,
    duration: '2h 45m',
    durationSeconds: 9900,
    rating: 4.9,
    matchScore: 99,
    genre: ['Drama', 'History', 'Action'],
    badges: ['4K Ultra HD', 'Dolby Vision', 'Dolby Atmos'],
    rankBadge: 'Award Winner',
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ9-o8yYNOXvf6DmxD8CmKKUzd3RaVJoOmO_1HY-Hiq_401Xkzxo_R9L0oFi3_3JMQlYte0Swaar495W_G75m8nmWdE80OV-H15wd_KRmyxx3PclJCaOQYhHCr8i0VQcqYK-chjlYeNF_4lDSUdZzgJCEDUO32_d6jqxiISiBFK-5AgX0G-fIL4TgJq5vM_py8m2RJ5iRXoBOLBGRc-bVycKxknY1o6Ne-LRWi8CPaIqm-TJqbg4jqjg',
    backdropUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ9-o8yYNOXvf6DmxD8CmKKUzd3RaVJoOmO_1HY-Hiq_401Xkzxo_R9L0oFi3_3JMQlYte0Swaar495W_G75m8nmWdE80OV-H15wd_KRmyxx3PclJCaOQYhHCr8i0VQcqYK-chjlYeNF_4lDSUdZzgJCEDUO32_d6jqxiISiBFK-5AgX0G-fIL4TgJq5vM_py8m2RJ5iRXoBOLBGRc-bVycKxknY1o6Ne-LRWi8CPaIqm-TJqbg4jqjg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    director: 'Marcus Aurelius Vance',
    audioInfo: 'Orchestral 7.1 Master Audio',
    subtitlesInfo: 'English, French, German, Spanish',
    cast: [{ name: 'General Thorne', role: 'Warlord', avatar: '' }],
    relatedSlugs: ['realms-of-aethelgard', 'interstellar-voyage'],
    accessLevel: 'premium',
  },
  {
    slug: 'cyber-storm',
    title: 'Cyber Storm',
    synopsis: 'A high-impact thriller tracking a hacker syndicates coordinated blackout across Mega-City One.',
    year: 2024,
    duration: '2h 05m',
    durationSeconds: 7500,
    rating: 4.6,
    matchScore: 92,
    genre: ['Cyberpunk', 'Action'],
    badges: ['4K HDR'],
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2-OnFEcmYTPtcbeBx6slcJxuxufRMdQvuYueZiakAFYhkmrVTXzOiY3d_xVLPAt_k5VLRrXMkviVlNUVkeqkEpZFPnfDq_s9-rGgfV4LKmJ-QgopwmpTKIVPEhUZ9YLeHbZMqOAoxh8dzgY_XvkvnxiCvAhQZ8rqqGwX-UDR14F__5JlvXddmNXhr1N4ZreY0wdq-_ds8IlNWw7NZu0ZJ5QfGCGn0KIKsa6ZrqBhTKf8TOBy_ZOSJLQ',
    backdropUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2-OnFEcmYTPtcbeBx6slcJxuxufRMdQvuYueZiakAFYhkmrVTXzOiY3d_xVLPAt_k5VLRrXMkviVlNUVkeqkEpZFPnfDq_s9-rGgfV4LKmJ-QgopwmpTKIVPEhUZ9YLeHbZMqOAoxh8dzgY_XvkvnxiCvAhQZ8rqqGwX-UDR14F__5JlvXddmNXhr1N4ZreY0wdq-_ds8IlNWw7NZu0ZJ5QfGCGn0KIKsa6ZrqBhTKf8TOBy_ZOSJLQ',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    director: 'Aiden Brooks',
    audioInfo: '5.1 Surround',
    subtitlesInfo: 'English, Spanish',
    cast: [],
    relatedSlugs: ['neon-resonance', 'neon-horizon'],
    accessLevel: 'free',
  },
  {
    slug: 'void-protocol',
    title: 'The Void Protocol',
    synopsis: 'A deep psychological suspense thriller exploring artificial consciousness and cold isolation in deep space.',
    year: 2024,
    duration: '1h 50m',
    durationSeconds: 6600,
    rating: 4.8,
    matchScore: 96,
    genre: ['Sci-Fi', 'Suspense'],
    badges: ['4K Ultra HD'],
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEFcR-RndyJsOI3wRYhfTckmPsUOAvucZszpJqtLRSOiXa0JAOrdixSwJ4vLUN2iqYQVFw_58hCJKW6dSTl8HS-BPimrprlWi6IYo0wnvwDaXOfeC4apx2iajRYEzt8ARBsYj-4z8FM3db3EZRqiOW6_PacakLEIuk01zsKvJMfrDjcUycgq1VShU4dwUDP5CO4FmtgiSfPxaLjrR7vA-9NKWMkFUYFw_2QkIjUmRONqltfSIV2aYueQ',
    backdropUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEFcR-RndyJsOI3wRYhfTckmPsUOAvucZszpJqtLRSOiXa0JAOrdixSwJ4vLUN2iqYQVFw_58hCJKW6dSTl8HS-BPimrprlWi6IYo0wnvwDaXOfeC4apx2iajRYEzt8ARBsYj-4z8FM3db3EZRqiOW6_PacakLEIuk01zsKvJMfrDjcUycgq1VShU4dwUDP5CO4FmtgiSfPxaLjrR7vA-9NKWMkFUYFw_2QkIjUmRONqltfSIV2aYueQ',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    director: 'Elara Vance',
    audioInfo: 'Dolby Atmos',
    subtitlesInfo: 'English, German',
    cast: [],
    relatedSlugs: ['neon-resonance', 'echoes-of-tomorrow'],
    accessLevel: 'premium',
  },
];

const SEED_AUDIT_LOGS = [
  {
    actor: 'elara.vance@whoosh.internal',
    action: 'PUBLISH_TITLE',
    target: 'Interstellar Voyage (v2.4)',
    status: 'Success',
    ip: '10.240.0.14',
  },
  {
    actor: 'system.pipeline',
    action: 'HLS_SEGMENT_CDN_WARM',
    target: 'CloudFront Edge / SG-Sin1',
    status: 'Success',
    ip: '127.0.0.1',
  },
  {
    actor: 'admin.ops',
    action: 'ENTITLEMENT_SYNC',
    target: 'Stripe Gateway Webhook Reconciliation',
    status: 'Success',
    ip: '10.240.0.1',
  },
];

// ─── Seed Execution ─────────────────────────────────────────

async function seed() {
  try {
    await connectDB();
    logger.info('🌱 Starting database seed...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Movie.deleteMany({}),
      AuditLog.deleteMany({}),
      Watchlist.deleteMany({}),
      WatchProgress.deleteMany({}),
    ]);
    logger.info('   Cleared existing data');

    // Seed users
    const users = await User.create(SEED_USERS);
    logger.info(`   Seeded ${users.length} users`);

    // Seed movies
    const movies = await Movie.create(SEED_MOVIES);
    logger.info(`   Seeded ${movies.length} movies`);

    // Seed audit logs
    const logs = await AuditLog.create(SEED_AUDIT_LOGS);
    logger.info(`   Seeded ${logs.length} audit logs`);

    // Seed watchlist for admin user (matching frontend default)
    const adminUser = users.find((u) => u.role === 'admin');
    if (adminUser) {
      const defaultWatchlist = ['interstellar-voyage', 'cipher-protocol', 'neon-resonance'];
      for (const slug of defaultWatchlist) {
        await Watchlist.create({ userId: adminUser._id, movieSlug: slug });
      }
      logger.info(`   Seeded watchlist for admin (${defaultWatchlist.length} items)`);

      // Seed watch progress for continue-watching items
      await WatchProgress.create([
        { userId: adminUser._id, movieSlug: 'nebula-drift', progressPercent: 56, lastPositionSeconds: 1512 },
        { userId: adminUser._id, movieSlug: 'cipher-protocol', progressPercent: 65, lastPositionSeconds: 2028 },
        { userId: adminUser._id, movieSlug: 'realms-of-aethelgard', progressPercent: 15, lastPositionSeconds: 1296 },
      ]);
      logger.info('   Seeded watch progress (3 items)');
    }

    logger.info('✅ Database seed completed successfully!');
    logger.info('');
    logger.info('   Admin login:');
    logger.info('   Email: shaikhowais897@gmail.com');
    logger.info('   Password: WhooshAdmin2026!#');
    logger.info('');

    process.exit(0);
  } catch (error) {
    logger.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
