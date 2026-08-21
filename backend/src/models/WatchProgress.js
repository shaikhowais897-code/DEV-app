import mongoose from 'mongoose';

const watchProgressSchema = new mongoose.Schema(
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
    progressPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    lastPositionSeconds: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
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

// One progress record per user per movie
watchProgressSchema.index({ userId: 1, movieSlug: 1 }, { unique: true });
// For fetching a user's continue-watching list
watchProgressSchema.index({ userId: 1, updatedAt: -1 });

const WatchProgress = mongoose.model('WatchProgress', watchProgressSchema);
export default WatchProgress;
