import ratingService from '../services/ratingService.js';
import ApiResponse from '../utils/ApiResponse.js';

class RatingController {
  async rateMovie(req, res, next) {
    try {
      const { rating } = req.body;
      const movie = await ratingService.rateMovie(req.user._id, req.params.id, rating);
      ApiResponse.success(res, movie, 'Rating submitted');
    } catch (error) {
      next(error);
    }
  }

  async removeRating(req, res, next) {
    try {
      const movie = await ratingService.removeRating(req.user._id, req.params.id);
      ApiResponse.success(res, movie, 'Rating removed');
    } catch (error) {
      next(error);
    }
  }

  async getRatingBreakdown(req, res, next) {
    try {
      const data = await ratingService.getRatingBreakdown(req.params.id);
      ApiResponse.success(res, data);
    } catch (error) {
      next(error);
    }
  }
}

export default new RatingController();
