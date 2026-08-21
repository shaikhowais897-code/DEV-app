import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
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

// One rating per user per movie
ratingSchema.index({ userId: 1, movieSlug: 1 }, { unique: true });
// For aggregating movie ratings
ratingSchema.index({ movieSlug: 1 });

const Rating = mongoose.model('Rating', ratingSchema);
export default Rating;
