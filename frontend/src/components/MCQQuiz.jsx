import React, { useState, useEffect } from 'react';

const MCQQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/mcq')
      .then(res => res.json())
      .then(data => setQuestions(data));
  }, []);

  const handleSubmit = async () => {
    if (selectedAnswer === null) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const response = await fetch(`http://localhost:5000/api/mcq/${currentQuestion.id}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer: selectedAnswer })
    });

    const data = await response.json();
    setResult(data.correct ? "Correct! 🎉" : "Wrong! ❌");
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setResult(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  if (quizCompleted) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center' }}>
        <h2>Quiz Completed! 🎯</h2>
      </div>
    );
  }

  if (questions.length === 0) {
    return <p>Loading questions...</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '2px 2px 10px rgba(0,0,0,0.1)', backgroundColor: '#fff', maxWidth: '400px' }}>
        <h3>{currentQuestion.question}</h3>
        <div>
          {currentQuestion.options.map((opt, index) => (
            <button 
              key={index} 
              onClick={() => setSelectedAnswer(index)} 
              style={{
                margin: '5px',
                padding: '10px',
                borderRadius: '5px',
                backgroundColor: selectedAnswer === index ? '#007bff' : '#f0f0f0',
                color: selectedAnswer === index ? '#fff' : '#000',
                cursor: 'pointer'
              }}
            >
              {opt.startsWith('http') ? <img src={opt} alt={`Option ${index}`} width={50} /> : opt}
            </button>
          ))}
        </div>
        <button 
          onClick={handleSubmit} 
          style={{ marginTop: '10px', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#28a745', color: '#fff', cursor: 'pointer' }}
        >
          Submit
        </button>
        {result && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{result}</p>}
        {result && (
          <button 
            onClick={handleNext} 
            style={{ marginTop: '10px', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer' }}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default MCQQuiz;
