const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secretKey = '11231ab12';
const User = require('../models/user');

// Đăng nhập
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Email not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Tạo JWT token
        const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: '30m' });

        res.status(200).json({ token });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: 'Login failed' });
    }
});

module.exports = router;
