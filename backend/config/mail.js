import nodemailer from 'nodemailer';

const getEmailUser = () => process.env.EMAIL_USER?.trim() || '';
const getEmailPass = () => process.env.EMAIL_PASS?.replace(/\s+/g, '') || '';

export const isMailConfigured = () => Boolean(getEmailUser() && getEmailPass());

export const getMailUser = () => getEmailUser();

let cachedTransporter = null;
let cachedTransporterKey = '';

export const getTransporter = () => {
  const user = getEmailUser();
  const pass = getEmailPass();
  const nextKey = `${user}:${pass}`;

  if (cachedTransporter && cachedTransporterKey === nextKey) {
    return cachedTransporter;
  }

  cachedTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });
  cachedTransporterKey = nextKey;

  return cachedTransporter;
};
