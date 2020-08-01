const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const EmailUtils = require('../utils/EmailUtils');
const Generators = require('../utils/Generators');
const PasswordUtils = require('../utils/PasswordUtils');

const router = express.Router();

const User = require('../models/User');
const EmailVerificationToken = require('../models/EmailVerificationToken');
const PasswordResetToken = require('../models/PasswordResetToken');

router.get('/verify', async (request, response, next) => {
  const authHeader = request.get('authorization');
  if (!request.user || !authHeader) return next(new Error('No user details provided'));

  const token = authHeader.split(' ')[1];
  if (!token) return next(new Error('No user details provided'));

  const verified = jwt.verify(token, process.env.TOKEN_SECRET);
  return response.status(200).json({ jwt: verified, loggedIn: true });
});

router.post('/signup', async (request, response, next) => {
  const {
    username, email, password, passwordConfirm,
  } = request.body;

  if (!username) return next(new Error('Username is required'));
  if (!email) return next(new Error('Email is required'));
  if (!password) return next(new Error('Password is required'));
  if (!passwordConfirm) return next(new Error('Password Confirmation is required'));
  if (password !== passwordConfirm) return next(new Error('Password and password confirmation are not the same'));
  if (await User.exists({ email })) return next(new Error('Email is not unique'));

  const encryptedPassword = await PasswordUtils.encrypt(password);

  const newUser = await User.create({
    id: Generators.generateId(),
    username,
    email,
    password: encryptedPassword,
  });

  return response.status(200).json({
    message: 'You have been signed up to Chator',
    id: newUser.id,
  });
});

router.post('/login', async (request, response, next) => {
  const { email, password } = request.body;

  if (!email || !password) return next(new Error('You must provide an email and password'));

  const user = await User.findOne({ email });

  if (!user || !(await PasswordUtils.compare(password, user.password))) return next(new Error('Invalid username or password'));

  if (!user.emailConfirmed) return next(new Error('Email is not verified, please check your emails'));

  const payload = {
    id: user.id,
    username: user.username,
  };
  try {
    const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1d' });
    return response.status(200).json({ message: 'You have been logged in', token });
  } catch (e) {
    return next(e);
  }
});

router.post('/email/verify', async (request, response, next) => {
  const { token } = request.body;

  if (!token) return next(new Error('You must provide an email verification token'));

  const dbToken = await EmailVerificationToken.findOne({ token });

  if (!dbToken) return next(new Error('Invalid email verification token'));

  const user = await User.findOne({ id: dbToken.id });

  user.emailConfirmed = true;
  user.save();

  await EmailVerificationToken.deleteOne({ id: user.id, token });

  return response.status(200).json({ message: 'Your email has been verified. You can now login.' });
});

router.post('/email/verify/request', async (request, response, next) => {
  const { email } = request.body;
  if (!email) return next(new Error('You must provide an email to verify'));

  const user = await User.findOne({ email });

  if (user) {
    const currentVerificationToken = await EmailVerificationToken.findOne({ id: user.id });
    const emailVerificationToken = !currentVerificationToken
      ? uuidv4()
      : currentVerificationToken.token;

    if (!currentVerificationToken) {
      EmailVerificationToken.create({
        id: user.id,
        token: emailVerificationToken,
      });
    }

    EmailUtils.sendSimpleMessage(
      user.email,
      'Chator Email Verification',
      `Please use the email verification token '${emailVerificationToken}'`,
    );
  }

  return response
    .status(200)
    .json({ message: 'If that email exists, you have been sent a verification link' });
});

router.post('/password/reset', async (request, response, next) => {
  const { token, newPassword, newPasswordConfirm } = request.body;

  if (!token || !newPassword || !newPasswordConfirm) {
    return next(new Error('You must provide a password reset token and a password'));
  }

  if (newPassword !== newPasswordConfirm) return next(new Error('Passwords are not the same'));

  const dbToken = await PasswordResetToken.findOne({ token });

  if (!dbToken) return next(new Error('Invalid password reset token'));

  const user = await User.findOne({ id: dbToken.id });

  if (await PasswordUtils.compare(newPassword, user.password)) {
    return next(new Error('You cannot use the same password as your previous password'));
  }

  user.password = await PasswordUtils.encrypt(newPassword);
  user.save();

  await PasswordResetToken.deleteOne({ id: user.id, token });

  return response.status(200).json({ message: 'Your password has been reset. You can now login.' });
});

router.post('/password/reset/request', async (request, response) => {
  const { email } = request.body;

  const user = await User.findOne({ email });

  if (!user) {
    console.error(
      `Someone tried to reset a password for the email '${email}' but it does not exist in the system`,
    );
  } else {
    const currentResetToken = await PasswordResetToken.findOne({ id: user.id });
    const passwordResetToken = !currentResetToken ? uuidv4() : currentResetToken.token;

    if (!currentResetToken) {
      PasswordResetToken.create({
        id: user.id,
        token: passwordResetToken,
      });
    }

    EmailUtils.sendSimpleMessage(
      user.email,
      'Chator Password Reset',
      `Please use the password reset code '${passwordResetToken}'`,
    );
  }
  return response
    .status(200)
    .json({ message: 'If that email exists, you have been sent a password reset link' });
});

module.exports = router;
