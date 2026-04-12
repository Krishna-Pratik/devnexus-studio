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
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
    family: 4,
    auth: {
      user,
      pass,
    },
  });
  cachedTransporterKey = nextKey;

  return cachedTransporter;
};
