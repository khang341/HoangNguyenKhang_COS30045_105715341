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
  const svg = d3.select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", "0 0 900 560");

  const barHeight = 28;
  const gap = 12;
  const leftPad = 180;
  const topPad = 70;

  svg.append("text")
    .attr("x", 450)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .attr("class", "chart-title")
    .text("Exercise 4.5 Simple Bar Chart");

  svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("x", leftPad)
    .attr("y", (d, i) => topPad + i * (barHeight + gap))
    .attr("width", d => d.power * 4)
    .attr("height", barHeight);

  svg.selectAll(".brand-label")
    .data(data)
    .join("text")
    .attr("class", "label-text")
    .attr("x", 20)
    .attr("y", (d, i) => topPad + i * (barHeight + gap) + 19)
    .text(d => d.model);

  svg.selectAll(".value-label")
    .data(data)
    .join("text")
    .attr("class", "label-text")
    .attr("x", d => leftPad + d.power * 4 + 8)
    .attr("y", (d, i) => topPad + i * (barHeight + gap) + 19)
    .text(d => d.power.toFixed(2));
}