const express = require("express");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = (passport, client) => {
    const router = express.Router();

    // Multer storage configuration for profile picture uploads
    const storage = multer.diskStorage({
        destination: "uploads/",
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    });

    const upload = multer({ storage });

    // Signup Route
    router.post("/signup", async (req, res) => {
        const { username, email, password, confirmPassword } = req.body;
        
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        try {
            const users = await client.query("SELECT * FROM users WHERE username=$1", [username]);
            if (users.rows.length > 0) {
                return res.status(400).json({ message: "Username already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await client.query(
                "INSERT INTO users(username, email, password) VALUES($1, $2, $3)",
                [username, email, hashedPassword]
            );

            res.status(201).json({ message: "Signup successful" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    });

    // Login Route
    router.post("/login", passport.authenticate("local"), (req, res) => {
        res.json({ message: "Login successful", user: req.user });
    });

    // Logout Route
    router.get("/logout", (req, res, next) => {
        req.logout((err) => {
            if (err) return next(err);
            res.json({ message: "Logout successful" });
        });
    });

    // Check Authentication
    router.get("/check-auth", (req, res) => {
        if (req.isAuthenticated()) {
            res.json({ isAuthenticated: true, user: req.user });
        } else {
            res.status(401).json({ isAuthenticated: false });
        }
    });

    // Forgot Password Route
    router.post("/forgotPassword", async (req, res) => {
        const { email } = req.body;

        try {
            const user = await client.query("SELECT * FROM users WHERE email=$1", [email]);
            if (user.rows.length === 0) {
                return res.status(404).json({ message: "User not found." });
            }

            // Generate reset token
            const resetToken = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            // Send email with reset link
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const resetUrl = `http://localhost:3000/resetPassword/${resetToken}`;
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.rows[0].email,
                subject: "Password Reset Request",
                text: `Click the following link to reset your password: ${resetUrl}`,
            };

            await transporter.sendMail(mailOptions);
            res.json({ message: "Reset link sent to email." });
        } catch (error) {
            console.error("Forgot Password Error:", error);
            res.status(500).json({ message: "Server error." });
        }
    });

    // Reset Password Route
    router.post("/resetPassword", async (req, res) => {
        const { token, password } = req.body;

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await client.query("SELECT * FROM users WHERE id=$1", [decoded.id]);

            if (user.rows.length === 0) {
                return res.status(404).json({ message: "User not found." });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await client.query("UPDATE users SET password=$1 WHERE id=$2", [hashedPassword, decoded.id]);

            res.json({ message: "Password reset successful!" });
        } catch (error) {
            console.error("Reset Password Error:", error);
            res.status(400).json({ message: "Invalid or expired token." });
        }
    });

    // Create or update user profile
    router.post("/profile", upload.single("profile_pic"), async (req, res) => {
        const { user_id, name, location, age, hobbies } = req.body;
        const profilePic = req.file ? `/uploads/${req.file.filename}` : "";

        if (!user_id || !name) {
            return res.status(400).json({ message: "User ID and Name are required." });
        }

        if (age && age < 0) {
            return res.status(400).json({ message: "Age must be a positive number." });
        }

        try {
            const userCheck = await client.query("SELECT * FROM users WHERE user_id=$1", [user_id]);
            if (userCheck.rows.length === 0) {
                return res.status(404).json({ message: "User not found." });
            }

            const result = await client.query(
                `INSERT INTO profiles (user_id, name, location, age, hobbies, profile_pic) 
                VALUES ($1, $2, $3, $4, $5, $6) 
                ON CONFLICT (user_id) 
                DO UPDATE SET 
                name = EXCLUDED.name, 
                location = EXCLUDED.location, 
                age = EXCLUDED.age, 
                hobbies = EXCLUDED.hobbies, 
                profile_pic = EXCLUDED.profile_pic 
                RETURNING *`, 
                [user_id, name, location, age || null, hobbies, profilePic]
            );

            res.json({ message: "Profile saved successfully!", profile: result.rows[0] });
        } catch (error) {
            console.error("Profile error:", error);
            res.status(500).json({ message: "Server error." });
        }
    });

    router.get("/profile", async (req, res) => {
        if (!req.user) { // Assuming Passport.js stores the logged-in user in req.user
            return res.status(401).json({ message: "Unauthorized" });
        }
    
        const user_id = req.user.user_id; // Get user ID from session
        try {
            const result = await client.query("SELECT * FROM profiles WHERE user_id = $1", [user_id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Profile not found." });
            }
            res.json(result.rows[0]);
        } catch (error) {
            console.error("Fetch profile error:", error);
            res.status(500).json({ message: "Server error." });
        }
    });
    
    return router;
};
