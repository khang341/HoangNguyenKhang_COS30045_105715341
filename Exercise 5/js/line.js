(function () {
  const selector = "#line";
  const margin = { top: 30, right: 30, bottom: 60, left: 70 };

  d3.csv("data/Ex5_ARE_Spot_Prices.csv").then(raw => {
    const data = raw.map(d => ({
      year: +d.Year,
      price: +d["Average Price (notTas-Snowy)"]
    })).filter(d => !isNaN(d.year) && !isNaN(d.price));

    drawLine(data);
    new ResizeObserver(() => drawLine(data)).observe(document.querySelector(selector));
  });

  function drawLine(data) {
    d3.select(selector).selectAll("*").remove();

    const { width, height, innerWidth, innerHeight } = containerSize(selector, margin);

    const svg = d3.select(selector)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.price)]).nice()
      .range([innerHeight, 0]);

    g.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y));

    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 45)
      .attr("text-anchor", "middle")
      .text("Year");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -50)
      .attr("text-anchor", "middle")
      .text("Average Price ($ per megawatt hour)");

    const line = d3.line()
      .x(d => x(d.year))
      .y(d => y(d.price));

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#e79ad6")
      .attr("stroke-width", 3)
      .attr("d", line);

    g.selectAll(".dot")
      .data(data)
      .join("circle")
      .attr("cx", d => x(d.year))
      .attr("cy", d => y(d.price))
      .attr("r", 3)
      .attr("fill", "#e79ad6")
      .on("mousemove", (event, d) => {
        tooltip.show(
          `<strong>${d.year}</strong><br>Average price: ${d.price}`,
          event.clientX,
          event.clientY
        );
      })
      .on("mouseout", tooltip.hide);
  }
})();