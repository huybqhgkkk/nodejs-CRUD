const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Kiểm tra xem người dùng đã tồn tại với email hoặc username này chưa
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            // Thêm các trường thông tin khác của người dùng (tuỳ ý)
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: savedUser });
    } catch (error) {
        console.error('error', error);
        res.status(500).json({ message: 'Registration failed' });
    }
});

module.exports = router;
