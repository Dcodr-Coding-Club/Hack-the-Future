import { useEffect, useState } from "react";
import axios from "axios";

const serverURL = "http://localhost:5000";

export default function RandomWords() {
  const [correctWord, setCorrectWord] = useState("");
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [userSelection, setUserSelection] = useState([]);
  const [feedback, setFeedback] = useState("");

  // Fetch a random word from the backend
  useEffect(() => {
    fetchWord();
  }, []);

  async function fetchWord() {
    try {
      const response = await axios.get(`${serverURL}/api/game/random-word`, {
        withCredentials: true, // Ensures session data is sent
      });

      setCorrectWord(response.data.word);
      displayShuffledLetters(response.data.word);
    } catch (error) {
      console.error("Error fetching word:", error);
    }
  }

  // Shuffle letters and set images
  function displayShuffledLetters(word) {
    const letters = word.split("").map((char, index) => ({
      id: index,
      char,
      img: `/signs_icons/letter_${char}.png`,
    }));

    setShuffledLetters(letters.sort(() => Math.random() - 0.5));
    setUserSelection([]); // Clear previous selections
  }

  // Handle letter selection
  function selectLetter(letter) {
    setUserSelection([...userSelection, letter]);
    setShuffledLetters(shuffledLetters.filter((l) => l.id !== letter.id));
  }

  // Handle letter removal (move back to scrambled)
  function removeLetter(letter) {
    setShuffledLetters([...shuffledLetters, letter].sort(() => Math.random() - 0.5));
    setUserSelection(userSelection.filter((l) => l.id !== letter.id));
  }

  // Check the answer
  async function checkAnswer() {
    try {
      const response = await axios.post(
        `${serverURL}/api/game/check-answer`,
        {
          userAnswer: userSelection.map((l) => l.char).join(""),
          correctWord,
        },
        { withCredentials: true } // Ensures authentication/session is used
      );

      setFeedback(response.data.message); // Store result instead of alert
    } catch (error) {
      console.error("Error validating answer:", error);
    }
  }

  // Reset the game
  function resetGame() {
    fetchWord();
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Word Scramble Game</h1>
      <p style={styles.description}>
        Arrange the letters to form the correct word. Click on the scrambled letters to move them to your answer.
        Click on the answer to move them back.
      </p>

      {/* Display the word the user has to form */}
      <h2 style={styles.correctWord}>
        Word to Form: <span style={{ color: "#007bff", fontWeight: "bold" }}>{correctWord.toUpperCase()}</span>
      </h2>

      <div style={styles.gameArea}>
        {/* Scrambled Letters */}
        <div style={styles.column}>
          <h2>Scrambled Letters</h2>
          <div style={styles.letterBox}>
            {shuffledLetters.map((letter) => (
              <img
                key={letter.id}
                src={letter.img}
                alt={letter.char}
                style={styles.letterImage}
                onClick={() => selectLetter(letter)}
              />
            ))}
          </div>
        </div>

        {/* Answer Section */}
        <div style={styles.column}>
          <h2>Your Answer</h2>
          <div style={styles.answerBox}>
            {userSelection.map((letter) => (
              <img
                key={letter.id}
                src={letter.img}
                alt={letter.char}
                style={styles.answerImage}
                onClick={() => removeLetter(letter)}
              />
            ))}
          </div>
        </div>
      </div>
      <p style={{ fontSize: "18px", fontWeight: "bold", color: feedback === "Correct!" ? "green" : "red" }}>
        {feedback}
      </p>

      {/* Buttons */}
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={checkAnswer}>
          ✅ Check Answer
        </button>
        <button style={styles.button} onClick={resetGame}>
          🔄 Reset
        </button>
        <button style={styles.button} onClick={fetchWord}>
          ⏭️ Next
        </button>
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
  correctWord: {
    fontSize: "24px",
    color: "#333",
    marginBottom: "20px",
  },
  gameArea: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "50px",
  },
  column: {
    width: "300px",
    minHeight: "150px",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "white",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  letterBox: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  answerBox: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
    border: "2px dashed gray",
    padding: "10px",
    minHeight: "60px",
  },
  letterImage: {
    width: "50px",
    cursor: "pointer",
    border: "2px solid black",
    padding: "5px",
    borderRadius: "5px",
    backgroundColor: "#fff",
  },
  answerImage: {
    width: "50px",
    cursor: "pointer",
    border: "2px solid blue",
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
