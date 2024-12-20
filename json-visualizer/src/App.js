import React, { useState } from "react";
import JSONTree from "./JSONTree";
import "./App.css";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const parsedJSON = JSON.parse(jsonInput);
      setJsonData(parsedJSON);
      setError("");
    } catch (err) {
      setError("Invalid JSON! Please fix the syntax.");
      setJsonData(null);
    }
  };

  return (
    <div className="App">
      <h1>JSON Visualizer</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Paste your JSON here..."
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />
        <button type="submit">Visualize</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="visualization-container">
        {jsonData && <JSONTree data={jsonData} />}
      </div>
    </div>
  );
}

export default App;
