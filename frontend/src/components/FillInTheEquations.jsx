import React, { useState, useEffect } from "react";
import axios from "axios";

const FillEquationGame = () => {
  const [equation, setEquation] = useState([]);
  const [userEquation, setUserEquation] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [draggedNumber, setDraggedNumber] = useState(null);

  useEffect(() => {
    fetchEquation();
  }, []);

  const fetchEquation = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.get("http://localhost:5000/api/game/random-equation");
      if (res.data.equation && res.data.equation.length > 0) {
        setEquation(res.data.equation);
        setUserEquation(res.data.equation.map((item) => (item === "_" ? null : item)));
        setOptions(res.data.options || []);
      }
    } catch (error) {
      console.error("Error fetching equation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (num) => {
    setDraggedNumber(num);
  };

  const handleDrop = (index) => {
    if (draggedNumber !== null) {
      setUserEquation((prev) => {
        const newEquation = [...prev];
        newEquation[index] = draggedNumber;
        return newEquation;
      });
      setDraggedNumber(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const checkAnswer = () => {
    if (userEquation.includes(null)) {
      setMessage("⚠️ Fill all blanks!");
      return;
    }

    const correctEquation = equation.map((item, index) =>
      item === "_" ? userEquation[index] : item
    );

    const evalString = correctEquation.join("").replace(/×/g, "*").replace(/÷/g, "/");

    try {
      const [lhs, rhs] = evalString.split("="); // Split at '='
      if (eval(lhs) === eval(rhs)) {
        setMessage("✅ Correct!");
      } else {
        setMessage("❌ Try Again!");
      }
    } catch (error) {
      console.error("Error evaluating equation:", error);
      setMessage("⚠️ Invalid Equation!");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎯 Fill in the Equation</h1>

      {loading ? (
        <p style={styles.loading}>Loading equation...</p>
      ) : (
        <>
          <div style={styles.equationContainer}>
            {equation.map((item, index) => (
              <span key={index} style={styles.equationItem}>
                {item === "_" ? (
                  <span
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                    style={{
                      ...styles.blank,
                      backgroundColor: userEquation[index] ? "#dff0d8" : "#f0f0f0",
                    }}
                  >
                    {userEquation[index] !== null ? (
                      <img
                        src={`/signs_icons/numb_${userEquation[index]}.png`}
                        alt={`Number ${userEquation[index]}`}
                        style={styles.numberImage}
                      />
                    ) : (
                      "?"
                    )}
                  </span>
                ) : (
                  <span>
                   {isNaN(item) ? (
  item // Show operators (+, -, ×, ÷)
) : (
  <span style={styles.multiDigitContainer}>
    {[...String(item)].map((digit, i) => (
      <img
        key={i}
        src={`/signs_icons/numb_${digit}.png`}
        alt={`Number ${digit}`}
        style={styles.numberImage}
      />
    ))}
  </span>
)}

                  </span>
                )}
              </span>
            ))}
          </div>

          <div style={styles.optionsContainer}>
            {options.map((num, i) => (
              <img
                key={i}
                src={`/signs_icons/numb_${num}.png`}
                alt={`Number ${num}`}
                draggable
                onDragStart={() => handleDragStart(num)}
                style={styles.numberImage}
              />
            ))}
          </div>

          <div style={styles.buttonContainer}>
            <button onClick={checkAnswer} style={styles.button}>
              ✅ Check Answer
            </button>
            <button onClick={fetchEquation} style={styles.button}>
              🔄 Next
            </button>
          </div>

          {message && <p style={styles.message}>{message}</p>}
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f9f9f9",
    minHeight: "100vh",
  },
  multiDigitContainer: {
    display: "flex",
    alignItems: "center", // Aligns digits in a straight line
    gap: "2px", // Small space between digits
  },
  
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  equationContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    background: "#fff",
    padding: "15px 30px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  equationItem: {
    fontSize: "26px",
    fontWeight: "bold",
  },
  blank: {
    display: "inline-block",
    width: "50px",
    height: "50px",
    border: "2px dashed blue",
    textAlign: "center",
    lineHeight: "50px",
    cursor: "pointer",
  },
  optionsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    margin: "20px 0",
  },
  numberImage: {
    width: "50px",
    cursor: "pointer",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "20px",
  },
  button: {
    padding: "12px 25px",
    fontSize: "18px",
    fontWeight: "bold",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.2s",
  },
  message: {
    fontSize: "20px",
    marginTop: "20px",
    fontWeight: "bold",
    color: "#333",
  },
};

export default FillEquationGame;
