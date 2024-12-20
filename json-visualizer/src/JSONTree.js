import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function JSONTree({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Dimensions for the SVG canvas
    const width = 1200;
    const height = 800;

    // Function to recursively format the JSON data into a D3 hierarchy-compatible structure
    const formatJSON = (data) => {
      if (typeof data === "object" && data !== null) {
        if (Array.isArray(data)) {
          return data.map((item, index) => ({
            name: `Index ${index}`,
            children: formatJSON(item),
          }));
        } else {
          return Object.entries(data).map(([key, value]) => ({
            name: key,
            children: formatJSON(value),
          }));
        }
      } else {
        return [{ name: String(data) }];
      }
    };

    // Convert JSON data to a D3 hierarchy-compatible structure
    const root = d3.hierarchy({ name: "Root", children: formatJSON(data) });

    // Create a tree layout
    const treeLayout = d3.tree().size([width - 200, height - 200]);
    treeLayout(root);

    // Create an SVG container
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("border", "1px solid black");

    // Links (edges) between nodes
    svg
      .selectAll(".link")
      .data(root.links())
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("x1", (d) => d.source.x + 100)
      .attr("y1", (d) => d.source.y + 100)
      .attr("x2", (d) => d.target.x + 100)
      .attr("y2", (d) => d.target.y + 100)
      .style("stroke", "#aaa")
      .style("stroke-width", 2);

    // Nodes (circles)
    svg
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("cx", (d) => d.x + 100)
      .attr("cy", (d) => d.y + 100)
      .attr("r", 10)
      .style("fill", "#69b3a2");

    // Labels for nodes
    svg
      .selectAll(".label")
      .data(root.descendants())
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => d.x + 110)
      .attr("y", (d) => d.y + 105)
      .text((d) => d.data.name)
      .style("font-size", "12px")
      .style("fill", "#333");
  }, [data]);

  return <svg ref={svgRef}></svg>;
}

export default JSONTree;
