const svg = d3.select(".responsive-svg-container")
  .append("svg")
  .attr("viewBox", "0 0 900 320");

svg.append("text")
  .attr("x", 450)
  .attr("y", 45)
  .attr("text-anchor", "middle")
  .attr("class", "chart-title")
  .text("Exercise 4.3 Test SVG");

svg.append("rect")
  .attr("x", 120)
  .attr("y", 110)
  .attr("width", 500)
  .attr("height", 30)
  .attr("fill", "#f4c430");

svg.append("text")
  .attr("x", 120)
  .attr("y", 170)
  .attr("class", "note-text")
  .text("This rectangle was created with D3 inside a responsive SVG container.");