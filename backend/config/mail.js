import { Resend } from 'resend';

const FROM_EMAIL = 'Devnexus <onboarding@resend.dev>';

const getResendApiKey = () => process.env.RESEND_API_KEY?.trim() || '';
export const getContactAdminEmail = () => process.env.CONTACT_ADMIN_EMAIL?.trim() || '';

export const isMailConfigured = () => Boolean(getResendApiKey() && getContactAdminEmail());

let cachedResendClient = null;
let cachedClientKey = '';

const getResendClient = () => {
  const apiKey = getResendApiKey();

  if (cachedResendClient && cachedClientKey === apiKey) {
    return cachedResendClient;
  }

  cachedResendClient = new Resend(apiKey);
  cachedClientKey = apiKey;
  return cachedResendClient;
};

export const sendEmail = async ({ to, subject, html }) => {
  const resend = getResendClient();

  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });

  if (result?.error) {
    throw new Error(result.error.message || 'Resend email send failed.');
  }

  return result?.data;
};
