import mongoose from 'mongoose';

const contactSubmissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    company: {
      type: String,
      trim: true,
      maxlength: [150, 'Company cannot exceed 150 characters'],
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [40, 'Phone cannot exceed 40 characters'],
      default: '',
    },
    budget: {
      type: String,
      trim: true,
      enum: [
        '',
        'Up to ₹15,000',
        '₹15,000 – ₹30,000',
        '₹30,000 – ₹60,000',
        '₹60,000 – ₹1 Lakh',
      ],
      default: '',
    },
    projectType: {
      type: String,
      trim: true,
      default: '',
    },
    timeline: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      minlength: [30, 'Project description should be at least 30 characters'],
      maxlength: [5000, 'Project description cannot exceed 5000 characters'],
    },
    file: {
      originalName: { type: String, default: '' },
      storedName: { type: String, default: '' },
      mimeType: { type: String, default: '' },
      size: { type: Number, default: 0 },
      path: { type: String, default: '' },
    },
    source: {
      type: String,
      default: 'website-contact-page',
    },
    status: {
      type: String,
      enum: ['new', 'in-review', 'responded', 'archived'],
      default: 'new',
    },
    meta: {
      ip: { type: String, default: '' },
      userAgent: { type: String, default: '' },
      submittedAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

contactSubmissionSchema.index({ email: 1, createdAt: -1 });
contactSubmissionSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('ContactSubmission', contactSubmissionSchema);
