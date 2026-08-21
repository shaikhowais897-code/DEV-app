import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      default: '',
    },
    details: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Success', 'Warn', 'Error'],
      default: 'Success',
    },
    ip: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        ret.timestamp = ret.createdAt;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index for listing recent audit events
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ actor: 1 });
auditLogSchema.index({ action: 1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
