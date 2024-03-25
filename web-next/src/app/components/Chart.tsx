import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import data from "../assets/data.json";

export default function Chart() {
  const chartRef = useRef(null);
  const parentRef = useRef(null); // Keep track of the parent circle

  useEffect(() => {
    if (data) {
      const width = 1000;
      const height = width;
      const radius = width / 10;

      // Define color scale for the chart
      const color = d3.scaleOrdinal(
        d3.quantize(d3.interpolateRainbow, data.children.length + 1)
      );

      // Create hierarchy data structure for D3 partition layout
      const hierarchyData = d3
        .hierarchy(data)
        .sum((d) => d.value)
        .sort((a, b) => b.value - a.value);

      // Generate partition layout using D3
      const partition = d3
        .partition()
        .size([2 * Math.PI, hierarchyData.height + 1]);
      const root = partition(hierarchyData);
      root.each((d) => (d.current = d));

      // Create arc generator for paths
      const arc = d3
        .arc()
        .startAngle((d) => d.x0)
        .endAngle((d) => d.x1)
        .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius((d) => d.y0 * radius)
        .outerRadius((d) => Math.max(d.y0 * radius, d.y1 * radius - 1));

      // Create SVG element
      const svg = d3
        .create("svg")
        .attr("viewBox", [-width / 2, -height / 2, width, width]) // Adjusting viewBox for responsive scaling
        .style("font", "8px sans-serif");

      // Append paths for each arc in the partition layout
      const path = svg
        .append("g")
        .selectAll("path")
        .data(root.descendants().slice(1))
        .join("path")
        .attr("fill", (d) => {
          while (d.depth > 1) d = d.parent;
          return color(d.data.name);
        })
        .attr("fill-opacity", (d) =>
          arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0
        )
        .attr("pointer-events", (d) =>
          arcVisible(d.current) ? "auto" : "none"
        )
        .attr("d", (d) => arc(d.current));

      // Add click event handling for interactive behavior
      path
        .filter((d) => d.children)
        .style("cursor", "pointer")
        .on("click", clicked);

      // Add tooltips using SVG 'title' elements
      const format = d3.format(",d");
      path.append("title").text(
        (d) =>
          `${d
            .ancestors()
            .map((d) => d.data.name)
            .reverse()
            .join("/")}\n${format(d.value)}`
      );

      // Append labels for each arc in the partition layout
      const label = svg
        .append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
        .selectAll("text")
        .data(root.descendants().slice(1))
        .join("text")
        .attr("dy", "0.35em")
        .attr("fill-opacity", (d) => +labelVisible(d.current))
        .attr("transform", (d) => labelTransform(d.current))
        .text((d) => d.data.name);

      // Append the SVG to the DOM only if not already appended
      if (!parentRef.current) {
        parentRef.current = svg
          .append("circle")
          .datum(root)
          .attr("r", radius)
          .attr("fill", "none")
          .attr("pointer-events", "all")
          .on("click", clicked);

        // Append the SVG container to the chartRef
        chartRef.current.appendChild(svg.node());
      }

      // Function to handle click events on arcs
      function clicked(event, p) {
        parentRef.current.datum(p.parent || root);

        root.each(
          (d) =>
            (d.target = {
              x0:
                Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
                2 *
                Math.PI,
              x1:
                Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
                2 *
                Math.PI,
              y0: Math.max(0, d.y0 - p.depth),
              y1: Math.max(0, d.y1 - p.depth),
            })
        );

        const t = svg.transition().duration(750);

        path
          .transition(t)
          .tween("data", (d) => {
            const i = d3.interpolate(d.current, d.target);
            return (t) => (d.current = i(t));
          })
          .filter(function (d) {
            return +this.getAttribute("fill-opacity") || arcVisible(d.target);
          })
          .attr("fill-opacity", (d) =>
            arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0
          )
          .attr("pointer-events", (d) =>
            arcVisible(d.target) ? "auto" : "none"
          )
          .attrTween("d", (d) => () => arc(d.current));

        label
          .filter(function (d) {
            return +this.getAttribute("fill-opacity") || labelVisible(d.target);
          })
          .transition(t)
          .attr("fill-opacity", (d) => +labelVisible(d.target))
          .attrTween("transform", (d) => () => labelTransform(d.current));
      }

      // Function to determine if arc should be visible
      function arcVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
      }

      // Function to determine if label should be visible
      // Function to determine if label should be visible
      function labelVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
      }

      // Function to transform labels
      function labelTransform(d) {
        const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
        const y = ((d.y0 + d.y1) / 2) * radius;
        return `rotate(${x - 90}) translate(${y},0) rotate(${
          x < 180 ? 0 : 180
        })`;
      }
    }
  }, []);

  // Return the chart container div
  return <div ref={chartRef} />;
}
