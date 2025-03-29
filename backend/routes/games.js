const express = require("express");
const router = express.Router();
const fs = require('fs');



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



// Helper function to shuffle an array
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

// Load questions from JSON
const loadQuestions = () => {
  const data = JSON.parse(fs.readFileSync("questions.json", "utf8"));
  const question = data.questions[0];

  const selectedLeft = shuffleArray([...question.left]).slice(0, 3);
  const answers = Object.fromEntries(
    selectedLeft.map((item) => [item.id, question.answers[item.id]])
  );

  const selectedRight = selectedLeft.map((item) => ({
    id: answers[item.id],
    text: question.right.find((r) => r.id === answers[item.id]).text,
  }));

  return { left: selectedLeft, right: shuffleArray(selectedRight), answers };
};

// ✅ Get a random question
router.get("/questions", (req, res) => {
  const randomizedQuestion = loadQuestions();
  // Send the correct answers along with the question for validation
  res.json({
    left: randomizedQuestion.left,
    right: randomizedQuestion.right,
    answers: randomizedQuestion.answers, // Send correct answers
  });
});

// ✅ Validate user answers
router.post("/questions/validate", (req, res) => {
  const { connections, answers } = req.body;
  if (!connections || !answers)
    return res.status(400).json({ error: "No connections provided" });

  let correctConnections = [];

  connections.forEach(({ source, target }) => {
    const leftId = source.replace("L-", "");
    const rightId = target.replace("R-", "");

    if (answers[leftId] === rightId) {
      correctConnections.push(`${source}-${target}`);
    }
  });

  res.json({
    correctConnections,
    message: `You got ${correctConnections.length} out of ${Object.keys(answers).length} correct!`,
  });
});


module.exports = router; 