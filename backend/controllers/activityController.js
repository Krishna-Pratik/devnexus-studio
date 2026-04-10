// Activity Controller
import Activity from '../models/Activity.js';

const parseLimit = (limitValue, fallback) => {
  const parsed = Number(limitValue);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(Math.trunc(parsed), 1), 100);
};

// @desc    Get user activity feed
// @route   GET /api/activity
// @access  Private
export const getUserActivity = async (req, res, next) => {
  try {
    const limit = parseLimit(req.query.limit, 20);
    const activities = await Activity.find({ userId: req.user._id })
      .populate('projectId', 'title')
      .sort('-createdAt')
      .limit(limit);

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project activity
// @route   GET /api/activity/project/:projectId
// @access  Private
export const getProjectActivity = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const limit = parseLimit(req.query.limit, 10);

    const activities = await Activity.find({
      userId: req.user._id,
      projectId,
    })
      .sort('-createdAt')
      .limit(limit);

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create activity log (internal usage)
// @route   POST /api/activity
// @access  Private
export const createActivity = async (req, res, next) => {
  try {
    const { projectId, type, title, description, data } = req.body;

    const activity = await Activity.create({
      userId: req.user._id,
      projectId,
      type,
      title,
      description,
      data,
    });

    res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to log activity (for internal server use)
export const logActivity = async (userId, projectId, type, title, description, data = {}) => {
  try {
    return await Activity.create({
      userId,
      projectId,
      type,
      title,
      description,
      data,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to log activity:', error);
    }
    // Don't throw - activity logging shouldn't break the main operation
  }
};
