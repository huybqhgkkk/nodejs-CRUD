// forgotPassword.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/user');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
    },
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Email not found.' });
        }

        // Tạo token reset password
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Cập nhật token vào người dùng trong cơ sở dữ liệu (ví dụ: user.resetToken = resetToken)
        user.resetToken = resetToken;
        await user.save();

        // Gửi email với link chứa token để reset mật khẩu
        const resetLink = `http://your-frontend-app/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Password Reset',
            text: `Click the link to reset your password: ${resetLink}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Email sent successfully.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error sending email.' });
    }
});

module.exports = router;
