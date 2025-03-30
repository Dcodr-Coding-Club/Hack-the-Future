import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

axios.defaults.withCredentials = true;

const serverURL = "http://localhost:5000";
const drawerWidth = 240;
const categories = ["Maths", "English", "General Knowledge"];

const MCQQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [grade, setGrade] = useState("");
  const [score, setScore] = useState(0);
  const [open, setOpen] = useState(true);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    fetchQuestions(categories[categoryIndex]);
  }, [categoryIndex]);

  const fetchQuestions = async (category) => {
    try {
        const res = await axios.get(`${serverURL}/api/mcq/${category}`);
        setQuestions(res.data);  // ✅ Store the array directly
        setCurrentQuestionIndex(0);
        setQuizCompleted(false);
        setScore(0);
        setAccuracy(0);
        setGrade("");
    } catch (err) {
        console.error(`Error fetching questions for ${category}:`, err);
    }
};

  const handleSubmit = async () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];

    try {
      const { data } = await axios.post(`${serverURL}/api/mcq/${currentQuestion.id}/answer`, {
        answer: selectedAnswer, // Send only the answer value, not as an object
      });

      setUserAnswers([...userAnswers, { id: currentQuestion.id, correct: data.correct }]);

      if (data.correct) {
        setScore((prevScore) => prevScore + 1);
      }

      setResult(data.correct ? "Correct! 🎉" : "Wrong! ❌");
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setResult(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
      const acc = (score / questions.length) * 100;
      setAccuracy(acc);
      setGrade(acc >= 80 ? "A" : acc >= 60 ? "B" : acc >= 40 ? "C" : "D");
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#f4f4f4" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setOpen(!open)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">MCQ Quiz</Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : 56,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: open ? drawerWidth : 56,
            boxSizing: "border-box",
            transition: "width 0.3s ease",
            marginTop: "160px"
          },
        }}
      >
        <Toolbar />
        <List>
          {categories.map((cat, index) => (
            <ListItem button key={cat} onClick={() => setCategoryIndex(index)}>
              <ListItemText primary={cat} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: open ? `${drawerWidth}px` : "56px" ,marginTop: "150px" }}>
        <Toolbar />
        {quizCompleted ? (
          <Box textAlign="center">
            <Typography variant="h4">Quiz Completed!</Typography>
            <Typography variant="h6">Accuracy: {accuracy.toFixed(2)}%</Typography>
            <Typography variant="h6">Grade: {grade}</Typography>
          </Box>
        ) : questions.length > 0 ? (
          <Box textAlign="center" p={3}>
            <Typography variant="h5">
              {`(${currentQuestionIndex + 1}/${questions.length}) ${questions[currentQuestionIndex]?.question}`}
            </Typography>
            {questions[currentQuestionIndex]?.options.map((opt, index) => (
              <Button
                key={index}
                variant={selectedAnswer === opt ? "contained" : "outlined"}
                onClick={() => setSelectedAnswer(opt)}
                sx={{ m: 1 }}
              >
                {opt}
              </Button>
            ))}
            <br />
            <Button onClick={handleSubmit} disabled={selectedAnswer === null || result !== null} variant="contained" color="primary" sx={{ mt: 2 }}>
              Submit
            </Button>
            {result && (
              <>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {result}
                </Typography>
                <Button onClick={handleNext} variant="contained" color="secondary" sx={{ mt: 2 }}>
                  Next
                </Button>
              </>
            )}
          </Box>
        ) : (
          <Typography variant="h6">Loading questions...</Typography>
        )}
      </Box>
    </Box>
  );
};

export default MCQQuiz;
