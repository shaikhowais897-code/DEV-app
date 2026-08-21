import Rating from '../models/Rating.js';
import Movie from '../models/Movie.js';
import ApiError from '../utils/ApiError.js';
import logger from '../config/logger.js';

class RatingService {
  /**
   * Submit or update a user's rating for a movie.
   * Also recalculates the movie's aggregate rating.
   */
  async rateMovie(userId, movieSlug, ratingValue) {
    // Verify movie exists
    const movie = await Movie.findOne({ slug: movieSlug });
    if (!movie) {
      throw ApiError.notFound(`Movie '${movieSlug}' not found`);
    }

    // Upsert the user's rating
    await Rating.findOneAndUpdate(
      { userId, movieSlug },
      { rating: ratingValue },
      { upsert: true, new: true }
    );

    // Recalculate aggregates
    const updated = await this._recalculateRatings(movieSlug);
    logger.info(`Rating submitted: user=${userId}, movie=${movieSlug}, rating=${ratingValue}`);

    return updated;
  }

  /**
   * Remove a user's rating for a movie.
   */
  async removeRating(userId, movieSlug) {
    const result = await Rating.findOneAndDelete({ userId, movieSlug });
    if (!result) {
      throw ApiError.notFound('No rating found for this movie');
    }

    const updated = await this._recalculateRatings(movieSlug);
    logger.info(`Rating removed: user=${userId}, movie=${movieSlug}`);

    return updated;
  }

  /**
   * Get rating breakdown for a movie.
   */
  async getRatingBreakdown(movieSlug) {
    const movie = await Movie.findOne({ slug: movieSlug });
    if (!movie) {
      throw ApiError.notFound(`Movie '${movieSlug}' not found`);
    }

    return {
      communityRating: movie.communityRating,
      ratingCount: movie.ratingCount,
      ratingsBreakdown: movie.ratingsBreakdown,
    };
  }

  /**
   * Get a specific user's rating for a movie.
   */
  async getUserRating(userId, movieSlug) {
    const rating = await Rating.findOne({ userId, movieSlug });
    return rating ? rating.rating : null;
  }

  /**
   * Recalculate aggregate ratings for a movie from all individual ratings.
   */
  async _recalculateRatings(movieSlug) {
    const ratings = await Rating.find({ movieSlug });

    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalPoints = 0;

    for (const r of ratings) {
      breakdown[r.rating] = (breakdown[r.rating] || 0) + 1;
      totalPoints += r.rating;
    }

    const count = ratings.length;
    const average = count > 0 ? Number((totalPoints / count).toFixed(1)) : 0;

    const movie = await Movie.findOneAndUpdate(
      { slug: movieSlug },
      {
        communityRating: average,
        rating: average,
        ratingCount: count,
        ratingsBreakdown: breakdown,
      },
      { new: true }
    );

    return movie;
  }
}

export default new RatingService();
