const express = require('express');
const fs = require('fs');
const path = require('path');
const mcqFilePath = path.join(__dirname, '../JSON/mcqQuestions.json');

module.exports = (client) => {
  const router = express.Router();

  const loadQuestions = () => {
    try {
      const data = fs.readFileSync(mcqFilePath);
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  };

  const saveQuestions = (questions) => {
    fs.writeFileSync(mcqFilePath, JSON.stringify(questions, null, 2));
  };

  router.get('/:category', (req, res) => {
    const { category } = req.params;
    let questions = loadQuestions().filter(q => q.category.toLowerCase() === category.toLowerCase());

    if (questions.length === 0) {
        return res.status(404).json({ error: "No questions found for this category." });
    }

    // Shuffle the questions array
    questions = questions.sort(() => Math.random() - 0.5);

    // Pick the first 5 (or fewer if not enough questions exist)
    const selectedQuestions = questions.slice(0, 5);

    res.json(selectedQuestions); // ✅ Ensures different questions each time
});



  
  // Submit quiz for grading
  router.post('/:id/answer', (req, res) => {
    const { id } = req.params;
    const { answer } = req.body; // Answer is the actual selected text
    const questions = loadQuestions();
    const question = questions.find(q => q.id == id);

    if (!question) return res.status(404).json({ error: "Question not found" });

    const correctAnswer = question.options[question.correct_option]; // Get correct answer text
    res.json({ correct: correctAnswer === answer }); // Compare text, not index
});

  return router;
};
