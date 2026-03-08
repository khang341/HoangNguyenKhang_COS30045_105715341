(function () {
  const selector = "#bar";
  const margin = { top: 30, right: 30, bottom: 70, left: 70 };

  d3.csv("data/Ex5_TV_energy_55inchtv_byScreenType.csv", d => ({
    screenTech: d.Screen_Tech,
    energy: +d["Mean(Labelled energy consumption (kWh/year))"]
  })).then(data => {
    const cleanData = data.filter(d => !isNaN(d.energy));
    sharedColor.domain(cleanData.map(d => d.screenTech));
    buildLegend("#bar-legend", cleanData.map(d => d.screenTech), sharedColor);

    drawBar(cleanData);
    new ResizeObserver(() => drawBar(cleanData)).observe(document.querySelector(selector));
  });

  function drawBar(data) {
    d3.select(selector).selectAll("*").remove();

    const { width, height, innerWidth, innerHeight } = containerSize(selector, margin);

    const svg = d3.select(selector)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.screenTech))
      .range([0, innerWidth])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.energy)]).nice()
      .range([innerHeight, 0]);

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
      .text("Screen Technology");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -50)
      .attr("text-anchor", "middle")
      .text("Mean Energy Consumption (kWh/year)");

    g.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", d => x(d.screenTech))
      .attr("y", d => y(d.energy))
      .attr("width", x.bandwidth())
      .attr("height", d => innerHeight - y(d.energy))
      .attr("fill", d => sharedColor(d.screenTech))
      .on("mousemove", (event, d) => {
        tooltip.show(
          `<strong>${d.screenTech}</strong><br>${d.energy.toFixed(2)} kWh/year`,
          event.clientX,
          event.clientY
        );
      })
      .on("mouseout", tooltip.hide);

    g.selectAll(".bar-label")
      .data(data)
      .join("text")
      .attr("x", d => x(d.screenTech) + x.bandwidth() / 2)
      .attr("y", d => y(d.energy) - 8)
      .attr("text-anchor", "middle")
      .text(d => d.energy.toFixed(0));
  }
})();