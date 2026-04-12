import nodemailer from 'nodemailer';
import dns from 'dns';

const getEmailUser = () => process.env.EMAIL_USER?.trim() || '';
const getEmailPass = () => process.env.EMAIL_PASS?.replace(/\s+/g, '') || '';
const SMTP_SERVERNAME = 'smtp.gmail.com';
const TRANSPORTER_CACHE_TTL_MS = 5 * 60 * 1000;

export const isMailConfigured = () => Boolean(getEmailUser() && getEmailPass());

export const getMailUser = () => getEmailUser();

let cachedTransporter = null;
let cachedTransporterKey = '';
let cachedTransporterHost = '';
let cachedTransporterExpiresAt = 0;

const resolveSmtpIpv4Host = async () => {
  return new Promise((resolve) => {
    dns.resolve4(SMTP_SERVERNAME, (err, addresses) => {
      if (err || !Array.isArray(addresses) || addresses.length === 0) {
        resolve(SMTP_SERVERNAME);
        return;
      }
      resolve(addresses[0]);
    });
  });
};

export const getTransporter = async () => {
  const user = getEmailUser();
  const pass = getEmailPass();
  const nextKey = `${user}:${pass}`;
  const now = Date.now();

  if (cachedTransporter && cachedTransporterKey === nextKey && cachedTransporterExpiresAt > now) {
    return cachedTransporter;
  }

  const smtpHost = await resolveSmtpIpv4Host();

  cachedTransporter = nodemailer.createTransport({
    host: smtpHost,
    port: 587,
    secure: false,
    requireTLS: true,
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
    family: 4,
    tls: {
      servername: SMTP_SERVERNAME,
    },
    auth: {
      user,
      pass,
    },
  });
  cachedTransporterKey = nextKey;
  cachedTransporterHost = smtpHost;
  cachedTransporterExpiresAt = now + TRANSPORTER_CACHE_TTL_MS;

  console.info(`EMAIL INFO: SMTP transporter initialized with host ${cachedTransporterHost} (servername ${SMTP_SERVERNAME}).`);

  return cachedTransporter;
};
