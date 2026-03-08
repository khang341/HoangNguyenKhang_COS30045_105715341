d3.csv("data/excercise 2.csv", d => {
  return {
    brand: d.Brand_Reg,
    model: d.Model_No,
    power: +d.Avg_mode_power
  };
}).then(data => {
  const cleanData = data
    .filter(d => !isNaN(d.power))
    .sort((a, b) => b.power - a.power)
    .slice(0, 10);

  createBarChart(cleanData);
});

function createBarChart(data) {
  const width = 920;
  const height = 560;
  const margin = { top: 70, right: 60, bottom: 50, left: 190 };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 38)
    .attr("text-anchor", "middle")
    .attr("class", "chart-title")
    .text("Exercise 4.6 Scaled Bar Chart");

  const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.power)])
    .range([0, innerWidth]);

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.model))
    .range([0, innerHeight])
    .padding(0.2);

  chartGroup.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("x", 0)
    .attr("y", d => yScale(d.model))
    .attr("width", d => xScale(d.power))
    .attr("height", yScale.bandwidth());

  chartGroup.selectAll(".value-label")
    .data(data)
    .join("text")
    .attr("class", "label-text")
    .attr("x", d => xScale(d.power) + 8)
    .attr("y", d => yScale(d.model) + yScale.bandwidth() / 2 + 4)
    .text(d => d.power.toFixed(2));

  chartGroup.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(yScale));

  chartGroup.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale));

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 8)
    .attr("text-anchor", "middle")
    .attr("class", "note-text")
    .text("Average mode power");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 18)
    .attr("text-anchor", "middle")
    .attr("class", "note-text")
    .text("TV model");
}