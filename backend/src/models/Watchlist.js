import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    movieSlug: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound unique index: one user can add a movie only once
watchlistSchema.index({ userId: 1, movieSlug: 1 }, { unique: true });
// Index for listing a user's watchlist
watchlistSchema.index({ userId: 1, createdAt: -1 });

const Watchlist = mongoose.model('Watchlist', watchlistSchema);
export default Watchlist;
