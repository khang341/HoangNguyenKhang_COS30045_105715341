let svg, innerChart, bars, bottomAxisG, leftAxisG;

function drawHistogram(data) {
  d3.select("#histogram").selectAll("*").remove();

  svg = d3.select("#histogram")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "Histogram of television energy consumption");

  innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const bins = binGenerator(data);

  const minX = bins[0]?.x0 ?? 0;
  const maxX = bins.length ? bins[bins.length - 1].x1 : 1;
  const maxLen = bins.length ? d3.max(bins, d => d.length) : 1;

  xScale.domain([minX, maxX]).range([0, innerWidth]);
  yScale.domain([0, maxLen]).range([innerHeight, 0]).nice();

  bars = innerChart.selectAll("rect")
    .data(bins)
    .join("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.x0) + 1.5)
    .attr("y", d => yScale(d.length))
    .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 3))
    .attr("height", d => innerHeight - yScale(d.length))
    .attr("fill", barColor);

  bottomAxisG = innerChart.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale));

  leftAxisG = innerChart.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(yScale).ticks(8));

  svg.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "end")
    .attr("x", width - 8)
    .attr("y", height - 10)
    .text("Energy consumption (kWh/year)");

  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", 10)
    .attr("y", 18)
    .text("Frequency");
}