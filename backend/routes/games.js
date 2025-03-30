const express = require("express");
const fs = require('fs');
const wordList = require("../JSON/words.json");  // Adjust path accordingly

module.exports = (client) => {
  const router = express.Router();
  
function generateEquation() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operations = ["+", "-", "*", "/"];
  const op = operations[Math.floor(Math.random() * operations.length)];

  let answer;
  switch (op) {
    case "+": answer = num1 + num2; break;
    case "-": answer = num1 - num2; break;
    case "*": answer = num1 * num2; break;
    case "/": answer = (num2 !== 0 ? (num1 / num2).toFixed(2) : "undefined"); break;
  }

  // Randomly hide one of the numbers
  const hideIndex = Math.random() > 0.5 ? 0 : 2; // Either num1 or num2

  let equation = [num1, op, num2, "=", answer];
  let displayEquation = [...equation];

  if (hideIndex === 0) displayEquation[0] = "_";  // Hide num1
  if (hideIndex === 2) displayEquation[2] = "_";  // Hide num2

  return {
    equation: displayEquation,
    answer: equation[hideIndex],
    options: [equation[hideIndex], equation[hideIndex] + 1, equation[hideIndex] - 1]
  };
}

// API Route
router.get("/random-equation", (req, res) => {
  const equationData = generateEquation();
  res.json(equationData);
});

module.exports = router;

function getRandomNumber() {
  return Math.floor(Math.random() * 1000) + 1; // Random number between 1 and 1000
}
const getRandomCondition = () => {
  const conditions = [">", ">=", "<", "<="];
  return conditions[Math.floor(Math.random() * conditions.length)];
};

// ✅ Route to get a random number
router.get("/random-number", (req, res) => {
  const number = getRandomNumber();
  res.json({ number });
});


router.get("/random-number_2", (req, res) => {
  let num1 = Math.floor(Math.random() * 90) + 10; // Random 2-digit number
  let num2 = Math.floor(Math.random() * 90) + 10;
  let operation = Math.random() < 0.5 ? "+" : "-";
  let result = operation === "+" ? num1 + num2 : num1 - num2;

  // Ensure the result is greater than 0
  while (result <= 0) {
    num1 = Math.floor(Math.random() * 90) + 10;
    num2 = Math.floor(Math.random() * 90) + 10;
    operation = Math.random() < 0.5 ? "+" : "-";
    result = operation === "+" ? num1 + num2 : num1 - num2;
  }

  res.json({ num1, num2, operation, result });
});


router.get("/random-number_3", (req, res) => {
  let num1 = Math.floor(Math.random() * 90) + 10; // Random 2-digit number
  let num2 = Math.floor(Math.random() * num1); // Ensure num2 < num1
  let operation = Math.random() > 0.5 ? "+" : "-";
  let result = operation === "+" ? num1 + num2 : num1 - num2;
  
  // Ensure the result is greater than 0
  while (result <= 0) {
    num1 = Math.floor(Math.random() * 90) + 10;
    num2 = Math.floor(Math.random() * num1);
    operation = Math.random() > 0.5 ? "+" : "-";
    result = operation === "+" ? num1 + num2 : num1 - num2;
  }

  const condition = getRandomCondition(); // Randomly select a condition

  res.json({ num1, num2, operation, result, condition });
});


router.post("/check-number", (req, res) => {
  const { userNumber, generatedNumber, stage, condition } = req.body;
  let message = "Incorrect! Try again.";

  if (stage === 1 || stage === 2) {
      if (userNumber >= generatedNumber) {
          message = "Correct! You win!";
      }
  } else if (stage === 3) {
      // Apply the random condition dynamically
      let isCorrect = false;
      switch (condition) {
          case ">":
              isCorrect = userNumber > generatedNumber;
              break;
          case ">=":
              isCorrect = userNumber >= generatedNumber;
              break;
          case "<":
              isCorrect = userNumber < generatedNumber;
              break;
          case "<=":
              isCorrect = userNumber <= generatedNumber;
              break;
      }
      message = isCorrect ? "You win!" : "Try again!";}

  res.json({ message });
});


function getRandomWord() {
  const words = wordList.words;
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
  const data = JSON.parse(fs.readFileSync("JSON/questions.json", "utf8"));
  const question = data.questions[0];

  const selectedLeft = shuffleArray([...question.left]).slice(0, 3);
  const answers = Object.fromEntries(
    selectedLeft.map((item) => [item.id, question.answers[item.id]])
  );

  
  const baseUrl = "http://localhost:5000";  // Change to your backend URL

const selectedRight = selectedLeft.map((item) => {
  const matchedRight = question.right.find((r) => r.id === answers[item.id]);
  return { id: matchedRight.id, image: `${baseUrl}${matchedRight.image}` };
});


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

return router;
};