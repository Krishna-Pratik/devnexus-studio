import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a project title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    deadline: {
      type: Date,
    },
    budget: {
      type: Number,
    },
    milestones: [
      {
        title: String,
        description: String,
        dueDate: Date,
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    files: [
      {
        name: String,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    links: {
      livePreview: String,
      repository: String,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Project', projectSchema);
