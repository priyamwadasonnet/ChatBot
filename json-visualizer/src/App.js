import React, { useRef, useEffect } from "react";
import { Network } from "vis-network";
import "./App.css";

function JSONVisualizer({ data }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    // Convert JSON to nodes and edges for vis-network
    const createGraphData = (json) => {
      const nodes = [];
      const edges = [];

      let idCounter = 1;
      const traverse = (node, parentId = null) => {
        const nodeId = idCounter++;
        nodes.push({ id: nodeId, label: typeof node === "object" ? "Object" : String(node) });

        if (parentId !== null) {
          edges.push({ from: parentId, to: nodeId });
        }

        if (typeof node === "object" && node !== null) {
          Object.entries(node).forEach(([key, value]) => {
            const keyId = idCounter++;
            nodes.push({ id: keyId, label: key });
            edges.push({ from: nodeId, to: keyId });
            traverse(value, keyId);
          });
        }
      };

      traverse(json);
      return { nodes, edges };
    };

    const graphData = createGraphData(data);

    const options = {
      nodes: {
        shape: "box",
        color: {
          background: "#D2E5FF",
          border: "#2B7CE9",
        },
        font: { color: "#343434" },
      },
      edges: {
        color: "#848484",
        arrows: {
          to: { enabled: true, scaleFactor: 0.5 },
        },
      },
      layout: {
        hierarchical: {
          direction: "LR",
          sortMethod: "directed",
        },
      },
      interaction: { dragNodes: true },
      physics: true,
    };

    const network = new Network(containerRef.current, graphData, options);

    return () => {
      network.destroy(); // Cleanup the network instance
    };
  }, [data]);

  return <div ref={containerRef} style={{ height: "600px", border: "1px solid #ccc" }}></div>;
}

function App() {
  const [jsonInput, setJsonInput] = React.useState("");
  const [jsonData, setJsonData] = React.useState(null);
  const [error, setError] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const parsedJSON = JSON.parse(jsonInput);
      setJsonData(parsedJSON);
      setError("");
    } catch (err) {
      setError("Invalid JSON. Please fix and try again.");
      setJsonData(null);
    }
  };

  return (
    <div className="App">
      <h1>JSON Visualizer</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter JSON here..."
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          rows={10}
          cols={50}
          style={{ marginBottom: "10px" }}
        />
        <br />
        <button type="submit">Visualize</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="visualizer-container">
        {jsonData && <JSONVisualizer data={jsonData} />}
      </div>
    </div>
  );
}

export default App;
