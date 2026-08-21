import watchlistService from '../services/watchlistService.js';
import ApiResponse from '../utils/ApiResponse.js';

class WatchlistController {
  async getWatchlist(req, res, next) {
    try {
      const movies = await watchlistService.getWatchlist(req.user._id);
      ApiResponse.success(res, movies);
    } catch (error) {
      next(error);
    }
  }

  async addToWatchlist(req, res, next) {
    try {
      const movie = await watchlistService.addToWatchlist(req.user._id, req.params.movieId);
      ApiResponse.created(res, movie, `Added "${movie.title}" to watchlist`);
    } catch (error) {
      next(error);
    }
  }

  async removeFromWatchlist(req, res, next) {
    try {
      await watchlistService.removeFromWatchlist(req.user._id, req.params.movieId);
      ApiResponse.success(res, null, 'Removed from watchlist');
    } catch (error) {
      next(error);
    }
  }
}

export default new WatchlistController();
