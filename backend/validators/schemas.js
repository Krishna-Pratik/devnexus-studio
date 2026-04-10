import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const signupSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  password: z.string().min(6).max(128),
  confirmPassword: z.string().min(6).max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(128),
});

export const googleAuthSchema = z.object({
  credential: z.string().min(1),
});

export const createProjectSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  deadline: z.string().trim().min(1).optional().nullable(),
  budget: z.coerce.number().nonnegative().optional().nullable(),
  status: z.enum(['Pending', 'In Progress', 'Completed']).optional(),
  notes: z.string().max(5000).optional(),
});

export const updateProjectSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().min(1).max(5000).optional(),
  status: z.enum(['Pending', 'In Progress', 'Completed']).optional(),
  progress: z.coerce.number().min(0).max(100).optional(),
  deadline: z.string().trim().min(1).optional().nullable(),
  budget: z.coerce.number().nonnegative().optional().nullable(),
  milestones: z.array(z.any()).optional(),
  files: z.array(z.any()).optional(),
  links: z.object({ livePreview: z.string().max(500).optional(), repository: z.string().max(500).optional() }).partial().optional(),
  notes: z.string().max(5000).optional(),
});

export const createPaymentSchema = z.object({
  projectId: z.string().regex(objectIdRegex, 'Invalid projectId'),
  amount: z.coerce.number().positive(),
  dueDate: z.string().trim().min(1).optional().nullable(),
  description: z.string().max(500).optional(),
});

export const updatePaymentSchema = z.object({
  amount: z.coerce.number().positive().optional(),
  status: z.enum(['Pending', 'Paid', 'Failed', 'Refunded']).optional(),
  description: z.string().max(500).optional(),
  dueDate: z.string().trim().min(1).optional().nullable(),
  paidDate: z.string().trim().min(1).optional().nullable(),
  notes: z.string().max(5000).optional(),
});

export const sendMessageSchema = z.object({
  projectId: z.string().regex(objectIdRegex, 'Invalid projectId'),
  text: z.string().trim().min(1).max(5000),
});

export const createActivitySchema = z.object({
  projectId: z.string().regex(objectIdRegex, 'Invalid projectId').optional(),
  type: z.enum([
    'project_created',
    'project_updated',
    'milestone_completed',
    'message_sent',
    'payment_received',
    'payment_pending',
  ]),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(1000).optional(),
  data: z.record(z.any()).optional(),
});

export const idParamSchema = z.object({
  id: z.string().regex(objectIdRegex, 'Invalid id'),
});

export const projectIdParamSchema = z.object({
  projectId: z.string().regex(objectIdRegex, 'Invalid projectId'),
});
