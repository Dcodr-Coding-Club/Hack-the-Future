import React, { useState } from "react";
import axios from "axios";

const FingerCounter = () => {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const startFingerCounting = async () => {
        try {
            setLoading(true);
            setMessage(""); // Clear previous messages

            // Make a GET request to the backend to run the Python script
            const response = await axios.get("http://localhost:5000/api/start-finger-counter");

            // Set the response message
            setMessage(response.data);
        } catch (error) {
            setMessage("Error starting the Python script: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Finger Counter</h1>
            <button onClick={startFingerCounting} disabled={loading}>
                {loading ? "Running..." : "Start Finger Counting"}
            </button>

            {message && <p>{message}</p>}
        </div>
    );
};

export default FingerCounter;
