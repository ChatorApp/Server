'use strict';

const EmailUtils = require('../utils/EmailUtils');
const Generators = require('../utils/Generators');
const PasswordUtils = require('../utils/PasswordUtils');

const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const express = require('express');
const router = express.Router();

const User = require('../models/User');
const EmailVerificationToken = require('../models/EmailVerificationToken');
const PasswordResetToken = require('../models/PasswordResetToken');

router.get('/verify', async (request, response) => {
    const authHeader = request.get('authorization');
    if (!request.user || !authHeader)
        return response.status(400).json({ error: 'No user details provided', loggedIn: false });
    
        const token = authHeader.split(' ')[1];
    if(!token)
        return response.status(400).json({ error: 'No user details provided', loggedIn: false });
    
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    return response.status(200).json({ jwt: verified, loggedIn: true });
});

router.post('/signup', async (request, response) => {
    const { username, email, password, passwordConfirm } = request.body;
    const errors = [];
    if (!username)
        errors.push('Username is required');
    if (!email)
        errors.push('Email is required');
    if (!password)
        errors.push('Password is required');
    if (!passwordConfirm)
        errors.push('Password Confirmation is required');
    if (password !== passwordConfirm)
        errors.push('Password and password confirmation are not the same');
    if (await User.exists({ email: email }))
        errors.push('Email is not unique');

    if (errors.length === 0) {
        const encryptedPassword = await PasswordUtils.encrypt(password);

        const newUser = await User.create({
            id: Generators.generateId(),
            username: username,
            email: email,
            password: encryptedPassword
        });

        return response.status(200).json({
            message: 'You have been signed up to Chator',
            id: newUser.id,
        });
    } else {
        return response.status(400).json({ error: errors });
    }
});

router.post('/login', async (request, response) => {
    const { email, password } = request.body;

    if (!email || !password)
        return response.status(400).json({ error: 'You must provide an email and password' });

    const user = await User.findOne({ email: email });

    if (!user || !await PasswordUtils.compare(password, user.password))
        return response.status(400).json({ error: 'Invalid username or password' });

    if (!user.emailConfirmed)
        return response.status(400).json({ error: 'Email is not verified, please check your emails' });

    const payload = {
        id: user.id,
        username: user.username
    };

    jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1d' }, (error, token) => {
        if (error) {
            console.log(error);
            return response.status(400).json({ error: 'Could not log you in' });
        }
        return response.status(200).json({ message: 'You have been logged in', token });
    });
});

router.post('/email/verify', async (request, response) => {
    const { token } = request.body;

    if (!token)
        return response.status(400).json({ error: 'You must provide an email verification token' });

    const dbToken = await EmailVerificationToken.findOne({ token });

    if (!dbToken)
        return response.status(400).json({ error: 'Invalid email verification token' });

    const user = await User.findOne({ id: dbToken.id });

    user.emailConfirmed = true;
    user.save();

    await EmailVerificationToken.deleteOne({ id: user.id, token: token });

    return response.status(200).json({ message: 'Your email has been verified. You can now login.' });
});

router.post('/email/verify/request', async (request, response) => {
    const { email } = request.body;
    if(!email)
        return response.status(400).json({ error: 'You must provide an email to verify' });
    
    const user = await User.findOne({ email });

    if(user) {
        const currentVerificationToken = await EmailVerificationToken.findOne({ id: user.id });
        const emailVerificationToken = !currentResetToken ? uuidv4() : currentResetToken.token;

        if (!currentVerificationToken) {
            EmailVerificationToken.create({
                id: user.id,
                token: emailVerificationToken
            });
        }

        EmailUtils.sendSimpleMessage(user.email, 'Chator Email Verification', `Please use the email verification token '${emailVerificationToken}'`);
    }
});

router.post('/password/reset', async (request, response) => {
    const { token, new_password, new_password_confirm } = request.body;

    if (!token || !new_password || !new_password_confirm)
        return response.status(400).json({ error: 'You must provide a password reset token and a password' });

    if (new_password !== new_password_confirm)
        return response.status(400).json({ error: 'Passwords are not the same' });

    const dbToken = await PasswordResetToken.findOne({ token: token });

    if (!dbToken)
        return response.status(400).json({ error: 'Invalid password reset token' });

    const user = await User.findOne({ id: dbToken.id });

    if (await PasswordUtils.compare(new_password, user.password))
        return response.status(400).json({ error: 'You cannot use the same password as your previous password' });

    user.password = await PasswordUtils.encrypt(new_password);
    user.save();

    await PasswordResetToken.deleteOne({ id: user.id, token: token });

    return response.status(200).json({ message: 'Your password has been reset. You can now login.' });
});

router.post('/password/reset/request', async (request, response) => {
    const { email } = request.body;

    const user = await User.findOne({ email: email });

    if (!user) {
        console.error(`Someone tried to reset a password for the email '${email}' but it does not exist in the system`);
    }
    else {
        const currentResetToken = await PasswordResetToken.findOne({ id: user.id });
        const passwordResetToken = !currentResetToken ? uuidv4() : currentResetToken.token;

        if (!currentResetToken) {
            PasswordResetToken.create({
                id: user.id,
                token: passwordResetToken
            });
        }

        EmailUtils.sendSimpleMessage(user.email, 'Chator Password Reset', `Please use the password reset code '${passwordResetToken}'`);
    }
    return response.status(200).json({ message: 'If that email exists, you have been sent a password reset link' });
});

module.exports = router;