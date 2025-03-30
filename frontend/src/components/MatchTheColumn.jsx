import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, { addEdge, Handle, Background } from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";

const wordNodeStyle = {
  background: "#3498db",
  color: "white",
  padding: "5px 8px",
  borderRadius: "5px",
  textAlign: "center",
  width: "100px",
  fontWeight: "bold",
  fontSize: "12px",
};

const imageNodeStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100px",
  height: "50px",
  borderRadius: "5px",
  background: "#2c3e50",
  overflow: "hidden",
};

const WordNode = ({ data }) => (
  <div style={wordNodeStyle}>
    {data.label}
    <Handle type="source" position="right" style={{ background: "#fff" }} />
  </div>
);
const ImageNode = ({ data }) => {
  console.log("ImageNode Data:", data); // Debugging

  return (
    <div style={imageNodeStyle}>
      <img 
        src={data.label} 
        alt="Hand sign" 
        style={{ width: "100%", height: "100%" }} 
        onError={(e) => console.error("Image failed to load:", e.target.src)}
      />
      <Handle type="target" position="left" style={{ background: "#fff" }} />
    </div>
  );
};

const nodeTypes = { wordNode: WordNode, imageNode: ImageNode };

const MatchTheColumn = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [validationResults, setValidationResults] = useState(null);

  useEffect(() => {
    const savedNodes = JSON.parse(localStorage.getItem("nodes"));
    const savedEdges = JSON.parse(localStorage.getItem("edges"));
  
    if (savedNodes && savedEdges) {
      setNodes(savedNodes);
      setEdges(savedEdges);
    } else {
      axios.get("http://localhost:5000/api/game/questions")
        .then((res) => {
          const nodeCount = Math.max(res.data.left.length, res.data.right.length);
          const nodeSpacing = Math.min(100, 600 / nodeCount);
          const startY = 150; 
  
          console.log("API Response Right:", res.data.right);

          const leftNodes = res.data.left.map((item, index) => ({
            id:`${item.id}`,
            type: "wordNode",
            position: { x: 250, y: startY + index * nodeSpacing },
            data: { label: item.text },
          }));
  
          const rightNodes = res.data.right.map((item, index) => ({
            id: `${item.id}`,
            type: "imageNode",
            position: { x: 500, y: startY + index * nodeSpacing },
            data: { label: item.image },
          }));

          console.log("Right Nodes:", rightNodes); 
          setNodes([...leftNodes, ...rightNodes]);
          localStorage.setItem("nodes", JSON.stringify([...leftNodes, ...rightNodes]));
          localStorage.setItem("answers", JSON.stringify(res.data.answers));
        })
        .catch((error) => console.error("Error fetching options:", error));
    }
  }, []);
  

  const onConnect = useCallback(
    (params) => {
      const sourceExists = edges.some((edge) => edge.source === params.source);
      const targetExists = edges.some((edge) => edge.target === params.target);

      if (sourceExists || targetExists) {
        alert("Each item can only be connected once!");
        return;
      }

      setEdges((eds) => addEdge({ ...params, animated: true }, eds));
    },
    [edges]
  );

  const handleSubmit = () => {
    const formattedEdges = edges.map(({ source, target }) => ({ source, target }));
    
    axios
      .post("http://localhost:5000/api/game/questions/validate", {
        connections: formattedEdges,
        answers: JSON.parse(localStorage.getItem("answers")), // Send the correct answers stored earlier
      })
      .then((res) => setValidationResults(res.data.correctConnections))
      .catch((error) => console.error("Validation error:", error));
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.gameWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges.map((edge) => ({
            ...edge,
            animated: true,
            style: {
              stroke: validationResults
                ? validationResults.includes(edge.source + "-" + edge.target)
                  ? "green"
                  : "red"
                : "black",
              strokeWidth: 2,
            },
          }))}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          zoomOnScroll={false}
          zoomOnPinch={false} 
          zoomOnDoubleClick={false}
          panOnDrag={false}
          fitView
          proOptions={{ hideAttribution: true }}
        />
      </div>
      <button style={styles.button} onClick={handleSubmit}>Submit</button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#ecf0f1",
    padding: "20px",
  },
  gameWrapper: {
    width: "800px",
    height: "600px",
    background: "white",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  button: {
    marginTop: "20px",
    padding: "12px 20px",
    background: "#2ecc71",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "16px",
  },
};
export default MatchTheColumn;