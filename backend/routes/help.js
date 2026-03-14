const express = require('express');
const router = express.Router();
const Query = require('../models/Query');

router.post('/contact', async (req, res) => {
    try {
        const { role, name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const newQuery = new Query({
            role,
            name,
            email,
            message
        });

        await newQuery.save();

        res.status(201).json({ success: true, message: "Message sent successfully! Our team will contact you soon." });

    } catch (error) {
        console.error("Contact Form Error:", error);
        res.status(500).json({ success: false, message: "Failed to send message. Server error." });
    }
});

module.exports = router;