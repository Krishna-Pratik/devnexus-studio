// Authentication Controller Logic
import User from '../models/User.js';
import validator from 'validator';
import { OAuth2Client } from 'google-auth-library';
import { generateToken } from '../utils/generateToken.js';

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI?.trim();
const frontendBaseUrl = process.env.CLIENT_URL?.trim();

const googleClient = new OAuth2Client({
  clientId: googleClientId,
  clientSecret: googleClientSecret,
  redirectUri: googleRedirectUri,
});

const buildFrontendUrl = (pathname) => {
  if (!frontendBaseUrl) {
    return pathname;
  }

  return new URL(pathname, frontendBaseUrl.endsWith('/') ? frontendBaseUrl : `${frontendBaseUrl}/`).toString();
};

const setAuthCookie = (res, token) => {
  res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000,
  });
};

const buildAuthUserResponse = (user, token) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  token,
});

const completeGoogleAuth = async ({ name, email }) => {
  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedName || !normalizedEmail) {
    throw new Error('Invalid Google identity');
  }

  if (!validator.isEmail(normalizedEmail)) {
    throw new Error('Invalid email format');
  }

  let user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      authProvider: 'google',
    });
  } else if (!user.name && normalizedName) {
    user.name = normalizedName;
    await user.save();
  }

  const token = generateToken(user._id);
  return { user, token };
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res, next) => {
  try {
    const {
      name = '',
      email = '',
      password = '',
      confirmPassword = '',
    } = req.body;

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password,
      authProvider: 'local',
    });

    if (user) {
      const token = generateToken(user._id);
      setAuthCookie(res, token);
      return res.status(201).json(buildAuthUserResponse(user, token));
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const {
      email = '',
      password = '',
    } = req.body;

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      res.status(400);
      throw new Error('Please provide an email and password');
    }

    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (user && !user.password) {
      return res.status(400).json({ message: 'This account uses Google sign-in. Please continue with Google.' });
    }

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      setAuthCookie(res, token);
      return res.json(buildAuthUserResponse(user, token));
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  return res.status(200).json(req.user);
};

// @desc    Logout user and clear auth cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (_req, res) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Google auth (login/signup)
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res, next) => {
  try {
    const { credential = '' } = req.body;

    if (!googleClientId) {
      return res.status(503).json({ message: 'Google auth is not configured' });
    }

    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (_verifyError) {
      return res.status(401).json({ message: 'Invalid Google identity' });
    }

    const payload = ticket.getPayload();
    const isVerified = payload?.email_verified === true;

    if (!isVerified) {
      return res.status(401).json({ message: 'Invalid Google identity' });
    }

    const { user, token } = await completeGoogleAuth({
      name: payload?.name || '',
      email: payload?.email || '',
    });

    setAuthCookie(res, token);
    return res.status(200).json(buildAuthUserResponse(user, token));
  } catch (error) {
    next(error);
  }
};

// @desc    Google auth callback (redirect flow)
// @route   GET /api/auth/google/callback
// @access  Public
export const googleAuthCallback = async (req, res) => {
  const code = typeof req.query.code === 'string' ? req.query.code : '';

  if (!googleClientId || !googleClientSecret || !googleRedirectUri) {
    return res.status(503).send('Google auth is not configured.');
  }

  if (!code) {
    return res.redirect(buildFrontendUrl('/login?google=failed'));
  }

  try {
    const tokenResponse = await googleClient.getToken({
      code,
      redirect_uri: googleRedirectUri,
    });
    const idToken = tokenResponse.tokens.id_token || '';

    if (!idToken) {
      return res.redirect(buildFrontendUrl('/login?google=failed'));
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();
    const isVerified = payload?.email_verified === true;

    if (!payload || !isVerified) {
      return res.redirect(buildFrontendUrl('/login?google=failed'));
    }

    const { token } = await completeGoogleAuth({
      name: payload.name || '',
      email: payload.email || '',
    });

    setAuthCookie(res, token);
    return res.redirect(buildFrontendUrl('/dashboard'));
  } catch (_error) {
    return res.redirect(buildFrontendUrl('/login?google=failed'));
  }
};