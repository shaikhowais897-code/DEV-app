import Movie from '../models/Movie.js';
import Rating from '../models/Rating.js';
import ApiError from '../utils/ApiError.js';
import logger from '../config/logger.js';

class MovieService {
  /**
   * List movies with filtering, search, sorting, and pagination.
   */
  async listMovies({ page = 1, limit = 20, genre, accessLevel, search, sort, featured }) {
    const filter = {};

    if (genre) {
      filter.genre = { $regex: new RegExp(`^${genre}$`, 'i') };
    }

    if (accessLevel && ['free', 'premium'].includes(accessLevel)) {
      filter.accessLevel = accessLevel;
    }

    if (featured === 'true' || featured === true) {
      filter.isFeatured = true;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { synopsis: searchRegex },
        { director: searchRegex },
        { genre: searchRegex },
        { 'cast.name': searchRegex },
      ];
    }

    // Sorting
    let sortObj = { createdAt: -1 }; // Default: newest first
    if (sort === 'rating') sortObj = { rating: -1 };
    else if (sort === 'year') sortObj = { year: -1 };
    else if (sort === 'title') sortObj = { title: 1 };
    else if (sort === 'matchScore') sortObj = { matchScore: -1 };

    const skip = (page - 1) * limit;

    const [movies, total] = await Promise.all([
      Movie.find(filter).sort(sortObj).skip(skip).limit(limit),
      Movie.countDocuments(filter),
    ]);

    return {
      movies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get featured movies for hero carousel.
   */
  async getFeaturedMovies() {
    return Movie.find({ isFeatured: true }).sort({ rating: -1 }).limit(10);
  }

  /**
   * Get a single movie by slug.
   */
  async getMovieBySlug(slug) {
    const movie = await Movie.findOne({ slug });
    if (!movie) {
      throw ApiError.notFound(`Movie '${slug}' not found`);
    }
    return movie;
  }

  /**
   * Create a new movie (admin only).
   */
  async createMovie(data) {
    // Generate slug from title if not provided
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Check for duplicate slug
    const existing = await Movie.findOne({ slug: data.slug });
    if (existing) {
      throw ApiError.conflict(`Movie with slug '${data.slug}' already exists`);
    }

    const movie = await Movie.create(data);
    logger.info(`Movie created: ${movie.title} (${movie.slug})`);
    return movie;
  }

  /**
   * Update a movie (admin only).
   */
  async updateMovie(slug, updates) {
    // Prevent slug change to avoid breaking references
    delete updates.slug;

    const movie = await Movie.findOneAndUpdate({ slug }, updates, {
      new: true,
      runValidators: true,
    });

    if (!movie) {
      throw ApiError.notFound(`Movie '${slug}' not found`);
    }

    logger.info(`Movie updated: ${movie.title} (${movie.slug})`);
    return movie;
  }

  /**
   * Delete a movie (admin only).
   */
  async deleteMovie(slug) {
    const movie = await Movie.findOneAndDelete({ slug });
    if (!movie) {
      throw ApiError.notFound(`Movie '${slug}' not found`);
    }

    // Clean up related ratings
    await Rating.deleteMany({ movieSlug: slug });

    logger.info(`Movie deleted: ${movie.title} (${slug})`);
    return movie;
  }

  /**
   * Toggle featured status (admin only).
   */
  async toggleFeatured(slug) {
    const movie = await Movie.findOne({ slug });
    if (!movie) {
      throw ApiError.notFound(`Movie '${slug}' not found`);
    }

    movie.isFeatured = !movie.isFeatured;
    await movie.save();

    logger.info(`Movie featured toggled: ${movie.title} → ${movie.isFeatured}`);
    return movie;
  }

  /**
   * Search movies (dedicated search endpoint with scoring).
   */
  async searchMovies({ query, genre, filter: accessFilter, page = 1, limit = 20 }) {
    const mongoFilter = {};

    if (query && query.trim()) {
      const searchRegex = new RegExp(query.trim(), 'i');
      mongoFilter.$or = [
        { title: searchRegex },
        { synopsis: searchRegex },
        { director: searchRegex },
        { genre: searchRegex },
        { 'cast.name': searchRegex },
      ];
    }

    if (genre) {
      mongoFilter.genre = { $regex: new RegExp(`^${genre}$`, 'i') };
    }

    if (accessFilter === '4K') {
      mongoFilter.badges = { $regex: /4K/i };
    } else if (accessFilter === 'Free') {
      mongoFilter.accessLevel = 'free';
    } else if (accessFilter === 'Premium') {
      mongoFilter.accessLevel = 'premium';
    }

    const skip = (page - 1) * limit;

    const [movies, total] = await Promise.all([
      Movie.find(mongoFilter).sort({ matchScore: -1, rating: -1 }).skip(skip).limit(limit),
      Movie.countDocuments(mongoFilter),
    ]);

    return {
      movies,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }
}

export default new MovieService();
