import { useEffect, useState } from "react";

const serverURL = "http://localhost:5000";
const conditions = [">", ">=", "<", "<="];

export default function MathGame() {
  const [stage, setStage] = useState(1); // Start at Stage 1
  const [num1, setNum1] = useState(null);
  const [num2, setNum2] = useState(null);
  const [operation, setOperation] = useState(null);
  const [generatedNumber, setGeneratedNumber] = useState(null);
  const [userSelection, setUserSelection] = useState([]); // Stores selected digits as images
  const [feedback, setFeedback] = useState("");
  const [condition, setCondition] = useState(">=");

  // Fetch number on stage change
  useEffect(() => {
    fetchNumber();
  }, [stage]);

  async function fetchNumber() {
    setUserSelection([]);
    setFeedback("");

    let endpoint;
    if (stage === 1) {
      endpoint = "/api/game/random-number";
    } else if (stage === 2) {
      endpoint = "/api/game/random-number_2";
    } else {
      endpoint = "/api/game/random-number_3"; // Stage 3 now includes a random condition
    }
    const response = await fetch(`${serverURL}${endpoint}`);
    const data = await response.json();

    if (stage === 1) {
      setGeneratedNumber(data.number);
    } else {
      setNum1(data.num1);
      setNum2(data.num2);
      setOperation(data.operation);
      setGeneratedNumber(data.result);
      if (stage === 3) setCondition(data.condition);
    }
  }

  // Determine the max allowed digits based on the length of the generated number
  const maxDigitsAllowed = generatedNumber ? generatedNumber.toString().length : 1;

  // Add digit to user selection
  function selectDigit(digit) {
    if (userSelection.length >= maxDigitsAllowed) return;
    setUserSelection([...userSelection, digit]);
  }

  // Remove digit by clicking on it
  function removeDigit(index) {
    setUserSelection(userSelection.filter((_, i) => i !== index));
  }

  // Check the answer
  async function checkAnswer() {
    const userNumber = parseInt(userSelection.join(""), 10) || 0;
    const response = await fetch(`${serverURL}/api/game/check-number`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userNumber, generatedNumber,stage, condition }),
    });

    const data = await response.json();
    setFeedback(data.message);
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Math Game</h1>
      <p style={styles.description}>
        Solve the problem and give correct answers to earn points
      </p>

      {/* Stage Selection */}
<div style={styles.stageSelector}>
  <button 
    style={stage === 1 ? styles.activeButton : styles.inactiveButton} 
    onClick={() => setStage(1)}
  >
    Stage 1
  </button>
  <button 
    style={stage === 2 ? styles.activeButton : styles.inactiveButton} 
    onClick={() => setStage(2)}
  >
    Stage 2
  </button>
  <button 
    style={stage === 3 ? styles.activeButton : styles.inactiveButton} 
    onClick={() => setStage(3)}
  >
    Stage 3
  </button>
</div>

{/* Number to Beat / Math Problem */}
{stage === 1 ? (
  <h2 style={styles.correctNumber}>
    Number to Beat: <span style={{ color: "#007bff", fontWeight: "bold" }}>{generatedNumber}</span>
  </h2>
) : stage === 2 ? (
  <h2 style={styles.correctNumber}>
    Solve:{" "}
    <span style={{ fontWeight: "bold" }}>
      {num1} {operation} {num2} {" "} &gt;= {" "}
      <span style={{ color: "#007bff", fontWeight: "bold" }}></span>
    </span>
  </h2>
) : (
  <h2 style={styles.correctNumber}>
    Solve:{" "}
    <span style={{ fontWeight: "bold" }}>
      {num1} {operation} {num2} {" "} {condition} {" "}
      <span style={{ color: "#007bff", fontWeight: "bold" }}></span>
    </span>
  </h2>
)}

      

      {/* User Answer Display (as images) */}
      <h2>Your Answer:</h2>
      <div style={styles.answerBox}>
        {userSelection.length === 0 ? (
          <p style={{ color: "#999" }}>Click on numbers below</p>
        ) : (
          userSelection.map((digit, index) => (
            <img
              key={index}
              src={`/signs_icons/numb_${digit}.png`}
              alt={digit}
              style={styles.answerImage}
              onClick={() => removeDigit(index)}
            />
          ))
        )}
      </div>

      {/* Number Selection (as images) */}
      <h2>Select a Number:</h2>
      <div style={styles.numberBox}>
        {[...Array(10)].map((_, i) => (
          <img
            key={i}
            src={`/signs_icons/numb_${i}.png`}
            alt={i}
            style={{
              ...styles.numberImage,
              opacity: userSelection.length >= maxDigitsAllowed ? 0.5 : 1,
              pointerEvents: userSelection.length >= maxDigitsAllowed ? "none" : "auto",
            }}
            onClick={() => selectDigit(i)}
          />
        ))}
      </div>

      <p style={{ fontSize: "18px", fontWeight: "bold", color: feedback === "Correct! You win!" ? "green" : "red" }}>
        {feedback}
      </p>

      {/* Buttons */}
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={checkAnswer}>✅ Check Answer</button>
        <button style={styles.button} onClick={fetchNumber}>🔄 New Number</button>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f8f9fa",
    height: "100vh",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  },
  description: {
    fontSize: "18px",
    color: "#555",
    marginBottom: "20px",
  },
  stageSelector: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "20px",
  },
  activeButton: {
    padding: "10px 20px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    borderRadius: "5px",
    border: "none",
    color: "white",
    backgroundColor: "#28a745",
  },
  inactiveButton: {
    padding: "10px 20px",
    fontSize: "18px",
    cursor: "pointer",
    borderRadius: "5px",
    border: "none",
    color: "white",
    backgroundColor: "#6c757d",
  },
  correctNumber: {
    fontSize: "24px",
    color: "#333",
    marginBottom: "20px",
  },
  answerBox: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    padding: "10px",
    border: "2px dashed gray",
    minHeight: "60px",
  },
  numberBox: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "10px",
  },
  numberImage: {
    width: "50px",
    cursor: "pointer",
    border: "2px solid black",
    padding: "5px",
    borderRadius: "5px",
    backgroundColor: "#fff",
    transition: "opacity 0.3s",
  },
  answerImage: {
    width: "50px",
    cursor: "pointer",
    border: "2px solid red",
    padding: "5px",
    borderRadius: "5px",
    backgroundColor: "#fff",
  },
  buttonContainer: {
    marginTop: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "18px",
    cursor: "pointer",
    borderRadius: "5px",
    margin: "0 10px",
    border: "none",
    color: "white",
    backgroundColor: "#007bff",
  },
};
