// Payment Controller
import Payment from '../models/Payment.js';
import Project from '../models/Project.js';

// @desc    Get all user payments
// @route   GET /api/payments
// @access  Private
export const getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate('projectId', 'title')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
export const getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('projectId');

    if (!payment) {
      res.status(404);
      throw new Error('Payment not found');
    }

    // Verify ownership
    if (payment.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this payment');
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create payment
// @route   POST /api/payments
// @access  Private (Admin only in production)
export const createPayment = async (req, res, next) => {
  try {
    const { projectId, amount, dueDate, description } = req.body;
    const normalizedAmount = Number(amount);

    if (!projectId || !Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      res.status(400);
      throw new Error('Please provide projectId and a valid amount');
    }

    // Verify project ownership
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (project.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to create payment for this project');
    }

    const payment = await Payment.create({
      userId: req.user._id,
      projectId,
      amount: normalizedAmount,
      dueDate,
      description: description || 'Project payment',
    });

    res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update payment
// @route   PUT /api/payments/:id
// @access  Private
export const updatePayment = async (req, res, next) => {
  try {
    let payment = await Payment.findById(req.params.id);

    if (!payment) {
      res.status(404);
      throw new Error('Payment not found');
    }

    // Verify ownership
    if (payment.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this payment');
    }

    // If marking as paid, set paidDate
    if (req.body.status === 'Paid' && payment.status !== 'Paid') {
      req.body.paidDate = new Date();
    }

    const allowedFields = ['amount', 'status', 'description', 'dueDate', 'paidDate', 'notes'];
    const updateData = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    );

    if (Object.prototype.hasOwnProperty.call(updateData, 'amount')) {
      const normalizedAmount = Number(updateData.amount);
      if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
        res.status(400);
        throw new Error('Amount must be a positive number');
      }
      updateData.amount = normalizedAmount;
    }

    payment = await Payment.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment stats
// @route   GET /api/payments/stats/overview
// @access  Private
export const getPaymentStats = async (req, res, next) => {
  try {
    const paid = await Payment.aggregate([
      { $match: { userId: req.user._id, status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const pending = await Payment.aggregate([
      { $match: { userId: req.user._id, status: 'Pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const total = await Payment.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalPaid: paid[0]?.total || 0,
        totalPending: pending[0]?.total || 0,
        totalAmount: total[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
