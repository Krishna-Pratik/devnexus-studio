import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    description: {
      type: String,
      default: 'Project payment',
    },
    invoiceNumber: {
      type: String,
      unique: true,
    },
    dueDate: {
      type: Date,
    },
    paidDate: {
      type: Date,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Generate invoice number before saving
paymentSchema.pre('save', async function (next) {
  if (!this.invoiceNumber) {
    const count = await this.constructor.countDocuments();
    this.invoiceNumber = `INV-${Date.now()}-${count + 1}`;
  }
  next();
});

export default mongoose.model('Payment', paymentSchema);
