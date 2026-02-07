const Fragrance = require('../models/Fragrance');
const User = require('../models/User');
const express = require('express');
const router = express.Router();

router.get('/user/favorites', async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: "Missing required query parameter: email" });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).populate('fragrance_favorites');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.fragrance_favorites);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/remove/user/fragrance', async (req, res) => {
    try {
        const { email, Name } = req.body;

        if (!email || !Name) {
            return res.status(400).json({ message: "Email and fragrance name are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const fragrance = await Fragrance.findOne({ Name });
        if (!fragrance) {
            return res.status(404).json({ message: "Fragrance not found" });
        }

        if (!user.fragrance_favorites.includes(fragrance._id)) {
            return res.status(400).json({ message: "Fragrance not in favorites list" });
        }

        user.fragrance_favorites = user.fragrance_favorites.filter(
            fav => fav.toString() !== fragrance._id.toString()
        );
        await user.save();

        res.json({ message: "Fragrance removed from favorites successfully", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/save/user/fragrance', async (req, res) => {
    try {
        const { email, Brand, Name, Notes, Images } = req.body;

        if (!email || !Name) {
            return res.status(400).json({ message: "Email and fragrance name are required" });
        }

        let fragrance = await Fragrance.findOne({ Name });
        if (!fragrance) {
            fragrance = new Fragrance({ Brand, Name, Notes, Images: Images || [] });
            await fragrance.save();
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.fragrance_favorites.includes(fragrance._id)) {
            return res.status(400).json({ message: "Fragrance already in favorites list" });
        }

        user.fragrance_favorites.push(fragrance._id);
        await user.save();

        res.json({ message: "Fragrance added to favorites successfully", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
