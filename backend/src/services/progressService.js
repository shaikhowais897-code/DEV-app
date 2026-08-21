import WatchProgress from '../models/WatchProgress.js';
import Movie from '../models/Movie.js';
import ApiError from '../utils/ApiError.js';

class ProgressService {
  /**
   * Get all continue-watching items for a user.
   * Returns items that are not completed (progress < 95%).
   */
  async getContinueWatching(userId) {
    const entries = await WatchProgress.find({
      userId,
      completed: false,
      progressPercent: { $gt: 0, $lt: 95 },
    }).sort({ updatedAt: -1 });

    const slugs = entries.map((e) => e.movieSlug);
    const movies = await Movie.find({ slug: { $in: slugs } });
    const movieMap = new Map(movies.map((m) => [m.slug, m]));

    return entries
      .map((entry) => {
        const movie = movieMap.get(entry.movieSlug);
        if (!movie) return null;

        const movieObj = movie.toJSON();
        movieObj.continueProgress = entry.progressPercent;

        // Calculate remaining time
        const remainingSeconds =
          movie.durationSeconds * ((100 - entry.progressPercent) / 100);
        movieObj.continueTimeFormatted = this._formatRemainingTime(remainingSeconds);

        return movieObj;
      })
      .filter(Boolean);
  }

  /**
   * Update playback progress for a movie.
   */
  async updateProgress(userId, movieSlug, progressPercent, lastPositionSeconds) {
    // Verify movie exists
    const movie = await Movie.findOne({ slug: movieSlug });
    if (!movie) {
      throw ApiError.notFound(`Movie '${movieSlug}' not found`);
    }

    const completed = progressPercent >= 95;

    const progress = await WatchProgress.findOneAndUpdate(
      { userId, movieSlug },
      {
        progressPercent,
        lastPositionSeconds: lastPositionSeconds || 0,
        completed,
      },
      { upsert: true, new: true }
    );

    return progress;
  }

  /**
   * Format remaining time in human-readable form.
   */
  _formatRemainingTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m left`;
  }
}

export default new ProgressService();
