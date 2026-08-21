import movieService from '../services/movieService.js';
import ApiResponse from '../utils/ApiResponse.js';

class MovieController {
  async listMovies(req, res, next) {
    try {
      const { page, limit, genre, accessLevel, search, sort, featured } = req.query;
      const result = await movieService.listMovies({
        page: parseInt(page) || 1,
        limit: Math.min(parseInt(limit) || 20, 100),
        genre,
        accessLevel,
        search,
        sort,
        featured,
      });

      ApiResponse.paginated(res, result.movies, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getFeaturedMovies(req, res, next) {
    try {
      const movies = await movieService.getFeaturedMovies();
      ApiResponse.success(res, movies);
    } catch (error) {
      next(error);
    }
  }

  async getMovie(req, res, next) {
    try {
      const movie = await movieService.getMovieBySlug(req.params.id);
      ApiResponse.success(res, movie);
    } catch (error) {
      next(error);
    }
  }

  async createMovie(req, res, next) {
    try {
      const movie = await movieService.createMovie(req.body);
      ApiResponse.created(res, movie, 'Movie created successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateMovie(req, res, next) {
    try {
      const movie = await movieService.updateMovie(req.params.id, req.body);
      ApiResponse.success(res, movie, 'Movie updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteMovie(req, res, next) {
    try {
      await movieService.deleteMovie(req.params.id);
      ApiResponse.success(res, null, 'Movie deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async toggleFeatured(req, res, next) {
    try {
      const movie = await movieService.toggleFeatured(req.params.id);
      ApiResponse.success(res, movie, `Featured status: ${movie.isFeatured}`);
    } catch (error) {
      next(error);
    }
  }

  async searchMovies(req, res, next) {
    try {
      const { q, genre, filter, page, limit } = req.query;
      const result = await movieService.searchMovies({
        query: q,
        genre,
        filter,
        page: parseInt(page) || 1,
        limit: Math.min(parseInt(limit) || 20, 100),
      });

      ApiResponse.paginated(res, result.movies, result.pagination);
    } catch (error) {
      next(error);
    }
  }
}

export default new MovieController();
