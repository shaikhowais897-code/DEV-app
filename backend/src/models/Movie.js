import mongoose from 'mongoose';

const castMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    avatar: { type: String, default: '' },
  },
  { _id: false }
);

const seriesEpisodeSchema = new mongoose.Schema(
  {
    episodeNumber: { type: Number, required: true },
    seasonNumber: { type: Number, required: true },
    title: { type: String, required: true },
    duration: { type: String, default: '' },
    durationSeconds: { type: Number, default: 0 },
    synopsis: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
  },
  { _id: true }
);

const movieSchema = new mongoose.Schema(
  {
    // Use a human-readable slug as the primary identifier for API compatibility
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    contentType: {
      type: String,
      enum: ['movie', 'series', 'anime', 'documentary'],
      default: 'movie',
    },
    originalTitle: { type: String, default: '' },
    episodeInfo: { type: String, default: '' },
    tagline: { type: String, default: '' },
    synopsis: {
      type: String,
      required: [true, 'Synopsis is required'],
      maxlength: [2000, 'Synopsis cannot exceed 2000 characters'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
    },
    duration: {
      type: String,
      required: true,
    },
    durationSeconds: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    communityRating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    ratingsBreakdown: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 },
    },
    matchScore: { type: Number, default: 0, min: 0, max: 100 },
    genre: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => v.length > 0,
        message: 'At least one genre is required',
      },
    },
    badges: { type: [String], default: [] },
    rankBadge: { type: String, default: '' },
    backdropUrl: { type: String, default: '' },
    posterUrl: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    director: {
      type: String,
      required: [true, 'Director is required'],
    },
    audioInfo: { type: String, default: '' },
    subtitlesInfo: { type: String, default: '' },
    cast: { type: [castMemberSchema], default: [] },
    relatedSlugs: { type: [String], default: [] },
    accessLevel: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free',
    },
    isFeatured: { type: Boolean, default: false },
    seasonsCount: { type: Number, default: 0 },
    episodesCount: { type: Number, default: 0 },
    episodes: { type: [seriesEpisodeSchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        // Map _id to id, and slug to id for frontend compatibility
        ret.id = ret.slug;
        delete ret._id;
        delete ret.__v;
        // Map relatedSlugs to relatedIds for frontend compatibility
        ret.relatedIds = ret.relatedSlugs || [];
        delete ret.relatedSlugs;
        return ret;
      },
    },
  }
);

// Indexes for common query patterns
movieSchema.index({ genre: 1 });
movieSchema.index({ accessLevel: 1 });
movieSchema.index({ isFeatured: 1 });
movieSchema.index({ rating: -1 });
movieSchema.index({ year: -1 });
movieSchema.index({ title: 'text', synopsis: 'text', director: 'text' });

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
