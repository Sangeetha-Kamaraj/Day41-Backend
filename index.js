const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');

const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/password_reset', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// User model
const User = mongoose.model('User', {
    username: String,
    email: String,
    password: String,
    resetToken: String,
    resetTokenExpiry: Date
});

// Routes


// Get all users endpoint
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (user) {
            res.json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = new User({ username, email, password });
        await user.save();
        res.json({ message: 'Signup successful', user });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Forgot password endpoint
app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const resetToken = randomstring.generate();
            const resetTokenExpiry = new Date(Date.now() + 3600000); // Token expires in 1 hour
            await User.updateOne({ email }, { $set: { resetToken, resetTokenExpiry } });

            // Send reset password email
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'your-email@gmail.com',
                    pass: 'your-password'
                }
            });

            const mailOptions = {
                from: 'your-email@gmail.com',
                to: email,
                subject: 'Password Reset',
                text: `Your password reset token is: ${resetToken}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({ message: 'Failed to send reset password email' });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.json({ message: 'Reset password email sent successfully' });
                }
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Password reset endpoint
app.post('/api/reset-password', async (req, res) => {
    const { email, token, newPassword } = req.body;
    try {
        const user = await User.findOne({ email, resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
        if (user) {
            await User.updateOne({ email }, { $set: { password: newPassword, resetToken: null, resetTokenExpiry: null } });
            res.json({ message: 'Password reset successful' });
        } else {
            res.status(401).json({ message: 'Invalid or expired token' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get user by ID endpoint
app.get('/api/user/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
