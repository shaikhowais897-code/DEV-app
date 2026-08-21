import ApiResponse from '../utils/ApiResponse.js';

/**
 * Static categories matching the frontend CATEGORIES_DATABASE.
 * These are read-only and don't require database storage.
 */
const CATEGORIES = [
  { id: 'action', name: 'Action', slug: 'action', subtitle: 'Adrenaline Rush' },
  { id: 'sci-fi', name: 'Sci-Fi', slug: 'sci-fi', subtitle: 'Futuristic Odyssey' },
  { id: 'drama', name: 'Drama', slug: 'drama', subtitle: 'Deep Cuts & Emotion' },
  { id: 'comedy', name: 'Comedy', slug: 'comedy', subtitle: 'Laughter & Wit' },
  { id: 'horror', name: 'Horror', slug: 'horror', subtitle: "Don't look behind you." },
  { id: 'animation', name: 'Animation', slug: 'animation', subtitle: 'Magical Worlds' },
  { id: 'documentary', name: 'Documentary', slug: 'documentary', subtitle: 'Real Stories & Exploration' },
  { id: 'thriller', name: 'Thriller', slug: 'thriller', subtitle: 'Edge of Your Seat' },
  { id: 'mystery', name: 'Mystery', slug: 'mystery', subtitle: 'Unravel the Truth' },
  { id: 'cyberpunk', name: 'Cyberpunk', slug: 'cyberpunk', subtitle: 'Neon Futures' },
  { id: 'fantasy', name: 'Fantasy', slug: 'fantasy', subtitle: 'Mythical Realms' },
  { id: 'adventure', name: 'Adventure', slug: 'adventure', subtitle: 'Beyond the Horizon' },
];

class CategoryController {
  async listCategories(req, res, next) {
    try {
      ApiResponse.success(res, CATEGORIES);
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
