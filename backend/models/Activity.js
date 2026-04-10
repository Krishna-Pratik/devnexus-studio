import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    type: {
      type: String,
      enum: ['project_created', 'project_updated', 'milestone_completed', 'message_sent', 'payment_received', 'payment_pending'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    data: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
activitySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Activity', activitySchema);
