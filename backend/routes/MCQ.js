// routes/mcqRoutes.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const mcqFilePath = path.join(__dirname, '../JSON/mcqQuestions.json');

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

router.get('/', (req, res) => {
  res.json(loadQuestions());
});

router.post('/', (req, res) => {
  const { question, options, correct_option } = req.body;
  const questions = loadQuestions();
  const newQuestion = {
    id: questions.length + 1,
    question,
    options,
    correct_option,
  };
  questions.push(newQuestion);
  saveQuestions(questions);
  res.status(201).json(newQuestion);
});

router.post('/:id/answer', (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;
  const questions = loadQuestions();
  const question = questions.find(q => q.id == id);
  if (!question) return res.status(404).json({ error: "Question not found" });
  res.json({ correct: question.correct_option === answer });
});

module.exports = router;