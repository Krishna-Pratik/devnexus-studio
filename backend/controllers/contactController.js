import fs from 'fs';
import ContactSubmission from '../models/ContactSubmission.js';
import { getMailUser, getTransporter, isMailConfigured } from '../config/mail.js';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const EMAIL_MAX_ATTEMPTS = 3;
const EMAIL_RETRY_BASE_DELAY_MS = 3000;

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const buildMailHtml = (submission, submittedAtISO) => {
  const {
    name,
    email,
    company,
    phone,
    budget,
    projectType,
    timeline,
    description,
  } = submission;

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;max-width:680px;">
      <h2 style="margin-bottom:12px;">New Contact Submission</h2>
      <p style="margin:0 0 16px 0;color:#666;">Submitted at: <strong>${escapeHtml(submittedAtISO)}</strong></p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px;border:1px solid #e5e7eb;"><strong>Name</strong></td><td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #e5e7eb;"><strong>Email</strong></td><td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(email)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #e5e7eb;"><strong>Company</strong></td><td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(company || 'N/A')}</td></tr>
        <tr><td style="padding:8px;border:1px solid #e5e7eb;"><strong>Phone</strong></td><td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(phone || 'N/A')}</td></tr>
        <tr><td style="padding:8px;border:1px solid #e5e7eb;"><strong>Budget</strong></td><td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(budget || 'N/A')}</td></tr>
        <tr><td style="padding:8px;border:1px solid #e5e7eb;"><strong>Project Type</strong></td><td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(projectType || 'N/A')}</td></tr>
        <tr><td style="padding:8px;border:1px solid #e5e7eb;"><strong>Timeline</strong></td><td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(timeline || 'N/A')}</td></tr>
      </table>
      <h3 style="margin:20px 0 8px 0;">Project Description</h3>
      <p style="padding:12px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;white-space:pre-wrap;">${escapeHtml(description)}</p>
    </div>
  `;
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sendNotificationEmailInBackground = async (submission, submittedAtISO, file) => {
  const mailUser = getMailUser();
  const adminEmail = process.env.CONTACT_ADMIN_EMAIL || mailUser;
  if (!adminEmail) {
    console.error('EMAIL WARNING: CONTACT_ADMIN_EMAIL and EMAIL_USER are both empty. Skipping email notification.');
    return;
  }

  if (!isMailConfigured()) {
    console.error('EMAIL WARNING: Missing EMAIL_USER or EMAIL_PASS. Contact submission saved without email notification.');
    return;
  }

  try {
    const transporter = await getTransporter();
    const mailOptions = {
      from: `"Devnexus Studio" <${mailUser}>`,
      to: adminEmail,
      subject: `New Contact Request from ${submission.name}`,
      replyTo: submission.email,
      text: [
        `Submitted at: ${submittedAtISO}`,
        `Name: ${submission.name}`,
        `Email: ${submission.email}`,
        `Company: ${submission.company || 'N/A'}`,
        `Phone: ${submission.phone || 'N/A'}`,
        `Budget: ${submission.budget || 'N/A'}`,
        `Project Type: ${submission.projectType || 'N/A'}`,
        `Timeline: ${submission.timeline || 'N/A'}`,
        '',
        'Project Description:',
        submission.description,
      ].join('\n'),
      html: buildMailHtml(submission, submittedAtISO),
      attachments: file
        ? [
            {
              filename: file.originalname,
              path: file.path,
              contentType: file.mimetype,
            },
          ]
        : [],
    };

    let lastError;
    for (let attempt = 1; attempt <= EMAIL_MAX_ATTEMPTS; attempt += 1) {
      try {
        console.info(`EMAIL INFO: Attempt ${attempt}/${EMAIL_MAX_ATTEMPTS} for submission ${submission._id} to ${adminEmail}.`);
        const info = await transporter.sendMail(mailOptions);
        console.info(`EMAIL INFO: Contact notification sent successfully for submission ${submission._id}.`, {
          messageId: info?.messageId,
          response: info?.response,
          accepted: info?.accepted,
          rejected: info?.rejected,
        });
        return;
      } catch (emailError) {
        lastError = emailError;
        console.error('EMAIL WARNING: Contact notification attempt failed.', {
          attempt,
          totalAttempts: EMAIL_MAX_ATTEMPTS,
          submissionId: submission?._id,
          message: emailError?.message,
          code: emailError?.code,
          errno: emailError?.errno,
          syscall: emailError?.syscall,
          address: emailError?.address,
          port: emailError?.port,
        });

        if (attempt < EMAIL_MAX_ATTEMPTS) {
          await wait(EMAIL_RETRY_BASE_DELAY_MS * attempt);
        }
      }
    }

    throw lastError;
  } catch (emailError) {
    console.error('EMAIL WARNING: Contact submission saved but email notification failed.', {
      message: emailError?.message,
      code: emailError?.code,
      errno: emailError?.errno,
      syscall: emailError?.syscall,
      address: emailError?.address,
      port: emailError?.port,
      stack: emailError?.stack,
    });
  }
};

const removeUploadedFileIfAny = (file) => {
  if (!file?.path) {
    return;
  }
  fs.unlink(file.path, () => {});
};

export const createContactSubmission = async (req, res, next) => {
  try {
    const {
      name = '',
      email = '',
      company = '',
      phone = '',
      budget = '',
      projectType = '',
      timeline = '',
      description = '',
      website = '', // honeypot field
    } = req.body;
    const idempotencyKeyHeader = req.get('Idempotency-Key') || '';
    const idempotencyKey = idempotencyKeyHeader.trim().slice(0, 200);

    // Honeypot quietly absorbs bot traffic.
    if (website && website.trim()) {
      return res.status(200).json({
        success: true,
        message: 'Thanks! We will get back to you within 24 hours.',
      });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedDescription = description.trim();

    if (!normalizedName || !normalizedEmail || !normalizedDescription) {
      res.status(400);
      throw new Error('Name, email, and project description are required.');
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      res.status(400);
      throw new Error('Please provide a valid email address.');
    }

    if (normalizedDescription.length < 30) {
      res.status(400);
      throw new Error('Project description should be at least 30 characters.');
    }

    if (idempotencyKey) {
      const existingSubmission = await ContactSubmission.findOne({ idempotencyKey })
        .select('_id meta.submittedAt')
        .lean();

      if (existingSubmission) {
        removeUploadedFileIfAny(req.file);
        return res.status(200).json({
          success: true,
          message: 'Thanks! We will get back to you within 24 hours.',
          data: {
            id: existingSubmission._id,
            submittedAt: existingSubmission.meta?.submittedAt
              ? new Date(existingSubmission.meta.submittedAt).toISOString()
              : new Date().toISOString(),
            deduped: true,
          },
        });
      }
    }

    let submission;
    try {
      submission = await ContactSubmission.create({
        name: normalizedName,
        email: normalizedEmail,
        company: company.trim(),
        phone: phone.trim(),
        budget: budget.trim(),
        projectType: projectType.trim(),
        timeline: timeline.trim(),
        description: normalizedDescription,
        idempotencyKey: idempotencyKey || undefined,
        file: req.file
          ? {
              originalName: req.file.originalname,
              storedName: req.file.filename,
              mimeType: req.file.mimetype,
              size: req.file.size,
              path: req.file.path,
            }
          : undefined,
        meta: {
          ip: req.ip || req.headers['x-forwarded-for'] || '',
          userAgent: req.get('user-agent') || '',
          submittedAt: new Date(),
        },
      });
    } catch (dbError) {
      if (dbError?.code === 11000 && idempotencyKey) {
        const existingSubmission = await ContactSubmission.findOne({ idempotencyKey })
          .select('_id meta.submittedAt')
          .lean();
        if (existingSubmission) {
          removeUploadedFileIfAny(req.file);
          return res.status(200).json({
            success: true,
            message: 'Thanks! We will get back to you within 24 hours.',
            data: {
              id: existingSubmission._id,
              submittedAt: existingSubmission.meta?.submittedAt
                ? new Date(existingSubmission.meta.submittedAt).toISOString()
                : new Date().toISOString(),
              deduped: true,
            },
          });
        }
      }
      throw dbError;
    }

    const submittedAtISO = submission.meta?.submittedAt
      ? new Date(submission.meta.submittedAt).toISOString()
      : new Date().toISOString();

    res.status(201).json({
      success: true,
      message: 'Thanks! We will get back to you within 24 hours.',
      data: {
        id: submission._id,
        submittedAt: submittedAtISO,
      },
    });

    // Keep API response fast; email delivery is best-effort and should not block client UX.
    void sendNotificationEmailInBackground(submission, submittedAtISO, req.file);
    return;
  } catch (error) {
    next(error);
  }
};

export const cleanupFailedUpload = (err, req, res, next) => {
  if (req.file?.path) {
    fs.unlink(req.file.path, () => next(err));
    return;
  }
  next(err);
};
