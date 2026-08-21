import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Never returned in queries by default
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: '',
    },
    plan: {
      type: String,
      enum: ['Free', 'Premium 4K HDR', 'Family VIP'],
      default: 'Free',
    },
    billingStatus: {
      type: String,
      enum: ['Active', 'Trial', 'Expired', 'Suspended'],
      default: 'Trial',
    },
    nextBillingDate: {
      type: String,
      default: '',
    },
    monthlyFee: {
      type: String,
      default: '$0.00',
    },
    joinedDate: {
      type: String,
      default: '',
    },
    watchHours: {
      type: Number,
      default: 0,
    },
    activeDevices: {
      type: Number,
      default: 1,
    },
    ipRegion: {
      type: String,
      default: '',
    },
    preferredQuality: {
      type: String,
      enum: ['Auto', '4K', '1080p', '720p'],
      default: 'Auto',
    },
    preferredAudio: {
      type: String,
      default: 'English (Dolby Atmos 5.1)',
    },
    preferredSubtitle: {
      type: String,
      default: 'English',
    },
    autoplayNext: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        delete ret.refreshToken;
        return ret;
      },
    },
  }
);

// Index for email lookups (unique already creates an index)
// Index for role-based queries
userSchema.index({ role: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);
export default User;
