// Message Controller
import Message from '../models/Message.js';
import Project from '../models/Project.js';

// @desc    Get messages for a project
// @route   GET /api/messages/:projectId
// @access  Private
export const getMessages = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    // Verify project ownership
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (project.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access these messages');
    }

    const messages = await Message.find({ projectId }).sort('createdAt');

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { projectId, text } = req.body;

    if (!projectId || !text) {
      res.status(400);
      throw new Error('Please provide projectId and message text');
    }

    // Verify project ownership
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (project.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to send messages for this project');
    }

    const message = await Message.create({
      projectId,
      senderId: req.user._id,
      senderName: req.user.name,
      text,
    });

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }

    // Verify sender
    if (message.senderId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this message');
    }

    await Message.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
