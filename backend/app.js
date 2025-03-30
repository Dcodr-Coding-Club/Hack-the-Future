const express = require("express");
const session = require("express-session");
const { Client } = require("pg");
const passport = require("passport");
const pgSession = require("connect-pg-simple")(session);
const cors = require("cors");
require("dotenv").config();
const path = require("path");


const app = express();
const PORT = process.env.PORT || 5000;

// PostgreSQL Client Setup
const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

client
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ PostgreSQL Connection Error:", err.stack));

// Session Middleware (Stores sessions in PostgreSQL)
app.use(
  session({
    store: new pgSession({
      pool: client,
      tableName: "session", // PostgreSQL table for sessions
      createTableIfMissing: true, // Automatically creates the table if missing
    }),
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }, // 1-day session expiry
  })
);

// Initialize Passport.js
require("./config/passport")(client);
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Update this if your frontend runs elsewhere
    credentials: true, // Allow cookies and authentication headers
  })
);

// Debugging Middleware (Optional)
app.use((req, res, next) => {
  console.log("🔍 Session Debugging:");
  console.log("Session ID:", req.sessionID);
  console.log("Session Data:", req.session);
  console.log("Authenticated User:", req.user);
  next();
});

// Routes
const authRoutes = require("./routes/auth")(passport, client); // Login & Signup
const pythonRoutes = require("./routes/python"); // Python Integration
const gameRoutes = require("./routes/games"); // Game API
const mcqRoutes = require("./routes/MCQ"); // MCQ Quiz API

app.get("/", (req, res) => {
  res.send("API is running. Navigate to /api for endpoints.");
});

app.use("/api/auth", authRoutes);
app.use("/api/python", pythonRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/mcq", mcqRoutes);

// Static file serving (for profile pictures and images)
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/uploads", express.static("uploads"));


// Logout Route
app.post("/api/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.json({ message: "Logout successful" });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
