const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Get all users (with search + filters)
router.get('/', authenticateToken, async (req, res) => {
    try {
        let { search, gender, city, education } = req.query;
        let query = 'SELECT id, email, gender, city, selected_image, education, created_at FROM users WHERE 1=1';
        let params = [];

        if (search) {
            query += ' AND email LIKE ?';
            params.push(`%${search}%`);
        }
        if (gender && gender !== 'all') {
            query += ' AND gender = ?';
            params.push(gender);
        }
        if (city && city !== 'all') {
            query += ' AND city = ?';
            params.push(city);
        }
        if (education && education !== 'all') {
            query += ' AND FIND_IN_SET(?, education)';
            params.push(education);
        }

        query += ' ORDER BY created_at DESC';
        const [users] = await db.query(query, params);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single user
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, email, gender, city, selected_image, education FROM users WHERE id = ?', [req.params.id]);
        if (users.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { email, gender, city, selected_image, education, password } = req.body;
        const userId = req.params.id;

        const [existing] = await db.query('SELECT * FROM users WHERE email = ? AND id != ?', [email, userId]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already used by another user' });
        }

        let updateQuery = 'UPDATE users SET email = ?, gender = ?, city = ?, selected_image = ?, education = ?';
        let params = [email, gender, city, selected_image, education];

        if (password && password.trim() !== '') {
            const hashed = await bcrypt.hash(password, 10);
            updateQuery += ', password = ?';
            params.push(hashed);
        }

        updateQuery += ' WHERE id = ?';
        params.push(userId);
        await db.query(updateQuery, params);
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete user
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;