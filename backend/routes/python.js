const express = require("express");
const { runPythonScript } = require("../runner");
const path = require("path");

const router = express.Router();

// Define route to run FingerCounter.py
router.get("/run", (req, res) => {
    const pythonScriptPath = path.join(__dirname, "../../Modules/numbers/FingerCounter.py");

    // Execute Python script
    runPythonScript(pythonScriptPath)
        .then(() => res.send("Finger counting script started."))
        .catch((err) => res.status(500).send("Error starting the Python script: " + err.message));
});

module.exports = router;
