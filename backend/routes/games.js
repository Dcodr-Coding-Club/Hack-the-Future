const express = require("express");
const router = express.Router();



const words = ["apple", "banana", "grape", "cherry"];

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

// ✅ Route to get a random word
router.get("/random-word", (req, res) => {
  const word = getRandomWord();
  res.json({ word });
});

// ✅ Route to check the answer
router.post("/check-answer", (req, res) => {
  const { userAnswer, correctWord } = req.body;
  if (userAnswer === correctWord) {
    return res.json({ success: true, message: "Correct!" });
  }
  res.json({ success: false, message: "Try again!" });
});



// Static question (only one question)
const question = {
  left: [
    { id: "l1", text: "Apple" },
    { id: "l2", text: "Dog" },
    { id: "l3", text: "Car" },
    
  ],
  right: [
    { id: "r1", text: "Fruit" },
    { id: "r2", text: "Vehicle" },
    { id: "r3", text: "Animal" },
    
  ],
  answers: {
    l1: "r1", // Apple → Fruit
    l2: "r3", // Banana → Fruit
    l3: "r2", // Car → Vehicle
    
  },
};

// ✅ Get the static question (no need for IDs)
router.get("/questions", (req, res) => {
  res.json({ left: question.left, right: question.right });
});

// ✅ Validate user answers
router.post("/questions/validate", (req, res) => {
    const { connections } = req.body;
    if (!connections) return res.status(400).json({ error: "No connections provided" });
  
    let correctConnections = [];
  
    connections.forEach(({ source, target }) => {
      const leftId = source.replace("L-", ""); // Extract actual IDs
      const rightId = target.replace("R-", "");
  
      if (question.answers[leftId] === rightId) {
        correctConnections.push(`${source}-${target}`);
      }
    });
  
    res.json({
      correctConnections, // Send correct connections back for validation coloring
      message: `You got ${correctConnections.length} out of ${Object.keys(question.answers).length} correct!`,
    });
});

module.exports = router; 