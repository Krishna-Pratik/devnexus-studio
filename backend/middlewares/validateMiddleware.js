import { ZodError } from 'zod';

export const validateBody = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed;
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Invalid request body',
        issues: error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    return next(error);
  }
};

export const validateParams = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.params);
    req.params = parsed;
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Invalid route parameters',
        issues: error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    return next(error);
  }
};
