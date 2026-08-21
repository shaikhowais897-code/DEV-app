import progressService from '../services/progressService.js';
import ApiResponse from '../utils/ApiResponse.js';

class ProgressController {
  async getContinueWatching(req, res, next) {
    try {
      const movies = await progressService.getContinueWatching(req.user._id);
      ApiResponse.success(res, movies);
    } catch (error) {
      next(error);
    }
  }

  async updateProgress(req, res, next) {
    try {
      const { progressPercent, lastPositionSeconds } = req.body;
      const progress = await progressService.updateProgress(
        req.user._id,
        req.params.movieId,
        progressPercent,
        lastPositionSeconds
      );
      ApiResponse.success(res, progress, 'Progress updated');
    } catch (error) {
      next(error);
    }
  }
}

export default new ProgressController();
