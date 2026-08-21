import Watchlist from '../models/Watchlist.js';
import Movie from '../models/Movie.js';
import ApiError from '../utils/ApiError.js';

class WatchlistService {
  /**
   * Get user's watchlist with populated movie details.
   */
  async getWatchlist(userId) {
    const entries = await Watchlist.find({ userId }).sort({ createdAt: -1 });
    const slugs = entries.map((e) => e.movieSlug);

    // Fetch movie details for each watchlist entry
    const movies = await Movie.find({ slug: { $in: slugs } });

    // Maintain watchlist order
    const movieMap = new Map(movies.map((m) => [m.slug, m]));
    return slugs
      .map((slug) => movieMap.get(slug))
      .filter(Boolean);
  }

  /**
   * Add a movie to the user's watchlist.
   */
  async addToWatchlist(userId, movieSlug) {
    // Verify movie exists
    const movie = await Movie.findOne({ slug: movieSlug });
    if (!movie) {
      throw ApiError.notFound(`Movie '${movieSlug}' not found`);
    }

    try {
      await Watchlist.create({ userId, movieSlug });
    } catch (error) {
      if (error.code === 11000) {
        throw ApiError.conflict('Movie already in watchlist');
      }
      throw error;
    }

    return movie;
  }

  /**
   * Remove a movie from the user's watchlist.
   */
  async removeFromWatchlist(userId, movieSlug) {
    const result = await Watchlist.findOneAndDelete({ userId, movieSlug });
    if (!result) {
      throw ApiError.notFound('Movie not in watchlist');
    }
    return result;
  }

  /**
   * Check if a movie is in the user's watchlist.
   */
  async isInWatchlist(userId, movieSlug) {
    const entry = await Watchlist.findOne({ userId, movieSlug });
    return !!entry;
  }
}

export default new WatchlistService();
