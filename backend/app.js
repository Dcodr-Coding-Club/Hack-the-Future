const express = require("express");
require("dotenv").config();
const cors = require("cors");
const pythonRoute = require("./routes/python");
const gameRoutes=require("./routes/games");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: "http://localhost:5173", // Allow requests only from your frontend URL
        credentials: true, // Allow cookies and authentication headers
    })
);

app.get('/', (req, res) => {
    res.send('API is running. Navigate to /api for endpoints.');
});
app.use("/api", pythonRoute);
app.use("/api/games",gameRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
