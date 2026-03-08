(function () {
  const selector = "#scatter";
  const margin = { top: 30, right: 30, bottom: 60, left: 70 };

  d3.csv("data/Ex5_TV_energy.csv", d => ({
    brand: d.brand,
    screen_tech: d.screen_tech,
    screensize: +d.screensize,
    energy: +d.energy_consumpt,
    star: +d.star2
  })).then(data => {
    const cleanData = data.filter(d => !isNaN(d.energy) && !isNaN(d.star));
    drawScatter(cleanData);
    new ResizeObserver(() => drawScatter(cleanData)).observe(document.querySelector(selector));
  });

  function drawScatter(data) {
    d3.select(selector).selectAll("*").remove();

    const { width, height, innerWidth, innerHeight } = containerSize(selector, margin);

    const svg = d3.select(selector)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, 8])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.energy)]).nice()
      .range([innerHeight, 0]);

    const r = d3.scaleSqrt()
      .domain(d3.extent(data, d => d.screensize))
      .range([3, 9]);

    g.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y));

    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 45)
      .attr("text-anchor", "middle")
      .text("Star Rating");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -50)
      .attr("text-anchor", "middle")
      .text("Energy Consumption (kWh/year)");

    g.selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", d => x(d.star))
      .attr("cy", d => y(d.energy))
      .attr("r", d => r(d.screensize))
      .attr("fill", "#56B4E9")
      .attr("opacity", 0.7)
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.8)
      .on("mousemove", (event, d) => {
        tooltip.show(
          `<strong>${d.brand}</strong><br>${d.screen_tech}<br>Star: ${d.star}<br>Energy: ${d.energy} kWh/year<br>Size: ${d.screensize}"`,
          event.clientX,
          event.clientY
        );
      })
      .on("mouseout", tooltip.hide);
  }
})();