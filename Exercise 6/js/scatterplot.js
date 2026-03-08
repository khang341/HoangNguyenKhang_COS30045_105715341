let svgS, bottomAxisGS, leftAxisGS;

function drawScatterplot(data) {
  d3.select("#scatterplot").selectAll("*").remove();

  svgS = d3.select("#scatterplot")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "Scatterplot of energy consumption and star rating");

  innerChartS = svgS.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xMin = 0;
  const xMax = 8;
  const yMaxTarget = 2600;
  const yMaxData = d3.max(data, d => d.energyConsumption);
  const yMax = Math.max(yMaxTarget, yMaxData || 0);

  xScaleS.domain([xMin, xMax]).range([0, innerWidth]).nice();
  yScaleS.domain([0, yMax]).range([innerHeight, 0]).nice();

  innerChartS.selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => xScaleS(d.star))
    .attr("cy", d => yScaleS(d.energyConsumption))
    .attr("r", 5.5)
    .attr("opacity", 0.85)
    .attr("fill", d => colorScale(d.screenTech))
    .attr("stroke", "#010101ff")
    .attr("stroke-width", 1.2);

  bottomAxisGS = innerChartS.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScaleS).ticks(8).tickFormat(d3.format("d")));

  leftAxisGS = innerChartS.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(yScaleS).ticks(10));

  svgS.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "end")
    .attr("x", width - 8)
    .attr("y", height - 10)
    .text("Star Rating");

  svgS.append("text")
    .attr("class", "axis-label")
    .attr("x", 10)
    .attr("y", 18)
    .text("Energy Consumption (kWh/year)");

  const legend = svgS.append("g")
    .attr("transform", `translate(${width - margin.right - 95}, ${margin.top + 5})`);

  colorScale.domain().forEach((type, i) => {
    const row = legend.append("g")
      .attr("transform", `translate(0, ${i * 20})`);

    row.append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", colorScale(type));

    row.append("text")
      .attr("class", "legend-text")
      .attr("x", 18)
      .attr("y", 10)
      .text(type);
  });
}