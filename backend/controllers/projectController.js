// Project Controller
import Project from '../models/Project.js';

// @desc    Get all user projects
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Verify ownership
    if (project.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this project');
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res, next) => {
  try {
    const { title, description, deadline, budget, status } = req.body;

    if (!title || !description) {
      res.status(400);
      throw new Error('Please provide title and description');
    }

    const project = await Project.create({
      userId: req.user._id,
      title,
      description,
      deadline,
      budget,
      status: status || 'Pending',
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Verify ownership
    if (project.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this project');
    }

    const allowedFields = [
      'title',
      'description',
      'status',
      'progress',
      'deadline',
      'budget',
      'milestones',
      'files',
      'links',
      'notes',
    ];

    const updateData = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    );

    project = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Verify ownership
    if (project.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this project');
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/projects/stats/overview
// @access  Private
export const getProjectStats = async (req, res, next) => {
  try {
    const total = await Project.countDocuments({ userId: req.user._id });
    const inProgress = await Project.countDocuments({
      userId: req.user._id,
      status: 'In Progress',
    });
    const completed = await Project.countDocuments({
      userId: req.user._id,
      status: 'Completed',
    });

    res.status(200).json({
      success: true,
      stats: {
        total,
        inProgress,
        completed,
        pending: total - inProgress - completed,
      },
    });
  } catch (error) {
    next(error);
  }
};
